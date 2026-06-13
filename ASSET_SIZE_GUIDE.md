# Asset Size Guide - Dayaprima

Panduan ini dipakai agar semua aset website konsisten saat dipakai di komponen Next.js yang sudah ada.

## Format per Section

| Section | Rasio | Ukuran Master | Format | Catatan |
|---|---:|---:|---|---|
| Home Hero Carousel | 16:9 | 1920 x 1080 | JPG/WEBP | Visual utama full-width, aman untuk crop di desktop/mobile |
| Hero Proyek (`/perumahan/[slug]`) | 16:9 | 1920 x 1080 | JPG/WEBP | Dipakai untuk `ProjectHeroCarousel` |
| Banner Promo Proyek | 16:9 | 1920 x 1080 | PNG/JPG | Jika desain teks padat, pakai PNG |
| Kartu Proyek (Home) | 16:10 | 1600 x 1000 | JPG/WEBP | Mengikuti `aspect-[16/10]` |
| Galeri Perumahan | 4:3 | 1600 x 1200 | JPG/WEBP | Mengikuti `aspect-[4/3]` |
| Kartu Tipe Rumah | 16:9 | 1600 x 900 | JPG/WEBP | Mengikuti `aspect-[16/9]` |
| Denah Tipe Rumah | 2:3 (portrait) | 1200 x 1800 | PNG | Lebih terbaca untuk elemen dimensi + label |
| Peta Lokasi Strategis | 16:9 | 1920 x 1080 | SVG/PNG | Peta ilustratif untuk section lokasi atau materi promo |
| Cover Blog | 16:10 | 1600 x 1000 | JPG/WEBP | Mengikuti kartu blog |
| Video Proyek | 16:9 | 1920 x 1080 | MP4 (H.264/AAC) | Bitrate disarankan 6-10 Mbps |

## Naming Convention

- Hero: `hero-{project-slug}-{v}.jpg`
- Promo banner: `promo-{project-slug}-{v}.png`
- Gallery: `gallery-{project-slug}-{index}-{v}.jpg`
- Floorplan: `floorplan-{type-slug}-{v}.png`
- Video: `video-{project-slug}-{v}.mp4`

Contoh versi awal: `floorplan-type-36-75-v1.png`.
