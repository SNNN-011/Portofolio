// Tingkat kualitas render black hole. Efeknya tetap sama; yang diturunkan
// hanya skala internal, target fps, dan jumlah tap anti-alias di perangkat
// kecil. Skala bisa turun/naik lagi saat berjalan (lihat renderer.ts).

export interface Quality {
  /** Skala render internal terhadap ukuran CSS. 1 = pixel penuh. */
  scale: number;
  /** Batas atas fps. */
  fps: number;
  /** Tap anti-alias tepi cakram di shade.wgsl. */
  aaTaps: number;
  /** Skala terendah yang boleh dipakai penyesuaian otomatis. */
  minScale: number;
}

export function createQuality(): Quality {
  if (typeof window === "undefined") {
    return { scale: 1, fps: 60, aaTaps: 6, minScale: 0.5 };
  }

  const coarse = window.matchMedia("(pointer: coarse)").matches;
  const small = window.matchMedia("(max-width: 767px)").matches;
  const mobile = coarse || small;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const memory = nav.deviceMemory ?? 8;
  const cores = navigator.hardwareConcurrency || 8;
  const lowEnd = mobile && (memory <= 4 || cores <= 4);

  if (!mobile) {
    return { scale: 1, fps: 60, aaTaps: 6, minScale: 0.75 };
  }

  return {
    scale: lowEnd ? 0.6 : 0.75,
    fps: 30,
    aaTaps: 3,
    minScale: 0.5,
  };
}
