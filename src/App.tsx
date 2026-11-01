import * as React from "react"
import NavPill, { type NavPillItem } from "@/components/ui/nav-pill"
import { LaserCardLayer } from "@/components/ui/laser-card-layer"
import { Home } from "@/components/sections/Home"

const ico = (d: React.ReactNode) => (
  <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    {d}
  </svg>
)

const NAV_ITEMS: NavPillItem[] = [
  { label: "Profil", href: "#profil", icon: ico(<><circle cx="12" cy="8.5" r="3.8" /><path d="M4.8 20c1.2-3.4 4-5 7.2-5s6 1.6 7.2 5" /></>) },
  { label: "Karya", href: "#karya", icon: ico(<><rect x="4" y="4" width="16" height="16" rx="2" /><path d="M9 9h6v6H9z" /></>) },
  { label: "Foto", href: "#foto", icon: ico(<><rect x="3.5" y="4.5" width="17" height="15" rx="2.5" /><circle cx="9" cy="10" r="1.6" /><path d="m4 17 5-4.5 4 3.5 3-2.5 4 3.5" /></>) },
  { label: "Kontak", href: "#kontak", icon: ico(<><rect x="3" y="5.5" width="18" height="13" rx="2.5" /><path d="m4 7 8 6 8-6" /></>) },
]

export default function App() {
  const [active, setActive] = React.useState(0)

  return (
    <div className="relative min-h-screen bg-bg text-ink">
      <header className="pointer-events-none fixed inset-x-0 top-4 z-50 flex justify-center px-4">
        <div className="pointer-events-auto">
          <NavPill items={NAV_ITEMS} active={active} onChange={(i) => setActive(i)} />
        </div>
      </header>

      {/* Berkas sinar LaserFlow: jatuh dari bawah hero dan mendarat di kartu
          proyek unggulan. Dipasang di akar halaman, di belakang konten. */}
      <LaserCardLayer />

      <main className="relative z-10">
        <Home />
      </main>
    </div>
  )
}
