# Asset Size Guide - Dayaprima

Panduan ini dipakai agar semua aset website konsisten saat dipakai di komponen Next.js yang sudah ada. **Bagian "Area Aman Teks" wajib dibaca** sebelum mendesain/men-generate gambar banner, agar elemen penting (logo, harga, telepon) tidak tertimpa teks overlay website.

## Format per Section

| Section | Rasio | Ukuran Master | Format | Catatan |
|---|---:|---:|---|---|
| Home Hero Carousel | 16:9 | 1920 x 1080 | JPG/WEBP | Full-screen (`object-cover`) → **ter-crop** di layar tinggi/mobile. Teks ada di **kiri**, subjek visual taruh di **kanan**. |
| Hero Perumahan (`/perumahan/[slug]`) | 16:9 | 1920 x 1080 | JPG/WEBP | Hero lebar (`ProjectHeroCarousel`); foto `object-cover` → **atas-bawah bisa ter-crop**. Teks di **kiri-bawah**. |
| Banner Promo Perumahan | **3:1** | **1920 x 640** | PNG/JPG | Desain khusus **full-bleed**. **Kiri ~45% dikosongkan** (latar gelap) untuk overlay judul website; **konten promo di kanan ~55%**. Detail di Area Aman Teks #3. |
| Kartu Perumahan (Home) | 16:10 | 1600 x 1000 | JPG/WEBP | Mengikuti `aspect-[16/10]`. |
| Galeri Perumahan | 4:3 | 1600 x 1200 | JPG/WEBP | Mengikuti `aspect-[4/3]` (buka di lightbox). |
| Kartu Tipe Rumah | 16:9 | 1600 x 900 | JPG/WEBP | Mengikuti `aspect-[16/9]`. |
| Denah Tipe Rumah | 2:3 (portrait) | 1200 x 1800 | PNG | Lebih terbaca untuk elemen dimensi + label. |
| Peta Lokasi Strategis | 16:9 | 1920 x 1080 | SVG/PNG | Peta ilustratif untuk section lokasi atau materi promo. |
| Cover Blog | 16:10 | 1600 x 1000 | JPG/WEBP | Mengikuti kartu blog. |
| Video Perumahan | 16:9 | 1920 x 1080 | MP4 (H.264/AAC) | Bitrate disarankan 6-10 Mbps. |

> **Foto hero = 16:9; banner promo = 3:1 (1920×640).** Foto hero & home hero ditampilkan `object-cover` (tepi bisa ter-crop). Banner promo adalah **desain khusus full-bleed** berukuran 1920×640 dengan sisi kiri dikosongkan untuk teks — lihat Area Aman Teks #3.

## Area Aman Teks (Safe Zone) untuk Banner/Hero

Website menambahkan teks overlay (judul, tombol, dll) di atas sebagian banner. Jangan letakkan elemen penting di area yang tertimpa. Ada gradient gelap dari kiri untuk keterbacaan teks, jadi sisi kiri akan tampak lebih gelap.

### 1. Home Hero Carousel (homepage) — teks di KIRI, tengah-vertikal

```
+--------------------------------------------------+
|  [ Badge "Developer Terpercaya" ]                |
|  [ JUDUL: Nama Perusahaan        ]               |
|  [ tagline 1-2 baris             ]   << SUBJEK   |
|  [ Tombol WA | Lihat | Brosur    ]      VISUAL    |
|  [ • • • dots                    ]      DI SINI   |
|        (kiri, tengah-vertikal)                   |
+--------------------------------------------------+
   ~55% KIRI = teks (hindari)     ~45% KANAN = bebas
```
- Taruh subjek/objek utama foto di **kanan / kanan-tengah**.
- Sisi kiri akan digelapkan gradient + ditimpa teks.
- Catatan: hero ini **full-screen & object-cover**, jadi atas-bawah foto bisa ter-crop di layar tinggi — jangan taruh elemen penting mepet tepi atas/bawah.

### 2. Hero Perumahan (`/perumahan/[slug]`) — teks di KIRI-BAWAH

```
+--------------------------------------------------+
|                                                  |
|             (subjek utama: tengah /              |
|              kanan-atas frame)                   |
|                                                  |
|  breadcrumb                                      |
|  JUDUL PERUMAHAN (besar)                         |
|  excerpt 1 baris   • • • dots                    |
+--------------------------------------------------+
   hindari elemen penting di KIRI-BAWAH (~45% bawah-kiri)
```
- Foto ditampilkan `object-cover` di hero lebar-pendek → **atas-bawah bisa ter-crop**. Taruh subjek penting di area tengah, jauh dari tepi atas/bawah.
- Hindari menaruh teks/objek penting di kuadran **kiri-bawah**.

### 3. Banner Promo (slide promo di hero perumahan) — desain khusus 1920×640

- **Ukuran desain: 1920 × 640 px (rasio 3:1).** Versi hi-res: 2400 × 800 px. Format PNG/JPG.
- Ditampilkan **full-bleed** (`object-cover`) memenuhi banner. Di layar non-desktop tepi bisa sedikit ter-crop → sediakan **margin aman ~64px** dari semua tepi.

```
 1920 px
+----------------------------------------------------------+
|  ZONA TEKS WEBSITE          |                            |  margin aman
|  (kiri ~45% / 0-860px)      |    ZONA KONTEN PROMO       |  atas ~64px
|                             |    (kanan ~55% / 860-1920) |
|  Home > Nama                |                            |
|  JUDUL PERUMAHAN (besar)    |   << logo, FREE PPN,       |  640 px
|  excerpt                    |      harga, telepon DI SINI |
|  • • • dots                 |                            |
+----------------------------------------------------------+
   biarkan KIRI gelap/polos       margin aman bawah & kanan ~64px
```

- **Kiri 0-860px (~45%)** → biarkan **kosong / warna gelap polos** (jadi latar judul putih website). Jangan taruh logo/teks penting di sini.
- **Kanan 860-1920px (~55%)** → seluruh konten promo (logo, penawaran, harga, telepon).
- Beri **margin aman ~64px** dari tiap tepi (terutama bawah & kanan) untuk antisipasi crop di layar lain.
- Sisi kiri sebaiknya gelap (hijau tua / abu gelap) agar judul putih website tetap terbaca.
- ⚠️ Teks kiri itu **dinamis** — otomatis dari Strapi (nama + excerpt perumahan), **beda tiap perumahan**. **Jangan tulis ulang nama perumahan / breadcrumb di desainmu**; website sudah menaruhnya otomatis, kalau ditulis lagi jadi **dobel/tabrakan**. Desainmu cukup memuat **konten promo** (logo, penawaran, harga, telepon) di sisi kanan.

> Catatan teknis: tampilan komponen masih "poster kanan + blur" sampai banner khusus ini dipasang. Begitu file 1920×640 siap, banner promo akan diubah ke mode **full-bleed** agar desain mengisi penuh.

## Naming Convention

- Hero: `hero-{project-slug}-{v}.jpg`
- Promo banner: `promo-{project-slug}-{v}.png`
- Gallery: `gallery-{project-slug}-{index}-{v}.jpg`
- Floorplan: `floorplan-{type-slug}-{v}.png`
- Video: `video-{project-slug}-{v}.mp4`

Contoh versi awal: `floorplan-type-36-75-v1.png`.
