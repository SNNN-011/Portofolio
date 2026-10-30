import * as React from "react"
import type { Grade } from "@/data/grading"

type Props = {
  grade: Grade
  /** global "compare all" lock, controlled by the gallery */
  forceBefore?: boolean
  /** dipanggil saat pengguna mengetuk kartu selagi kunci global aktif */
  onBreakGlobal?: () => void
  index?: number
}

/**
 * Foto AFTER jadi default. Desktop: hover menampilkan BEFORE.
 * Sentuh/klik: toggle BEFORE <-> AFTER. Data-URI gambar dimuat lazy.
 */
export function BeforeAfterCard({ grade, forceBefore = false, onBreakGlobal, index = 0 }: Props) {
  const [hover, setHover] = React.useState(false)
  const [pinned, setPinned] = React.useState(false)
  const [loaded, setLoaded] = React.useState(false)
  const showBefore = forceBefore || pinned || hover

  return (
    <figure className="group">
      <button
        type="button"
        aria-pressed={pinned}
        aria-label={`${grade.title} — ${showBefore ? "tampilkan hasil grading" : "tampilkan foto mentah"}`}
        className="relative block w-full overflow-hidden bg-surface-2"
        style={{ aspectRatio: String(grade.ratio) }}
        onPointerEnter={(e) => {
          if (e.pointerType === "mouse") setHover(true)
        }}
        onPointerLeave={(e) => {
          if (e.pointerType === "mouse") setHover(false)
        }}
        onClick={() => {
          if (forceBefore) onBreakGlobal?.()
          else setPinned((p) => !p)
        }}
      >
        <img
          src={grade.after}
          alt={`${grade.title}, hasil color grading`}
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
          onLoad={() => setLoaded(true)}
          className="absolute inset-0 h-full w-full object-cover"
        />
        <img
          src={grade.before}
          alt={`${grade.title}, foto sebelum grading`}
          loading={index < 2 ? "eager" : "lazy"}
          decoding="async"
          aria-hidden={!showBefore}
          className="absolute inset-0 h-full w-full object-cover transition-opacity duration-[350ms] ease-out"
          style={{ opacity: showBefore ? 1 : 0 }}
        />
        {!loaded && <span className="absolute inset-0 animate-pulse bg-surface-2" aria-hidden="true" />}

        <span
          className="absolute bottom-0 left-0 flex w-full items-end justify-between p-4 text-[13px] font-medium text-white"
          style={{ background: "linear-gradient(to top, rgba(13,22,17,0.72), rgba(13,22,17,0))" }}
          aria-hidden="true"
        >
          <span>{showBefore ? "Before" : "After · graded"}</span>
          <span className="opacity-70">hover / ketuk</span>
        </span>
      </button>

      <figcaption className="mt-4">
        <h3 className="text-lg font-semibold text-ink">{grade.title}</h3>
        <p className="mt-1 text-sm text-ink-soft">
          {grade.subject} · {grade.tools}
        </p>
        <p className="mt-2 text-[15px] leading-relaxed text-ink">{grade.recipe}</p>
      </figcaption>
    </figure>
  )
}
