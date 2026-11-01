import * as React from "react"

/**
 * Navbar pill polos — pengganti `LiquidNavbar` untuk pemakaian sehari-hari.
 *
 * Tidak ada kanvas WebGL, `backdrop-filter`, atau requestAnimationFrame yang
 * jalan terus: satu pill solid, satu penanda aktif, sisanya CSS. Efek air lama
 * tetap tersimpan di `./liquid-glass-navbar.tsx` dan tinggal dipakai lagi kalau
 * memang dibutuhkan.
 */

export type NavPillItem = {
  label: string
  href?: string
  icon?: React.ReactNode
}

export type NavPillProps = {
  items: NavPillItem[]
  active?: number
  defaultActive?: number
  onChange?: (index: number, item: NavPillItem) => void
  className?: string
}

const ITEM =
  "relative inline-flex h-[42px] items-center gap-2 rounded-full px-4 text-[14px] font-medium leading-none tracking-[-0.01em] transition-colors duration-200"
const ITEM_ON = "bg-ink text-bg"
const ITEM_OFF = "text-ink-soft hover:bg-white/[0.06] hover:text-ink"

export function NavPill({ items, active, defaultActive = 0, onChange, className }: NavPillProps) {
  const [inner, setInner] = React.useState(defaultActive)
  const current = active ?? inner
  const itemRefs = React.useRef<(HTMLElement | null)[]>([])

  const select = (i: number) => {
    if (active === undefined) setInner(i)
    if (i !== current) onChange?.(i, items[i])
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return
    e.preventDefault()
    const next = (current + (e.key === "ArrowRight" ? 1 : -1) + items.length) % items.length
    select(next)
    itemRefs.current[next]?.focus()
  }

  return (
    <nav
      className={[
        "inline-flex items-center gap-1 rounded-full border border-line bg-surface p-1.5 shadow-[0_18px_44px_-26px_rgba(0,0,0,0.95)]",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      aria-label="Navigasi utama"
      onKeyDown={onKeyDown}
    >
      {items.map((it, i) => {
        const on = i === current
        const props = {
          ref: (el: HTMLElement | null) => {
            itemRefs.current[i] = el
          },
          className: [ITEM, on ? ITEM_ON : ITEM_OFF].join(" "),
          "aria-current": on ? ("page" as const) : undefined,
          onClick: () => select(i),
        }
        const content = (
          <>
            {it.icon && <span className="inline-flex flex-none">{it.icon}</span>}
            <span className="hidden min-[521px]:inline">{it.label}</span>
          </>
        )
        return it.href ? (
          <a key={it.label + i} {...(props as any)} href={it.href} aria-label={it.label}>
            {content}
          </a>
        ) : (
          <button key={it.label + i} {...(props as any)} type="button" aria-label={it.label}>
            {content}
          </button>
        )
      })}
    </nav>
  )
}

export default NavPill
