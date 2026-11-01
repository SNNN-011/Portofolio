import * as React from "react"
import { createRenderer } from "./black-hole/renderer"

/** Aset publik harus ikut `base` supaya jalan di sub-path GitHub Pages. */
const POSTER_BASE = `${import.meta.env.BASE_URL}assets/black-hole/`

/**
 * Host untuk contoh vgpu "optimized-black-hole".
 * Sumber di ./black-hole/ diambil apa adanya dari manifest vgpu.sh dan
 * diverifikasi sha256-nya; file shader tidak diubah, hanya cara impornya
 * (lihat plugin wgsl-as-text di vite.config.ts).
 *
 * Canvas baru dipasang kalau perangkat punya WebGPU dan pengguna tidak
 * meminta reduced-motion. Kalau gagal, lapisan gradien statis yang tampil.
 */
export function BlackHoleCanvas() {
  const canvasRef = React.useRef<HTMLCanvasElement>(null)
  const [live, setLive] = React.useState(false)

  React.useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (typeof navigator === "undefined" || !("gpu" in navigator)) return
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return

    let disposed = false
    let renderer: ReturnType<typeof createRenderer> | undefined
    const g = window as unknown as { __bh?: { stage: string } }
    g.__bh = { stage: "timer-scheduled" }

    // Ditunda supaya tidak berebut dengan paint pertama.
    const timer = window.setTimeout(() => {
      if (disposed || !canvasRef.current) return
      try {
        renderer = createRenderer({ canvas: canvasRef.current })
        g.__bh = { stage: "renderer-created" }
      } catch (error) {
        g.__bh = { stage: "create-failed:" + String(error) }
        return
      }
      renderer.ready
        .then(() => {
          g.__bh = { stage: "ready" }
          if (!disposed) setLive(true)
        })
        .catch((error: unknown) => {
          g.__bh = { stage: "ready-rejected:" + String(error) }
          // Fallback gradient tetap tampil; errornya jangan ditelan diam-diam.
          console.error("[black-hole] renderer gagal:", error)
          if (!disposed) renderer?.dispose()
        })
    }, 250)

    return () => {
      disposed = true
      window.clearTimeout(timer)
      renderer?.dispose()
    }
  }, [])

  return (
    <div aria-hidden="true" className="absolute inset-0 overflow-hidden bg-[#060708]">
      {/* cadangan terakhir kalau poster pun gagal dimuat */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_62%_38%,rgba(255,255,255,0.06),transparent_55%)]" />
      {/* Poster dirender dari efek aslinya: langsung tampil selagi WebGPU
          menyiapkan shader, dan menjadi tampilan final di perangkat tanpa
          WebGPU / dengan reduced-motion. */}
      <picture>
        <source media="(max-width: 767px)" srcSet={`${POSTER_BASE}poster-mobile.webp`} />
        <img
          src={`${POSTER_BASE}poster-desktop.webp`}
          alt=""
          decoding="async"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover"
        />
      </picture>
      <canvas
        ref={canvasRef}
        className={`relative block h-full w-full touch-none transition-opacity duration-700 ${live ? "opacity-100" : "opacity-0"}`}
      />
    </div>
  )
}
