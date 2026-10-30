import * as React from "react"
import { FILTERS, LINKS, PROJECTS, type Project, type ProjectCategory } from "@/data/projects"
import { SpotlightCard } from "@/components/ui/spotlight-card"
import { TechMarquee } from "@/components/ui/tech-marquee"
import { PREVIEWS } from "@/components/ui/project-previews"
import { BlackHoleCanvas } from "@/components/ui/black-hole-canvas"

const ico = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)

const SOCIAL_ICON: Record<string, React.ReactNode> = {
  GitHub: ico(<><path d="m8 8-4 4 4 4" /><path d="m16 8 4 4-4 4" /></>),
  Instagram: ico(<><rect x="3.5" y="3.5" width="17" height="17" rx="4.5" /><circle cx="12" cy="12" r="3.6" /><circle cx="17" cy="7" r="1" fill="currentColor" stroke="none" /></>),
  X: ico(<><path d="M4 4l16 16" /><path d="M20 4 4 20" /></>),
  Email: ico(<><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4 7 8 6 8-6" /></>),
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center rounded-full border border-accent/30 bg-accent/8 px-2.5 py-1 text-[11px] font-bold text-accent">
      {children}
    </span>
  )
}

function TechPills({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-1.5">
      {items.map((s) => (
        <li key={s} className="rounded-full bg-surface-2 px-3 py-1 text-[12px] font-medium text-ink-soft">
          {s}
        </li>
      ))}
    </ul>
  )
}

function RepoButton({ href }: { href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer noopener"
      className="inline-flex w-fit items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[13px] font-semibold text-primary-ink transition-opacity hover:opacity-90"
    >
      Lihat Repositori
      <span aria-hidden="true">↗</span>
    </a>
  )
}

function ProjectBody({ p }: { p: Project }) {
  return (
    <>
      <Badge>{p.badge}</Badge>
      <h3 className="mt-3 text-2xl font-bold text-ink">{p.name}</h3>
      <p className="mt-1.5 text-[15px] font-semibold text-primary-text">{p.tagline}</p>
      <p className="mt-3 text-[15px] leading-relaxed text-ink-soft">{p.description}</p>
      <div className="mt-5">
        <TechPills items={p.stack} />
      </div>
      <div className="mt-6">
        <RepoButton href={p.repo} />
      </div>
    </>
  )
}

function FeatureCard({ p }: { p: Project }) {
  const Preview = PREVIEWS[p.preview]
  return (
    <SpotlightCard className="lg:col-span-2">
      <div className="grid gap-8 p-6 md:p-8 lg:grid-cols-[1fr_1fr] lg:items-center">
        <div>
          <ProjectBody p={p} />
        </div>
        <div className="min-h-[260px]">
          <Preview />
        </div>
      </div>
    </SpotlightCard>
  )
}

function ProjectCard({ p }: { p: Project }) {
  const Preview = PREVIEWS[p.preview]
  return (
    <SpotlightCard className="flex flex-col">
      <div className="h-[190px] shrink-0 overflow-hidden p-3">
        <Preview />
      </div>
      <div className="flex flex-1 flex-col p-6 pt-3">
        <ProjectBody p={p} />
      </div>
    </SpotlightCard>
  )
}

