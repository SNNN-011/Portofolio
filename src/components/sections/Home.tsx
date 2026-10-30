import * as React from "react"
import { BlackHoleCanvas } from "@/components/ui/black-hole-canvas"
import { LINKS } from "@/data/projects"
import { Projects } from "@/components/sections/Projects"
import { Photos } from "@/components/sections/Photos"

/** Reveal sekali saat masuk viewport. Tidak ada animasi keluar. */
function useReveal() {
  React.useEffect(() => {
    const nodes = Array.from(document.querySelectorAll<HTMLElement>("[data-reveal]"))
    if (!("IntersectionObserver" in window)) {
      nodes.forEach((n) => n.classList.add("is-in"))
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          entry.target.classList.add("is-in")
          io.unobserve(entry.target)
        }
      },
      { rootMargin: "-60px 0px -10% 0px" }
    )
    nodes.forEach((n) => io.observe(n))
    return () => io.disconnect()
  }, [])
}

const LABEL = "text-[11px] uppercase tracking-[0.18em] text-ink-faint"

export function Home() {
  useReveal()

  return (
    <>
      {/* ---------- HERO ---------- */}
      <section id="atas" className="relative isolate min-h-[100svh] overflow-hidden">
        <BlackHoleCanvas />
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-[42vh] bg-gradient-to-b from-transparent via-bg/70 to-bg" />

        <div className="relative mx-auto flex min-h-[100svh] max-w-[1400px] flex-col justify-end px-6 pb-10 pt-28 md:px-10">
          <h1 className="font-display text-[clamp(3.6rem,15vw,12rem)] font-light leading-[0.86] tracking-[-0.045em] text-white">
            Yasin Anr
          </h1>

          <p className="mt-7 max-w-md text-[clamp(0.95rem,1.4vw,1.125rem)] leading-relaxed text-white/65">
            Software engineer &amp; AI developer.
          </p>

          <div className="relative mt-16 flex items-end justify-between">
            <span className={LABEL}>Gulir</span>
            <span className={LABEL}>2026</span>
          </div>
        </div>
      </section>

      {/* ---------- PROFIL ---------- */}
      <section id="profil" className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <p className={`${LABEL} md:col-span-3`}>Profil</p>

          <div className="md:col-span-10">
            <p data-reveal className="max-w-4xl font-display text-[clamp(1.55rem,3.2vw,2.6rem)] font-light leading-[1.22] tracking-[-0.02em] text-ink">
              Building smart web and mobile apps—menggabungkan fondasi software engineering dengan kapabilitas AI modern.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- PENDEKATAN ---------- */}
      <section className="mx-auto max-w-[1400px] px-6 pb-24 md:px-10 md:pb-32">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <p className={`${LABEL} md:col-span-3`}>Pendekatan</p>

          <div className="md:col-span-10">
            <div className="grid max-w-4xl gap-x-12 gap-y-8 md:grid-cols-2">
              <p data-reveal className="text-[15.5px] leading-[1.75] text-ink-soft">
                Saya menyukai proses merakit produk secara utuh (end-to-end), mulai dari penulisan logika sistem, penerapan model AI, sampai merapikan antarmuka
                penggunanya.
              </p>
              <p data-reveal className="text-[15.5px] leading-[1.75] text-ink-soft">
                Mahasiswa Computer Science di Universitas Djuanda Bogor yang juga punya ketertarikan besar pada dunia visual storytelling dan color grading.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- KARYA ---------- */}
      <Projects />

      {/* ---------- FOTO ---------- */}
      <Photos />

      {/* ---------- KONTAK ---------- */}
      <section id="kontak" className="mx-auto max-w-[1400px] px-6 py-28 md:px-10 md:py-40">
        <div className="grid gap-10 md:grid-cols-12 md:gap-8">
          <p className={`${LABEL} md:col-span-3`}>Kontak</p>

          <div className="md:col-span-10">
            <a
              data-reveal
              href="mailto:myasinaldinar@gmail.com"
              className="inline-block font-display text-[clamp(1.6rem,4.4vw,3.4rem)] font-light leading-[1.1] tracking-[-0.03em] text-ink transition-colors hover:text-accent"
            >
              myasinaldinar@gmail.com
            </a>

            <ul className="mt-14 flex flex-wrap gap-x-10 gap-y-3">
              {LINKS.filter((l) => l.label !== "Email").map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noreferrer noopener"
                    className="text-[13px] text-ink-soft underline-offset-[6px] transition-colors hover:text-ink hover:underline"
                  >
                    {l.label} <span className="text-ink-faint">{l.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <footer className="mx-auto max-w-[1400px] border-t border-line px-6 py-10 md:px-10">
        <div className="flex flex-col gap-3 text-[11px] uppercase tracking-[0.14em] text-ink-faint sm:flex-row sm:items-center sm:justify-between">
          <span>Yasin Anr · Bogor, Indonesia</span>
          <span>It won't change just because you wanted to.</span>
        </div>
      </footer>
    </>
  )
}
