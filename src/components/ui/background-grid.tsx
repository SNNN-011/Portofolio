import * as React from "react"
import CursorGridSrc from "@/components/ui/cursor-grid/CursorGrid"

// Komponen aslinya .jsx tanpa tipe; propertinya dibuka di sini.
const CursorGrid = CursorGridSrc as unknown as React.ComponentType<Record<string, unknown>>

const CELL = 20 // harus sama dengan cellSize di bawah

/**
 * Latar halaman: grid titik yang menyala mengikuti kursor.
 *
 * Kanvas-nya satu layar penuh, tapi digeser mengikuti scroll sebesar satu sel,
 * jadi polanya terasa menempel di dokumen — bukan diam di belakang konten yang
 * bergerak. Bleed 32 px di tiap sisi supaya geserannya tidak membuka celah.
 */
export function BackgroundGrid() {
  const innerRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const el = innerRef.current
    if (!el) return
    const apply = () => {
      el.style.transform = `translate3d(0, ${-(window.scrollY % CELL)}px, 0)`
    }
    // Satu penulisan style per event; scroll sudah di-throttle browser,
    // jadi tidak perlu requestAnimationFrame (yang bisa tidak pernah tick).
    apply()
    window.addEventListener("scroll", apply, { passive: true })
    return () => {
      window.removeEventListener("scroll", apply)
    }
  }, [])

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div ref={innerRef} className="absolute -inset-8 will-change-transform">
        <CursorGrid
          cellSize={CELL}
        gridStyle="dashed"
        color="#ffffff"
        gridColor="#ffffff"
        gridOpacity={0.1}
        fillOpacity={0.075}
        maxOpacity={1}
        radius={75}
        spotlight={0.8}
        holdTime={150}
        fadeDuration={700}
        edgeFade={0.28}
          clickPulse
          intro
        />
      </div>
    </div>
  )
}