export function Engineering() {
  const [filter, setFilter] = React.useState<"all" | ProjectCategory>("all")
  const list = filter === "all" ? PROJECTS : PROJECTS.filter((p) => p.category === filter)
  const feature = filter === "all" ? list[0] : undefined
  const rest = feature ? list.slice(1) : list

  return (
    <>
      {/* ---------- HERO: black hole full-bleed, tanpa kartu ---------- */}
      <section id="top" className="relative isolate overflow-hidden">
        <BlackHoleCanvas />

        <div className="relative mx-auto flex min-h-[92svh] max-w-6xl flex-col justify-end px-6 pb-14 pt-36">
          <p className="text-[13px] font-medium tracking-wide text-white/55">Semester 5 · Ilmu Komputer, Universitas Djuanda Bogor</p>

          <h1 className="mt-3 text-[clamp(3rem,11vw,8rem)] font-extrabold leading-[0.9] text-[#F5EFE4]">M. Yasin</h1>

          <p className="mt-6 max-w-2xl text-[clamp(1.05rem,2vw,1.4rem)] font-semibold leading-[1.3] text-[#E6DFD1]">
            Software Engineer &amp; AI Developer. Merancang aplikasi web dan mobile yang cerdas, fungsional, dan nyaman digunakan.
          </p>

          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-white/60">
            Saya membangun perangkat lunak untuk platform web dan mobile dengan memadukan rekayasa sistem yang rapi serta penerapan kecerdasan buatan. Fokus saya adalah mengolah
            teknologi yang kompleks—baik melalui pengembangan model AI maupun integrasi sistem modern—menjadi produk digital yang terasa sederhana dan praktis bagi pengguna. Di
            luar baris kode, saya menyalurkan kepekaan visual melalui fotografi dan color grading.
          </p>

          <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
            {LINKS.map((l) => (
              <li key={l.label}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer noopener"
                  className="inline-flex items-center gap-2 text-[13px] font-semibold text-white/70 underline-offset-4 transition-colors hover:text-white hover:underline"
                >
                  {SOCIAL_ICON[l.label]}
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <div className="mx-auto max-w-6xl px-4 pt-10">
        <TechMarquee />
      </div>

      {/* ---------- PROYEK ---------- */}
      <section id="projects" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:py-24">
        <h2 className="text-[clamp(2.2rem,5.5vw,3.4rem)] font-bold text-ink">Proyek Pilihan</h2>
        <p className="mt-4 max-w-2xl text-[16px] leading-relaxed text-ink-soft">
          Beberapa aplikasi dan eksperimen kecerdasan buatan yang pernah saya bangun. Klik repositori untuk melihat detail arsitektur dan kodenya.
        </p>

        <div className="mt-7 flex flex-wrap gap-2" role="group" aria-label="Filter kategori proyek">
          {FILTERS.map((f) => {
            const on = filter === f.id
            return (
              <button
                key={f.id}
                type="button"
                aria-pressed={on}
                onClick={() => setFilter(f.id)}
                className={[
                  "rounded-full px-4 py-2 text-[13px] font-semibold transition-colors",
                  on ? "bg-primary text-primary-ink" : "bg-surface-2/70 text-ink-soft hover:text-ink",
                ].join(" ")}
              >
                {f.label}
              </button>
            )
          })}
        </div>

        <div className="mt-8 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {feature && <FeatureCard p={feature} />}
          {rest.map((p) => (
            <ProjectCard key={p.id} p={p} />
          ))}
        </div>
      </section>

      {/* ---------- TENTANG ---------- */}
      <section id="about" className="mx-auto max-w-6xl scroll-mt-28 px-4 py-16 md:py-24">
        <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-14">
          <div>
            <h2 className="text-[clamp(2.2rem,5.5vw,3.4rem)] font-bold text-ink">Tentang &amp; Kontak</h2>
            <blockquote className="mt-6 max-w-xs text-[15px] font-semibold leading-relaxed text-ink-soft">
              “It won't change just because you wanted to.”
            </blockquote>
          </div>

          <div>
            <p className="text-[16px] leading-relaxed text-ink">
              Saya M. Yasin, mahasiswa Ilmu Komputer di Universitas Djuanda Bogor. Saya menyukai proses mengubah ide menjadi produk digital yang utuh—mulai dari merancang logika di
              balik layar, menyematkan kecerdasan buatan yang tepat guna, hingga memastikan tampilan akhirnya bersih dan intuitif.
            </p>
            <p className="mt-4 text-[16px] leading-relaxed text-ink">
              Bagi saya, menulis kode yang rapi dan mengolah komposisi warna memiliki tujuan yang sama: menciptakan pengalaman yang jelas, fungsional, dan nyaman bagi penggunanya.
              Terbuka untuk kolaborasi proyek, diskusi teknologi, maupun kerja sama kreatif.
            </p>

            <ul className="mt-8 grid gap-x-8 gap-y-3 sm:grid-cols-2">
              {LINKS.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target={l.href.startsWith("http") ? "_blank" : undefined}
                    rel="noreferrer noopener"
                    className="flex items-center gap-2.5 text-[14px] text-ink transition-colors hover:text-accent"
                  >
                    <span className="text-ink-soft">{SOCIAL_ICON[l.label]}</span>
                    <span>
                      <span className="font-bold">{l.label}</span>
                      <span className="ml-2 text-ink-soft">{l.handle}</span>
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
