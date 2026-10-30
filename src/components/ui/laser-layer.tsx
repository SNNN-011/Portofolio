import * as React from "react"
import LaserFlowSrc from "@/components/ui/laser-flow/LaserFlow"

// Komponen aslinya .jsx tanpa tipe; propertinya dibuka di sini.
const LaserFlow = LaserFlowSrc as unknown as React.ComponentType<Record<string, unknown>>

/**
 * Berkas sinar seukuran layar penuh — preset "Waterfall".
 *
 * Kanvasnya selebar layar dan tingginya diukur dari PUNCAK dokumen sampai
 * bawah kartu Nano-Money. Jadi:
 *  - ujung atasnya ada di y=0 dokumen (tertutup hero), tidak pernah terlihat
 *    sebagai garis potong;
 *  - ujung kanan berimpit dengan tepi layar, jadi tidak terpotong;
 *  - ujung bawahnya berhenti di kartu, sehingga tetap terbaca sebagai berkas
 *    yang jatuh ke kartu, bukan sebagai latar halaman.
 */
export function LaserLayer() {
  const cardRef = React.useRef<HTMLElement | null>(null)
  const [height, setHeight] = React.useState<number | null>(null)

  React.useEffect(() => {
    const card = document.getElementById("nano-money-card")
    if (!card) return
    cardRef.current = card

    let timer = 0
    const measure = () => {
      const bottom = card.getBoundingClientRect().bottom + window.scrollY
      setHeight((prev) => (prev && Math.abs(prev - bottom) < 4 ? prev : Math.round(bottom)))
    }
    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(measure, 120)
    }

    measure()
    const settle = window.setTimeout(measure, 600)
    const ro = new ResizeObserver(schedule)
    ro.observe(document.body)
    window.addEventListener("resize", schedule)

    return () => {
      window.clearTimeout(settle)
      window.clearTimeout(timer)
      ro.disconnect()
      window.removeEventListener("resize", schedule)
    }
  }, [])

  if (!height) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 top-0 z-0 w-full"
      style={{ height }}
    >
      <LaserFlow
        surfaceRef={cardRef}
        beamPosition={0.72}
        color="#3847ff"
        intensity={1.6}
        beamWidth={0.72}
        flare={0.85}
        spread={1.5}
        spill={1}
        fog={0.3}
        dust={1.6}
        streaks={1.5}
        dots={1}
        pulse={1.5}
        speed={1.5}
        seed={3}
        mouseInteraction={false}
        theme="dark"
        intro={false}
      />
    </div>
  )
}
