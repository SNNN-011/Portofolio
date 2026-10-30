# Portofolio — Yasin Anr

Situs portofolio satu halaman: profil, lima proyek (mobile AI, fine-tuned SLM, computer vision, security tool, full-stack web), dan galeri color grading. Dibangun dengan React + TypeScript + Vite, dengan beberapa bagian yang digambar langsung lewat WebGL/WebGPU.

[![Live](https://img.shields.io/badge/live-snnn--011.github.io%2FPortofolio-111111?style=flat-square)](https://snnn-011.github.io/Portofolio/)
![React](https://img.shields.io/badge/React-19-111111?style=flat-square)
![TypeScript](https://img.shields.io/badge/TypeScript-5.6-111111?style=flat-square)
![Vite](https://img.shields.io/badge/Vite-8-111111?style=flat-square)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-111111?style=flat-square)

## Pratinjau

![Bagian Karya: kartu Nano-Money dengan berkas laser](docs/karya.png)

![Bagian Foto: carousel color grading](docs/foto.png)

## Isi halaman

| Seksi | Isi |
| --- | --- |
| **Hero** | Nama besar, latar black hole (WebGPU) dengan fallback gradien statis |
| **Profil & Pendekatan** | Ringkasan singkat cara kerja dan latar studi |
| **Karya** | Kartu 5 proyek dengan pratinjau potongan cara pakai; kartu unggulan disinari berkas laser |
| **Foto** | Galeri geser (drag/wheel/klik) berisi hasil color grading |
| **Kontak** | Tautan sosial dan email |

Navigasi memakai pill kaca (`LiquidNavbar`) yang mengikuti seksi aktif; di mobile berubah jadi bar ikon.

## Menjalankan

Butuh Node 20.19+ atau 22.12+.

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # hasil statis di dist/
npm run preview  # cek hasil build
```

## Struktur

```
src/
  App.tsx                         susun navbar + layer laser + Home
  app.css                         token warna, font (Fraunces + Inter Tight), animasi reveal
  data/projects.ts                5 proyek: nama, tagline, stack, repo
  data/photos.ts                  23 foto galeri
  components/
    sections/Home.tsx             hero, profil, karya, foto, kontak
    sections/Projects.tsx         grid kartu proyek
    sections/Photos.tsx           pembungkus galeri
    ui/liquid-glass-navbar.tsx    navbar kaca dengan shader air WebGL
    ui/black-hole-canvas.tsx      host WebGPU untuk latar hero
    ui/black-hole/                sumber contoh vgpu (dipakai apa adanya)
    ui/laser-card-layer.tsx       penempatan berkas laser di kartu unggulan
    ui/laser-flow/                shader LaserFlow (WebGL2, satu file GLSL)
    ui/flex-carousel/             carousel geser berbasis canvas
    ui/project-previews.tsx       5 pratinjau use-case per proyek
  docs/                           gambar pratinjau untuk README (bukan bagian app)
public/
  assets/photos/                  foto galeri (.webp)
  icon-*.png                      favicon dari logo Y
```

Dua konteks GPU dipakai berdampingan: **WebGL2** (kartu laser, navbar, carousel) dan **WebGPU** (black hole). Keduanya punya jalur cadangan — navbar punya style CSS saat `data-gl="off"`, black hole jatuh ke lapisan gradien, dan shader laser dilewati kalau WebGL2 tidak tersedia.

## Catatan teknis

- **Berkas laser.** Satu shader `LaserFlow` di `ui/laser-flow/LaserFlow.jsx`. Untuk kartu unggulan, kanvasnya dipasang selebar layar mulai dari bawah hero sampai ±560px di bawah kartu, dengan `mask-image` supaya ujungnya tidak terpotong. Di bawah tepi kartu, bentuk tumpahan "dibekukan" pada tinggi tepi lalu dilanjutkan dengan `fall` yang bertambah, sehingga cahayanya turun dan melebar natural, tanpa menyorot garis bawah kartu atau kartu proyek di bawahnya.
- **Posisi sinar** diatur lewat `BEAM_ON_CARD` (rasio lebar kartu) di `laser-card-layer.tsx`, warnanya lewat prop `color`.
- **Font** dimuat dari Google Fonts; teks utama pakai Fraunces (display) dan Inter Tight (UI).

## Deploy

Hosting utama: **GitHub Pages**, otomatis lewat workflow `.github/workflows/deploy.yml` setiap push ke `main`.

- Build memakai `PAGES_BASE=/Portofolio/` supaya aset menunjuk ke sub-path repo (lihat `vite.config.ts`). Build lokal tanpa env itu tetap memakai `/`.
- Alamat: https://snnn-011.github.io/Portofolio/

Karena hasilnya statis murni, `dist/` juga bisa langsung ditaruh di Cloudflare Pages / Vercel / Netlify dengan build command `npm run build` dan output `dist`.

## Lisensi

Kode bebas dipakai sebagai referensi. Teks, foto, dan logo di dalamnya milik Yasin Anr.
