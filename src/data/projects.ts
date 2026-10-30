export type ProjectCategory = "ai-model" | "app" | "tooling"

export type Project = {
  id: string
  name: string
  badge: string
  tagline: string
  description: string
  category: ProjectCategory
  repo: string
  stack: string[]
  preview: "nanomoney" | "slang" | "promptgen" | "verifier" | "dishub"
}

export const PROJECTS: Project[] = [
  {
    id: "nano-money",
    name: "Nano-Money",
    badge: "Mobile AI App",
    tagline: "Pencatat keuangan pintar berbasis percakapan.",
    description:
      "Mencatat pemasukan dan pengeluaran semudah mengirim pesan chat tanpa perlu mengisi formulir manual. Dilengkapi kecerdasan buatan yang dapat bekerja langsung di ponsel tanpa internet serta perlindungan privasi data lokal.",
    category: "app",
    repo: "https://github.com/SNNN-011/Nano-Money",
    stack: ["Kotlin", "Jetpack Compose", "On-Device AI", "Gemini API", "SQLCipher"],
    preview: "nanomoney",
  },
  {
    id: "slang-ledger",
    name: "Slang-Ledger",
    badge: "Fine-Tuned SLM",
    tagline: "Model AI ringan untuk memahami bahasa transaksi sehari-hari.",
    description:
      "Model bahasa berukuran kecil yang dilatih khusus untuk menerjemahkan kalimat kasual dan singkatan bahasa Indonesia menjadi data keuangan terstruktur. Dirancang agar sangat ringan dan berjalan penuh secara offline di perangkat mobile.",
    category: "ai-model",
    repo: "https://github.com/SNNN-011/slang-ledger",
    stack: ["Python", "Small Language Model", "C++ / JNI", "Offline Inference"],
    preview: "slang",
  },
  {
    id: "promptgenweb",
    name: "promptGenWeb",
    badge: "Vision AI Web",
    tagline: "Aplikasi web pengubah gambar menjadi deskripsi dan prompt AI.",
    description:
      "Membantu kreator menganalisis detail visual, pencahayaan, dan suasana dari sebuah foto untuk diubah menjadi deskripsi teks atau prompt artistik secara instan.",
    category: "app",
    repo: "https://github.com/SNNN-011/promptGenWeb",
    stack: ["TypeScript", "React 19", "Tailwind CSS", "Node.js", "Gemini Vision"],
    preview: "promptgen",
  },
  {
    id: "model-authenticity-verifier",
    name: "Model Authenticity Verifier",
    badge: "AI Security Tool",
    tagline: "Alat pengujian untuk memeriksa keaslian layanan model AI.",
    description:
      "Perangkat uji otomatis untuk memverifikasi apakah suatu layanan API kecerdasan buatan benar-benar menjalankan model asli sesuai klaimnya atau telah dimodifikasi di balik layar.",
    category: "tooling",
    repo: "https://github.com/SNNN-011/model-authenticity-verifier",
    stack: ["Python", "AI Auditing", "Zero-Dependency", "CLI Tool"],
    preview: "verifier",
  },
  {
    id: "sistem-cuti-dishub",
    name: "Sistem Cuti Dishub",
    badge: "Full-Stack Web",
    tagline: "Platform digital pengelolaan dan pengajuan cuti pegawai.",
    description:
      "Sistem informasi berbasis web untuk menyederhanakan alur pengajuan cuti, perhitungan hari kerja otomatis, pemantauan status persetujuan, hingga pembuatan dokumen surat resmi secara instan.",
    category: "app",
    repo: "https://github.com/SNNN-011/sistem-cuti-dishub",
    stack: ["Python", "Flask", "Google Sheets API", "Tailwind CSS", "Docx Automation"],
    preview: "dishub",
  },
]

export const FILTERS: { id: "all" | ProjectCategory; label: string }[] = [
  { id: "all", label: "Semua" },
  { id: "ai-model", label: "AI & Model" },
  { id: "app", label: "Web & Mobile App" },
  { id: "tooling", label: "Tooling" },
]

export const LINKS = [
  { label: "GitHub", handle: "SNNN-011", href: "https://github.com/SNNN-011" },
  { label: "Instagram", handle: "@yasin.anr", href: "https://instagram.com/yasin.anr" },
  { label: "X", handle: "@SNNN_011", href: "https://x.com/SNNN_011" },
  { label: "Email", handle: "myasinaldinar@gmail.com", href: "mailto:myasinaldinar@gmail.com" },
]
