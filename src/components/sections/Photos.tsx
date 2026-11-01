import * as React from "react"
import { PHOTOS } from "@/data/photos"

// Carousel-nya WebGL dan memuat 23 tekstur foto (~2,9 MB). Diimpor dinamis
// supaya bundel awal tetap kecil dan fotonya baru diunduh saat mendekati galeri.
const FlexCarousel = React.lazy(async () => {
  const mod = await import("@/components/ui/flex-carousel/FlexCarousel")
  return { default: mod.default as unknown as React.ComponentType<Record<string, unknown>> }
})

const LABEL = "text-[11px] uppercase tracking-[0.18em] text-ink-faint"

/** Autoplay carousel dimatikan di HP: geser manual tetap jalan. */
const isMobile = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(max-width: 767px), (pointer: coarse)").matches

/** Pasang isi berat setelah elemennya mendekati viewport. */
function useNearViewport<T extends HTMLElement>(rootMargin = "250px 0px") {
  const ref = React.useRef<T>(null)
  const [near, setNear] = React.useState(false)

  React.useEffect(() => {
    const el = ref.current
    if (!el) return
    if (!("IntersectionObserver" in window)) {
      setNear(true)
      return
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return
        setNear(true)
        io.disconnect()
      },
      { rootMargin }
    )
    io.observe(el)
    return () => io.disconnect()
  }, [rootMargin])

  return [ref, near] as const
}

export function Photos() {
  const [stageRef, near] = useNearViewport<HTMLDivElement>()

  return (
    <section id="foto" className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <p className={`${LABEL} md:col-span-3`}>Foto</p>
        <div className="md:col-span-10">
          <h2 data-reveal className="max-w-2xl font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold tracking-[-0.03em] text-ink">
            Mengolah file mentah menjadi visual yang punya suasana, lewat Lightroom dan Photoshop.
          </h2>
          <p data-reveal className="mt-3 max-w-xl text-[15px] leading-[1.75] text-ink-soft">
            Berisi hasil color grading yang diolah menggunakan Adobe Photoshop dan Lightroom. Geser untuk menjelajahi galeri atau klik foto untuk membuka
            tampilan penuh.
          </p>
        </div>
      </div>

      {/* Digeser sedikit ke atas: judulnya kini 3 baris, jadi tanpa ini kartu
          foto terdorong turun dan kepotong di bawah lipatan layar. */}
      <div ref={stageRef} className="relative -mt-4 h-[520px] md:-mt-24 md:h-[760px]">
        {near && (
          <React.Suspense fallback={null}>
            <FlexCarousel
              items={PHOTOS}
              preset="liquid"
              intro="none"
              cardHeight={0.55}
              gap={12}
              radius={14}
              squeeze={0.2}
              bend={0.2}
              focusOnClick
              captions
              captureWheel={false}
              autoplay={!isMobile()}
              interval={2.6}
            />
          </React.Suspense>
        )}
      </div>
    </section>
  )
}
