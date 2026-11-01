// Browser lifecycle for the baked black-hole pipeline. VGPU stays dynamically imported.

import type { Frame, Gpu, Surface } from "vgpu";

type VgpuApi = typeof import("vgpu");

import {
  createEffects,
  createTargets,
  destroyTargets,
  prewarm,
  renderChain,
  setBakeUniforms,
  setBindings,
  setPostUniforms,
  setShadeUniforms,
  type Effects,
  type Targets,
} from "./pipeline";
import { createQuality } from "./quality";
import { defaultHeroSettings } from "./settings";

const SCENE_YAW_TAU_S = 0.325;

const MAX_FRAME_DT_S = 0.1;

const FRAME_PACING_EPSILON_MS = 2;

const MOBILE_QUERY = "(max-width: 767px)";

/** Jumlah frame lambat/cepat berturut-turut sebelum skala internal diubah. */
const SLOW_FRAMES_BEFORE_DOWNGRADE = 40;
const FAST_FRAMES_BEFORE_UPGRADE = 240;

interface RendererOptions {
  canvas: HTMLCanvasElement;
}

type RenderSize = { width: number; height: number };

export function createRenderer({ canvas }: RendererOptions) {
  const quality = createQuality();
  let scale = quality.scale;
  const minFrameIntervalMs = 1000 / quality.fps - FRAME_PACING_EPSILON_MS;

  /** Ukuran buffer GPU: ukuran CSS dikali skala kualitas. */
  const bufferSize = (width: number, height: number): [number, number] => [
    Math.max(1, Math.round(width * scale)),
    Math.max(1, Math.round(height * scale)),
  ];

  const settings = defaultHeroSettings();
  const desktopLayout = {
    centerX: settings.centerX,
    centerY: settings.centerY,
    cameraRoll: settings.cameraRoll,
    mouseYaw: settings.mouseYaw,
    centerFade: settings.centerFade,
  };
  const mobileQuery = window.matchMedia(MOBILE_QUERY);
  const applyResponsiveLayout = () => {
    Object.assign(
      settings,
      mobileQuery.matches
        ? {
            centerX: 0,
            centerY: 0,
            cameraRoll: 0,
            mouseYaw: 0,
            centerFade: 1,
          }
        : desktopLayout
    );
  };
  applyResponsiveLayout();
  const bloomScale = Math.min(Math.max(window.devicePixelRatio, 1), 2) / 2;
  settings.bloom.radius *= bloomScale;
  settings.bloom.strength *= bloomScale;

  let disposed = false;

  let api: VgpuApi | undefined;
  let gpu: Gpu | undefined;
  let surface: Surface | undefined;
  let effects: Effects | undefined;
  let targets: Targets | undefined;
  let loop: { stop(): void } | undefined;
  let observer: ResizeObserver | undefined;
  let intersection: IntersectionObserver | undefined;
  let documentVisible =
    typeof document === "undefined" ? true : !document.hidden;
  let canvasIntersecting = true;

  let started = false;
  let animationTime = 0;
  let lastFrameAt: number | undefined;
  let resizeFrame = 0;
  let pendingSize: RenderSize | undefined;
  let forceBake = true;
  let pointerXNormalized = 0;
  let currentSceneYaw = 0;
  let lastYawAt: number | undefined;

  const onLayoutChange = () => {
    applyResponsiveLayout();
    forceBake = true;
  };
  mobileQuery.addEventListener("change", onLayoutChange);

  const onPointerMove = (event: PointerEvent) => {
    if (event.pointerType !== "mouse") return;
    const width = Math.max(window.innerWidth, 1);
    pointerXNormalized = Math.min(
      1,
      Math.max(-1, (event.clientX / width) * 2 - 1)
    );
  };

  const recenterPointer = () => {
    pointerXNormalized = 0;
  };
  const onPointerOut = (event: PointerEvent) => {
    if (event.relatedTarget === null) recenterPointer();
  };
  const onVisibilityChange = () => {
    if (document.hidden) recenterPointer();
    documentVisible = !document.hidden;
    reconcileLoop();
  };

  function reconcileLoop(): void {
    if (!started || !gpu || !api) return;
    const shouldRun = !disposed && documentVisible && canvasIntersecting;
    if (shouldRun === Boolean(loop)) return;
    if (shouldRun) {
      lastFrameAt = undefined;
      lastYawAt = undefined;
      loop = startPacedLoop(api, gpu);
    } else {
      loop?.stop();
      loop = undefined;
    }
  }

  function startPacedLoop(vgpu: VgpuApi, activeGpu: Gpu): { stop(): void } {
    let stopped = false;

    let lastPresentedAt: number | undefined;
    let slowFrames = 0;
    let fastFrames = 0;

    // Turunkan/naikkan skala render kalau frame tidak stabil. Ukurannya
    // dihitung ulang di rAF berikutnya, jadi efek tidak pernah hilang.
    const retune = (next: number) => {
      scale = next;
      slowFrames = 0;
      fastFrames = 0;
      measure();
    };

    const tick = (timestamp: number): void => {
      if (stopped) return;
      if (
        lastPresentedAt === undefined ||
        timestamp - lastPresentedAt >= minFrameIntervalMs
      ) {
        if (lastPresentedAt !== undefined) {
          const gap = timestamp - lastPresentedAt;
          if (gap > minFrameIntervalMs * 1.45) {
            slowFrames += 1;
            fastFrames = 0;
          } else if (gap < minFrameIntervalMs * 1.12) {
            fastFrames += 1;
            slowFrames = 0;
          } else {
            slowFrames = 0;
            fastFrames = 0;
          }
        }
        lastPresentedAt = timestamp;
        try {
          vgpu.frame(activeGpu, renderFrame);
        } catch (error) {
          handleFailure(error);
        }
        if (slowFrames >= SLOW_FRAMES_BEFORE_DOWNGRADE && scale > quality.minScale) {
          retune(Math.max(quality.minScale, scale - 0.1));
        } else if (
          fastFrames >= FAST_FRAMES_BEFORE_UPGRADE &&
          scale < quality.scale
        ) {
          retune(Math.min(quality.scale, scale + 0.05));
        }
      }
      if (!stopped) frameHandle = requestAnimationFrame(tick);
    };
    let frameHandle = requestAnimationFrame(tick);
    return {
      stop(): void {
        stopped = true;
        cancelAnimationFrame(frameHandle);
      },
    };
  }

  const advanceAnimationTime = (now: number): number => {
    animationTime +=
      lastFrameAt === undefined ? 0 : Math.max(0, (now - lastFrameAt) / 1000);
    lastFrameAt = now;
    return animationTime;
  };

  const renderFrame = (frame: Frame): void => {
    if (disposed || !effects || !targets || !surface) return;
    const now = clockMs();
    const runBake = forceBake;
    forceBake = false;
    if (runBake) setBakeUniforms(effects, targets, settings);
    setShadeUniforms(
      effects,
      targets,
      settings,
      advanceAnimationTime(now),
      advanceSceneYaw(now)
    );
    renderChain(frame, effects, targets, surface, runBake);
  };

  const advanceSceneYaw = (now: number): number => {
    if (settings.mouseYaw <= 0) {
      currentSceneYaw = 0;
      lastYawAt = now;
      return 0;
    }
    const dt =
      lastYawAt === undefined
        ? 0
        : Math.min(Math.max((now - lastYawAt) / 1000, 0), MAX_FRAME_DT_S);
    lastYawAt = now;
    const target = pointerXNormalized * Math.max(0, settings.mouseYaw);
    currentSceneYaw +=
      (target - currentSceneYaw) * (1 - Math.exp(-dt / SCENE_YAW_TAU_S));
    return currentSceneYaw;
  };

  const applyResize = () => {
    resizeFrame = 0;
    const size = pendingSize;
    pendingSize = undefined;
    if (disposed || !size || !gpu || !api || !effects || !targets || !surface)
      return;
    try {
      // Surface tidak memakai auto-resize (lihat initialize): ukuran buffer
      // dikelola di sini supaya skala kualitas bisa berubah saat berjalan.
      const next = bufferSize(size.width, size.height);
      if (
        targets &&
        next[0] === surface.size[0] &&
        next[1] === surface.size[1]
      ) {
        return;
      }
      surface.resize(next);
      const previousTargets = targets;
      const nextTargets = createTargets(api, gpu, next);
      try {
        setBindings(effects, nextTargets);
        setPostUniforms(effects, nextTargets, settings);
      } catch (error) {
        destroyTargets(nextTargets);
        throw error;
      }
      targets = nextTargets;
      destroyTargets(previousTargets);
      forceBake = true;
    } catch (error) {
      handleFailure(error);
    }
  };
  const resize = (size: RenderSize) => {
    if (disposed || size.width <= 0 || size.height <= 0) return;
    pendingSize = size;
    if (!resizeFrame) resizeFrame = requestAnimationFrame(applyResize);
  };

  const measure = () => {
    resize({
      width: canvas.clientWidth,
      height: canvas.clientHeight,
    });
  };

  const dispose = () => {
    if (disposed) return;
    disposed = true;
    loop?.stop();
    if (resizeFrame) cancelAnimationFrame(resizeFrame);
    observer?.disconnect();
    intersection?.disconnect();
    if (typeof window !== "undefined") {
      mobileQuery.removeEventListener("change", onLayoutChange);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerout", onPointerOut);
      window.removeEventListener("blur", recenterPointer);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    }
    gpu?.dispose();
  };

  const initialize = async () => {
    const vgpu = await import("vgpu");
    const { init } = vgpu;
    if (disposed) return;
    const nextGpu = await init();
    if (disposed) {
      nextGpu.dispose();
      return;
    }
    gpu = nextGpu;
    api = vgpu;
    const cssWidth = Math.max(1, canvas.clientWidth);
    const cssHeight = Math.max(1, canvas.clientHeight);
    surface = vgpu.surface(gpu, canvas, {
      autoResize: false,
      dpr: 1,
      size: bufferSize(cssWidth, cssHeight),
    });
    effects = createEffects(vgpu, gpu, quality.aaTaps);
    targets = createTargets(vgpu, gpu, surface.size);
    setBakeUniforms(effects, targets, settings);
    setShadeUniforms(effects, targets, settings, animationTime, currentSceneYaw);
    setBindings(effects, targets);
    setPostUniforms(effects, targets, settings);
    await prewarm(effects, targets, surface);
    if (disposed) return;
    observer =
      typeof ResizeObserver === "undefined"
        ? undefined
        : new ResizeObserver(measure);
    observer?.observe(canvas);
    window.addEventListener("pointermove", onPointerMove, { passive: true });
    window.addEventListener("pointerout", onPointerOut, { passive: true });
    window.addEventListener("blur", recenterPointer);
    document.addEventListener("visibilitychange", onVisibilityChange);
    if (typeof IntersectionObserver !== "undefined") {
      intersection = new IntersectionObserver(
        (entries) => {
          canvasIntersecting =
            entries[entries.length - 1]?.isIntersecting ?? canvasIntersecting;
          reconcileLoop();
        },
        { threshold: 0 }
      );
      intersection.observe(canvas);
    }
    measure();
    // Terapkan ukuran awal saat itu juga; rAF bisa tertunda atau tidak jalan
    // (tab latar belakang), dan kalau itu terjadi buffer tetap 300x150 bawaan.
    if (pendingSize) applyResize();
    started = true;
    documentVisible = !document.hidden;
    reconcileLoop();
  };

  function handleFailure(error: unknown): never {
    dispose();
    throw error;
  }

  const ready = initialize().catch((error: unknown) => {
    if (disposed) return;
    handleFailure(error);
  });

  return { ready, dispose };
}

function clockMs(): number {
  return typeof performance === "undefined" ? Date.now() : performance.now();
}
