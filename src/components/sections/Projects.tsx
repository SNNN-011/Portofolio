import * as React from "react"
import { PROJECTS, type Project } from "@/data/projects"
import { PREVIEWS } from "@/components/ui/project-previews"

const LABEL = "text-[11px] uppercase tracking-[0.18em] text-ink-faint"

function Stack({ items }: { items: string[] }) {
  return (
    <ul className="mt-5 flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li key={s} className="rounded-full border border-line px-2.5 py-1 text-[11px] text-ink-faint">
          {s}
        </li>
      ))}
    </ul>
  )
}

function RepoLink({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="mt-6 inline-flex items-center gap-1.5 text-[13px] text-ink underline-offset-[5px] transition-colors hover:text-accent-text hover:underline"
    >
      Lihat repositori
      <span aria-hidden="true" className="text-ink-faint">↗</span>
    </a>
  )
}

function Body({ p }: { p: Project }) {
  return (
    <>
      <p className="text-[11px] uppercase tracking-[0.16em] text-ink-faint">{p.badge}</p>
      <h3 className="mt-3 font-display text-[clamp(1.5rem,2.4vw,2rem)] font-bold leading-tight tracking-[-0.03em] text-ink">{p.name}</h3>
      <p className="mt-2 text-[13.5px] text-ink-soft">{p.tagline}</p>
      <p className="mt-3 text-[13.5px] leading-[1.7] text-ink-soft">{p.description}</p>
      <Stack items={p.stack} />
      <RepoLink href={p.repo} />
    </>
  )
}

export function Projects() {
  const [feature, ...rest] = PROJECTS
  const FeaturePreview = PREVIEWS[feature.preview]

  return (
    <section id="karya" className="mx-auto max-w-[1400px] px-6 py-24 md:px-10 md:py-32">
      <div className="grid gap-10 md:grid-cols-12 md:gap-8">
        <p className={`${LABEL} md:col-span-3`}>Karya</p>

        <div className="md:col-span-10">
          <h2 data-reveal className="font-display text-[clamp(1.9rem,3.6vw,2.9rem)] font-bold tracking-[-0.03em] text-ink">
            Lima proyek, semuanya bisa dibaca kodenya.
          </h2>
          <p data-reveal className="mt-4 max-w-xl text-[15px] leading-[1.75] text-ink-soft">
            Tiap kartu memperlihatkan potongan cara pakainya.
          </p>

          <div className="mt-12 grid grid-cols-1 gap-4 lg:grid-cols-2">
            <article
              id="nano-money-card"
              data-reveal
              className="relative rounded-2xl border border-line bg-surface p-6 md:p-8 lg:col-span-2"
            >
              {/* Pantulan berkas LaserFlow di permukaan kartu. Shader-nya
                  berhenti di tepi kartu (area surface di-mask), jadi cahaya
                  yang "tumpah" ke atas kartu dibuat di sini. */}
              <span
                aria-hidden="true"
                className="pointer-events-none absolute inset-x-0 top-0 h-56 rounded-t-2xl"
                style={{
                  background:
                    "radial-gradient(58% 100% at 80% 0%, rgba(255,255,255,0.26), transparent 72%)",
                }}
              />
              <div className="relative grid gap-8 lg:grid-cols-2 lg:items-center">
                <div>
                  <Body p={feature} />
                </div>
                <div className="min-h-[280px] overflow-hidden">
                  <FeaturePreview />
                </div>
              </div>
            </article>

            {rest.map((p) => {
              const Preview = PREVIEWS[p.preview]
              return (
                <article key={p.id} data-reveal className="flex flex-col rounded-2xl border border-line bg-surface">
                  <div className="h-[200px] shrink-0 overflow-hidden p-3">
                    <Preview />
                  </div>
                  <div className="flex flex-1 flex-col px-6 pb-6 pt-4 md:px-7 md:pb-7">
                    <Body p={p} />
                  </div>
                </article>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  )
}
