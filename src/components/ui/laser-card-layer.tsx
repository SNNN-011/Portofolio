import * as React from "react"

// Shader LaserFlow tetap diunduh terpisah: kanvasnya baru relevan saat kartu
// unggulan mendekat, jadi tidak perlu ikut bundel awal.
const LaserFlow = React.lazy(async () => {
  const mod = await import("@/components/ui/laser-flow/LaserFlow")
  return { default: mod.default as unknown as React.ComponentType<Record<string, unknown>> }
})

/** Ruang kanvas di atas kartu pada versi acuan (tampilan yang sudah disetujui). */
const REF_HEADROOM = 340
/** Ekor kanvas di bawah kartu: memberi ruang fade tumpahan cahaya. */
const TAIL = 560
/** Posisi sinar relatif terhadap lebar kartu (0.5 = tengah). */
const BEAM_ON_CARD = 0.80

/** Nilai acuan pada kanvas pendek (diukur di kartu Nano-Money). */
const REF = { beamWidth: 1.7, flare: 1.4, spill: 0.65 }

type Box = { top: number; height: number; beam: number; k: number }

/**
 * Skala internal LaserFlow: `min(width / 585, height / 507)`.
 * Semakin tinggi kanvas, semakin besar skalanya, dan semua besaran di shader
 * (lebar berkas, flare, spill) ikut membesar di layar. Karena kanvasnya kini
 * dipanjangkan sampai bawah black hole, nilainya dibagi dengan rasio ini supaya
 * tampilan di dekat kartu tetap sama seperti versi acuan.
 */
const shaderScale = (width: number, height: number) =>
  Math.max(0.2, Math.min(width / 585, height / 507))

/**
 * Berkas sinar LaserFlow untuk kartu Nano-Money.
 *
 * Kanvas mulai tepat di tepi bawah hero (black hole) dan berakhir beberapa
 * ratus px di bawah kartu, jadi sinarnya terlihat jatuh dari atas dan
 * tumpahannya masih mengalir turun. Selebar layar penuh supaya glow tidak
 * berhenti di tepi kanvas, dan berada di belakang konten (z-0).
 * Cahaya yang "tumpah" ke permukaan kartu dibuat terpisah di dalam kartu,
 * karena shader-nya tidak pernah menggambar di dalam area surface.
 */
export function LaserCardLayer() {
  const cardRef = React.useRef<HTMLElement | null>(null)
  const [box, setBox] = React.useState<Box | null>(null)
  const [armed, setArmed] = React.useState(false)

  React.useEffect(() => {
    const card = document.getElementById("nano-money-card")
    if (!card) return
    cardRef.current = card
    const hero = document.getElementById("atas")

    // Berkas baru dipasang saat kartu sudah dekat; sebelum itu tidak ada yang
    // perlu digambar, jadi shader-nya pun tidak diunduh.
    let timer = 0
    let armTimer = 0
    let armedIo: IntersectionObserver | undefined
    if (typeof IntersectionObserver === "undefined") {
      setArmed(true)
      armTimer = window.setTimeout(() => measure(), 700)
    } else {
      armedIo = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return
          setArmed(true)
          armedIo?.disconnect()
          // Reveal kartu berjalan 0,6 dtk dan menggeser posisinya; ukur ulang
          // setelah animasi selesai — bukan tiap kali halaman di-scroll.
          armTimer = window.setTimeout(() => measure(), 700)
        },
        { rootMargin: "200px 0px" }
      )
      armedIo.observe(card)
    }

    const measure = () => {
      const rect = card.getBoundingClientRect()
      const width = Math.max(1, document.documentElement.clientWidth)
      const scrollY = window.scrollY

      const cardTop = rect.top + scrollY
      const cardBottom = rect.bottom + scrollY
      // Titik mulai: tepi bawah hero. Kalau hero belum ada, pakai jarak acuan.
      const start = hero ? hero.getBoundingClientRect().bottom + scrollY : cardTop - REF_HEADROOM

      const top = Math.round(start)
      // Kanvas berhenti TAIL px di bawah kartu: cukup ruang untuk tumpahan
      // cahaya turun dan memudar sendiri, tanpa sisa glow nyangkut jauh
      // di belakang kartu proyek lain.
      const height = Math.max(REF_HEADROOM + 40, Math.round(cardBottom + TAIL - start))
      const beam = (rect.left + rect.width * BEAM_ON_CARD) / width

      // Rasio perubahan skala terhadap versi acuan; dipakai untuk menormalkan
      // lebar berkas, flare, dan spill agar tampilannya tidak ikut membesar.
      const k = Math.max(
        0.5,
        shaderScale(width, height) / shaderScale(width, rect.height + REF_HEADROOM),
      )

      setBox((prev) =>
        prev && Math.abs(prev.height - height) < 4 && Math.abs(prev.beam - beam) < 0.002
          ? prev
          : { top, height, beam, k },
      )
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
      window.clearTimeout(armTimer)
      ro.disconnect()
      armedIo?.disconnect()
      window.removeEventListener("resize", schedule)
    }
  }, [])

  if (!box || !armed) return null

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute left-0 z-0 w-full"
      style={{
        top: box.top,
        height: box.height,
        // Berkas muncul perlahan dari bawah black hole, lalu memudar di ujung
        // bawah kanvas — supaya tidak ada garis potong di mana pun.
        maskImage:
          "linear-gradient(to bottom, transparent 0, #000 160px, #000 calc(100% - 260px), transparent 100%)",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0, #000 160px, #000 calc(100% - 260px), transparent 100%)",
      }}
    >
      <React.Suspense fallback={null}>
        <LaserFlow
          surfaceRef={cardRef}
          beamPosition={box.beam}
          color="#ffffff"
          intensity={0.65}
          beamWidth={REF.beamWidth / box.k}
          flare={REF.flare / box.k}
          spread={0.75}
          spill={REF.spill / box.k}
          fog={0.2}
          dust={1.35}
          streaks={2}
          dots={1.9}
          pulse={1.3}
          speed={2.1}
          seed={2}
          mouseInteraction
          revealRadius={200}
          revealOpacity={0.5}
          theme="dark"
          intro={false}
        />
      </React.Suspense>
    </div>
  )
}
