import * as React from "react"

/* Pratinjau mini yang meniru antarmuka asli tiap proyek. Bukan screenshot —
   direkonstruksi di HTML/CSS supaya tetap tajam, ringan, dan ikut tema gelap. */

const rupiah = (n: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n)

const SAMPLES = [
  { q: "beli kuota 100k", amount: 100000, item: "kuota", cat: "Pulsa & Internet", tool: "catat_pengeluaran" },
  { q: "gajian bulanan 5jt", amount: 5000000, item: "gaji", cat: "Pemasukan", tool: "catat_masuk" },
  { q: "kopi 25rb kemarin", amount: 25000, item: "kopi", cat: "Makan & Minum", tool: "catat_pengeluaran" },
]

export function NanoMoneyPreview() {
  const [active, setActive] = React.useState(0)
  const s = SAMPLES[active]
  const saldo = 1250000 + (s.tool === "catat_masuk" ? s.amount : -s.amount)

  return (
    <div className="flex h-full flex-col gap-3">
      <div className="flex flex-wrap gap-1.5" role="group" aria-label="Contoh pesan">
        {SAMPLES.map((x, i) => (
          <button
            key={x.q}
            type="button"
            aria-pressed={i === active}
            onClick={() => setActive(i)}
            className={[
              "rounded-full px-3 py-2 text-[12px] transition-colors",
              i === active ? "bg-white text-black" : "border border-line text-ink-soft hover:text-ink",
            ].join(" ")}
          >
            {x.q}
          </button>
        ))}
      </div>

      <div className="flex-1 rounded-xl bg-surface-2 p-4">
        <div className="flex items-center justify-between text-[11.5px] text-ink-soft">
          <span>Nano-Money</span>
          <span className="tabular-nums">Saldo {rupiah(saldo)}</span>
        </div>

        <div className="mt-3 flex justify-end">
          <p className="max-w-[85%] rounded-xl rounded-br-sm bg-white/10 px-3 py-1.5 text-[12px] text-ink">{s.q}</p>
        </div>

        <div className="mt-2.5 flex justify-start">
          <div className="w-[85%] rounded-xl rounded-bl-sm border border-line bg-surface p-3">
            <p className="text-[11px] text-ink-faint">{s.cat}</p>
            <p className="mt-0.5 text-[18px] font-medium tabular-nums text-ink">{rupiah(s.amount)}</p>
            <p className="text-[11px] text-ink-soft">{s.item}</p>
          </div>
        </div>
      </div>
    </div>
  )
}

export function SlangPreview() {
  return (
    <div className="flex h-full flex-col justify-center gap-3 rounded-xl bg-surface-2 p-4">
      <p className="text-[12px] text-ink">“kopi 25rb kemarin”</p>
      <div className="flex items-center gap-2 text-ink-faint" aria-hidden="true">
        <span className="text-[11px]">model ringan</span>
        <span className="h-px flex-1 bg-line" />
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M5 12h14M13 6l6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>
      <ul className="flex flex-wrap gap-1.5">
        {[
          ["Nominal", "25.000"],
          ["Kategori", "Makan & Minum"],
        ].map(([k, v]) => (
          <li key={k} className="rounded-md border border-line px-2 py-1 text-[11.5px]">
            <span className="text-ink-faint">{k}</span>
            <span className="ml-1.5 text-ink">{v}</span>
          </li>
        ))}
      </ul>
      <p className="rounded-md border border-line px-2 py-1.5 text-[11.5px] text-ink-faint">Berjalan offline, tanpa koneksi internet.</p>
    </div>
  )
}

export function PromptGenPreview() {
  return (
    <div className="grid h-full min-h-0 grid-cols-[0.85fr_1.15fr] gap-3 overflow-hidden rounded-xl bg-surface-2 p-3">
      <img
        src="/assets/photos/promptgen.webp"
        alt="Pengendara helm putih di latar pepohonan hijau"
        loading="lazy"
        className="h-full min-h-0 w-full rounded-lg object-cover"
      />
      <div className="flex min-h-0 flex-col gap-2">
        <ul className="flex flex-wrap gap-1">
          {["white helmet", "full face", "green foliage", "daylight"].map((t) => (
            <li key={t} className="rounded-full border border-line px-2 py-0.5 text-[11px] text-ink-soft">
              {t}
            </li>
          ))}
        </ul>
        <p className="mt-auto rounded-lg border border-line p-2 text-[11px] leading-relaxed text-ink-faint">
          “helm putih, pepohonan hijau, siang”
        </p>
      </div>
    </div>
  )
}

export function VerifierPreview() {
  const rows = [
    { label: "infrastructure", pct: 100 },
    { label: "capability battery", pct: 100 },
  ]
  return (
    <div className="flex h-full flex-col gap-3 rounded-xl bg-black p-4">
      <div className="flex items-center justify-between">
        <span className="text-[11px] uppercase tracking-[0.14em] text-ink-faint">audit run</span>
        <span className="rounded-full border border-accent/40 px-2 py-0.5 text-[11px] font-medium tracking-wide text-accent-text">
          CONSISTENT
        </span>
      </div>
      <ul className="flex flex-col gap-2.5">
        {rows.map((r) => (
          <li key={r.label}>
            <div className="flex justify-between text-[11px] text-ink-faint">
              <span>{r.label}</span>
              <span className="tabular-nums">{r.pct}%</span>
            </div>
            <div className="mt-1 h-[3px] overflow-hidden rounded-full bg-white/10">
              <span className="block h-full rounded-full bg-white/70" style={{ width: `${r.pct}%` }} />
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}

export function DishubPreview() {
  const steps = ["Diajukan", "Diverifikasi", "Surat .docx Siap"]
  return (
    <div className="flex h-full flex-col justify-center gap-3 rounded-xl bg-surface-2 p-4">
      <ol className="flex flex-col gap-2">
        {steps.map((s, i) => (
          <li key={s} className="flex items-center gap-2.5">
            <span className="flex h-4 w-4 items-center justify-center rounded-full bg-white/10 text-[11px] text-ink">{i + 1}</span>
            <span className="text-[11px] text-ink">{s}</span>
            {i === 2 && <span className="ml-auto rounded-full px-1.5 py-0.5 text-[11px] font-medium text-accent-text">siap</span>}
          </li>
        ))}
      </ol>
    </div>
  )
}

export const PREVIEWS = {
  nanomoney: NanoMoneyPreview,
  slang: SlangPreview,
  promptgen: PromptGenPreview,
  verifier: VerifierPreview,
  dishub: DishubPreview,
}
