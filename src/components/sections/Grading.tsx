import * as React from "react"
import { GRADES } from "@/data/grading"
import { BeforeAfterCard } from "@/components/ui/before-after-card"
import { SpotlightCard } from "@/components/ui/spotlight-card"

const SWATCHES = [
  { name: "Soft Cream", hex: "#FAF6EE" },
  { name: "Warm Sand", hex: "#D8C6A8" },
  { name: "Crimson Red", hex: "#C83E31" },
  { name: "Deep Forest", hex: "#163524" },
]

const APPS = ["Adobe Lightroom", "Adobe Photoshop", "CapCut"]

export function Grading() {
  const [allBefore, setAllBefore] = React.useState(false)

  return (
    <>
      <section className="mx-auto max-w-6xl px-4 pt-32 md:pt-36">
        <div className="max-w-3xl">
            <h1 className="text-[clamp(2.2rem,6.5vw,3.8rem)] font-extrabold text-ink">Color Grading &amp; Visual Lab</h1>
            <p className="mt-4 max-w-2xl text-[clamp(1.05rem,2vw,1.3rem)] font-semibold leading-[1.35] text-primary-text">
              Menjaga highlight tetap hangat dan lembut, bayangan jatuh ke hijau pekat, dengan sentuhan aksen merah yang berkarakter.
            </p>
            <p className="mt-4 max-w-2xl text-[15.5px] leading-relaxed text-ink-soft">
              Kumpulan hasil olah warna pribadi menggunakan Adobe Lightroom, Photoshop, dan CapCut. Setiap foto ditampilkan dalam hasil akhirnya (After)—arahkan kursor di desktop atau
              ketuk foto di ponsel untuk melihat foto aslinya (Before).
            </p>

            <div className="mt-7 space-y-4">
              <ul className="flex flex-wrap gap-4">
                {SWATCHES.map((s) => (
                  <li key={s.name} className="flex items-center gap-2">
                    <span className="h-7 w-7 shrink-0 rounded-full border border-line" style={{ backgroundColor: s.hex }} aria-hidden="true" />
                    <span className="text-[12px] leading-tight text-ink-soft">
                      <span className="block font-semibold text-ink">{s.name}</span>
                      <span className="tabular-nums">{s.hex}</span>
                    </span>
                  </li>
                ))}
              </ul>
              <ul className="flex flex-wrap gap-1.5">
                {APPS.map((a) => (
                  <li key={a} className="rounded-full border border-line bg-surface-2/70 px-3 py-1 text-[12px] font-medium text-ink-soft">
                    {a}
                  </li>
                ))}
              </ul>
            </div>
          </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 pb-24 pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 pb-7">
          <p className="text-[14px] text-ink-soft">{GRADES.length} karya, semua pasangan before/after</p>
          <button
            type="button"
            aria-pressed={allBefore}
            onClick={() => setAllBefore((v) => !v)}
            className={[
              "rounded-full px-5 py-2.5 text-[13px] font-semibold transition-colors",
              allBefore ? "bg-accent text-accent-ink" : "bg-primary text-primary-ink hover:opacity-90",
            ].join(" ")}
          >
            {allBefore ? "Kembali ke hasil grading" : "Bandingkan semua"}
          </button>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          {GRADES.map((g, i) => (
            <SpotlightCard key={g.id} className="p-3">
              <BeforeAfterCard grade={g} forceBefore={allBefore} onBreakGlobal={() => setAllBefore(false)} index={i} />
            </SpotlightCard>
          ))}
        </div>
      </section>
    </>
  )
}
