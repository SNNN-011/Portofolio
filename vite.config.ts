import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"
import { wgslVitePlugin } from "vgpu/client"

export default defineConfig({
  // GitHub Pages menyajikan situs di sub-path (/Portofolio/). Nilainya datang
  // dari env supaya build lokal dan deploy ke root domain tetap pakai "/".
  base: process.env.PAGES_BASE || "/",
  // wgslVitePlugin milik vgpu: tiap impor .wgsl jadi ShaderSource ter-resolve
  // (import graph ikut diselesaikan) — bentuk yang memang diminta effect()/draw().
  plugins: [wgslVitePlugin({ minify: false }), react(), tailwindcss()],
  resolve: { alias: { "@": "/src" } },
})
