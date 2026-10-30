import * as React from "react"
import FlexCarouselSrc from "@/components/ui/flex-carousel/FlexCarousel"
import { PHOTOS } from "@/data/photos"

// Komponen aslinya .jsx tanpa tipe; propertinya dibuka di sini.
const FlexCarousel = FlexCarouselSrc as unknown as React.ComponentType<Record<string, unknown>>

const LABEL = "text-[11px] uppercase tracking-[0.18em] text-ink-faint"

export function Photos() {
  return (
    <section id="foto" className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <p className={`${LABEL} md:col-span-3`}>Foto</p>
        <div className="md:col-span-10">
          <h2 data-reveal className="max-w-2xl font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-light tracking-[-0.03em] text-ink">
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
      <div className="relative -mt-4 h-[520px] md:-mt-24 md:h-[760px]">
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
          autoplay
          interval={2.6}
        />
      </div>
    </section>
  )
}
