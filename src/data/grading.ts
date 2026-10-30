export type Grade = {
  id: string
  title: string
  subject: string
  tools: string
  recipe: string
  /** rasio asli foto (lebar/tinggi), dipakai untuk mengunci tinggi kartu sebelum gambar dimuat */
  ratio: number
  before: string
  after: string
}

/**
 * Sumber file asli ada di C:\Users\yasin\Pictures\Export PS.
 * Tiap entri = dua ekspor dari frame yang sama. Kartu 01 before-nya benar-benar datar;
 * kartu 02-04 before-nya sudah melalui pengolahan warna sendiri, jadi bukan RAW.
 * Kalau ada ekspor datar asli, timpa NN-before.webp saja.
 */
export const GRADES: Grade[] = [
  {
    id: "01",
    ratio: 0.5621,
    title: "Chevrolet 1962, Atrium",
    subject: "Street & Automotive",
    tools: "Lightroom + Photoshop",
    recipe: "Highlight cream, shadow hijau tua, kontras dijaga di bodi biru pucat.",
    before: "/assets/grading/01-before.webp",
    after: "/assets/grading/01-after.webp",
  },
  {
    id: "02",
    ratio: 0.6664,
    title: "R15 Petronas, Jalan Pegunungan",
    subject: "Street & Automotive",
    tools: "Lightroom",
    recipe: "Langit ditahan tetap terang, hijau dedaunan digeser ke arah deep forest, kulit dan livery tetap bersih.",
    before: "/assets/grading/02-before.webp",
    after: "/assets/grading/02-after.webp",
  },
  {
    id: "03",
    ratio: 0.5629,
    title: "Bled Castle, Danau Bled",
    subject: "Travel & Landscape",
    tools: "Lightroom + Photoshop",
    recipe: "Air danau dibuat teal pekat, atap kastil diberi aksen crimson, pelangi dibiarkan jadi satu-satunya warna ramai.",
    before: "/assets/grading/03-before.webp",
    after: "/assets/grading/03-after.webp",
  },
  {
    id: "04",
    ratio: 0.5621,
    title: "R15 di Sawah Bertingkat",
    subject: "Street & Landscape",
    tools: "Lightroom",
    recipe: "Kabut pagi dinaikkan, hijau sawah dipertajam, bodi putih motor dijaga agar tidak pecah di highlight.",
    before: "/assets/grading/04-before.webp",
    after: "/assets/grading/04-after.webp",
  },
]
