"use strict";

/**
 * Auto-seed Strapi dengan data contoh yang sama seperti fallback frontend
 * (apps/web/src/data/sample-content.js), mengunggah gambar/video dari
 * apps/web/public, mem-publish semuanya, lalu mengaktifkan izin publik
 * (find/findOne + lead create) supaya website langsung membaca dari CMS.
 *
 * Jalankan dengan Strapi DALAM KEADAAN MATI (hentikan `npm run dev` dulu):
 *   npm run seed            (dari root)  ATAU
 *   npm --workspace apps/cms run seed
 *
 * Aman diulang: data perumahan/artikel/testimoni lama dihapus dulu agar tidak
 * dobel. Catatan: menjalankan ulang akan menambah salinan file di Media Library.
 */

const fs = require("fs");
const path = require("path");
const strapi = require("@strapi/strapi");

const PUBLIC_DIR = path.join(__dirname, "..", "..", "web", "public");
const MIME = {
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".svg": "image/svg+xml",
  ".mp4": "video/mp4"
};

const uploadCache = new Map();

async function uploadFile(app, relPath) {
  if (!relPath) return null;
  if (uploadCache.has(relPath)) return uploadCache.get(relPath);

  const abs = path.join(PUBLIC_DIR, relPath.replace(/^\//, ""));
  if (!fs.existsSync(abs)) {
    app.log.warn(`File tidak ditemukan, dilewati: ${relPath}`);
    uploadCache.set(relPath, null);
    return null;
  }

  const ext = path.extname(abs).toLowerCase();
  const stats = fs.statSync(abs);
  const result = await app.plugin("upload").service("upload").upload({
    data: {},
    files: {
      filepath: abs,
      originalFilename: path.basename(abs),
      mimetype: MIME[ext] || "application/octet-stream",
      size: stats.size
    }
  });

  const id = Array.isArray(result) ? result[0] && result[0].id : result && result.id;
  uploadCache.set(relPath, id || null);
  return id || null;
}

async function uploadMany(app, relPaths) {
  const ids = [];
  for (const relPath of relPaths || []) {
    const id = await uploadFile(app, relPath);
    if (id) ids.push(id);
  }
  return ids;
}

const toFeatures = (items) => (items || []).map((label) => ({ label }));
const toFacilities = (items) => (items || []).map((label) => ({ label }));

const HERO = "/images/dayaprima-hero.png";
const FLOORPLAN_36 = "/images/floorplan-type-36-75-v1.png";
const FLOORPLAN_45 = "/images/floorplan-couple-type-45-90-v1.png";

const PROJECTS = [
  {
    name: "Nusa Harapan Permai",
    slug: "nusa-harapan-permai",
    excerpt: "Perumahan strategis di kawasan BTP, Makassar.",
    description:
      "Nusa Harapan Permai berada di kawasan BTP, Makassar, tepatnya Kelurahan Katimbang, Kecamatan Biringkanaya. Lingkungan ini cocok untuk keluarga yang membutuhkan akses praktis menuju kawasan hunian, pendidikan, dan aktivitas harian di Makassar.",
    location: "BTP, Makassar (Kelurahan Katimbang, Kecamatan Biringkanaya).",
    mapUrl: "https://maps.app.goo.gl/4VC8JhWmBoFMyPDg6",
    mapEmbedUrl: "https://www.google.com/maps?q=Nusa%20Harapan%20Permai%20Makassar&output=embed",
    featured: true,
    promoPriceStart: "408",
    promoPpnStart: "34",
    promoPhone: "0853-4190-9329",
    promoAddress: "Ruko BTP, Jalan Pujasera Blok M No.3-4, Tamalanrea, Makassar",
    seoTitle: "Nusa Harapan Permai | Perumahan Dayaprima Nusawisesa di BTP Makassar",
    seoDescription:
      "Nusa Harapan Permai adalah perumahan Dayaprima Nusawisesa di kawasan BTP, Makassar, Kelurahan Katimbang, Kecamatan Biringkanaya.",
    media: {
      heroImage: HERO,
      promoBanner: "/images/promo-dayaprima-dp-6-juta-siap-huni-v1.png",
      video: "/videos/nusa-harapan-permai.mp4",
      gallery: [HERO]
    },
    facilities: toFacilities(["Gerbang cluster", "Taman lingkungan", "Drainase tertata", "Akses 24 jam"]),
    houseTypes: [
      {
        name: "Type 36",
        slug: "type-36",
        size: "LT 72 / LB 36",
        price: "Mulai Rp 420 juta",
        description:
          "Rumah kompak untuk keluarga muda dengan tata ruang efisien dan area pengembangan yang fleksibel.",
        bedrooms: 2,
        bathrooms: 1,
        floors: 1,
        carport: 1,
        features: toFeatures(["2 kamar tidur", "1 kamar mandi", "Ruang keluarga", "Dapur", "Carport", "Area taman depan"]),
        media: { floorPlanImage: FLOORPLAN_36, gallery: [HERO, FLOORPLAN_36] }
      },
      {
        name: "Type 45",
        slug: "type-45",
        size: "LT 90 / LB 45",
        price: "Mulai Rp 560 juta",
        description:
          "Hunian keluarga dengan ruang yang lebih lega, cocok untuk kebutuhan harian dan investasi jangka panjang.",
        bedrooms: 2,
        bathrooms: 1,
        floors: 1,
        carport: 1,
        features: toFeatures(["2 kamar tidur", "1 kamar mandi", "Ruang tamu", "Dapur", "Carport", "Halaman belakang"]),
        media: { floorPlanImage: FLOORPLAN_45, gallery: [HERO, FLOORPLAN_45] }
      }
    ],
    faqs: [
      {
        question: "Apakah unit di Nusa Harapan Permai sudah bersertifikat?",
        answer:
          "Ya. Setiap unit dilengkapi sertifikat (SHM/SHGB) dan IMB/PBG sesuai ketentuan, serta proses balik nama dibantu tim legal kami."
      },
      {
        question: "Apakah bisa dibeli dengan KPR?",
        answer:
          "Bisa. Kami bekerja sama dengan beberapa bank untuk KPR. Anda dapat memakai fitur Simulasi KPR di halaman ini untuk memperkirakan cicilan, lalu tim kami membantu proses pengajuannya."
      },
      {
        question: "Di mana lokasi tepatnya dan bagaimana aksesnya?",
        answer:
          "Berada di kawasan BTP, Makassar (Kelurahan Katimbang, Kecamatan Biringkanaya), dengan akses praktis menuju kawasan pendidikan, fasilitas kesehatan, dan jalur utama kota."
      },
      {
        question: "Berapa lama proses serah terima unit?",
        answer:
          "Untuk unit siap huni (ready stock) serah terima dapat dilakukan setelah administrasi dan pembayaran selesai. Untuk unit indent, jadwalnya akan diinformasikan tim pemasaran."
      }
    ]
  },
  {
    name: "Nusa Idaman Residence",
    slug: "nusa-idaman",
    excerpt: "Hunian di koridor Tamalanrea-Biringkanaya, Makassar.",
    description:
      "Nusa Idaman Residence berlokasi di Jl. Poros Tamalanrea Biringkanaya, Tamalanrea, Makassar. Kawasan ini berada di jalur strategis Kota Makassar dan mendukung mobilitas harian penghuni.",
    location: "Jl. Poros Tamalanrea Biringkanaya, Tamalanrea, Makassar, Kota Makassar, Sulawesi Selatan 90242.",
    mapUrl: "https://maps.app.goo.gl/qSHbJMaCBG9ksomV6",
    mapEmbedUrl: "https://www.google.com/maps?q=Nusa%20Idaman%20Residence%20Makassar&output=embed",
    featured: true,
    promoPriceStart: "295",
    promoPpnStart: "25",
    promoPhone: "0853-4190-9329",
    promoAddress: "Ruko BTP, Jalan Pujasera Blok M No.3-4, Tamalanrea, Makassar",
    seoTitle: "Nusa Idaman Residence | Perumahan Dayaprima Nusawisesa di Tamalanrea Makassar",
    seoDescription:
      "Nusa Idaman Residence adalah perumahan Dayaprima Nusawisesa di Jl. Poros Tamalanrea Biringkanaya, Kota Makassar.",
    media: {
      heroImage: HERO,
      promoBanner: "/images/promo-nusa-idaman-v2.png",
      gallery: [HERO]
    },
    facilities: toFacilities(["Ruang terbuka hijau", "Musholla", "One gate system", "Area komersial"]),
    houseTypes: [
      {
        name: "Type 30",
        slug: "type-30",
        size: "LT 60 / LB 30",
        price: "Mulai Rp 330 juta",
        description:
          "Pilihan rumah praktis dengan denah sederhana dan harga terjangkau di kawasan Tamalanrea.",
        bedrooms: 2,
        bathrooms: 1,
        floors: 1,
        carport: 1,
        features: toFeatures(["2 kamar tidur", "1 kamar mandi", "Ruang keluarga", "Dapur", "Carport"]),
        media: { floorPlanImage: FLOORPLAN_36, gallery: [HERO, FLOORPLAN_36] }
      },
      {
        name: "Type 50",
        slug: "type-50",
        size: "LT 105 / LB 50",
        price: "Mulai Rp 690 juta",
        description:
          "Tipe rumah lebih luas untuk keluarga yang membutuhkan ruang tambahan dan kenyamanan lebih.",
        bedrooms: 3,
        bathrooms: 2,
        floors: 1,
        carport: 1,
        features: toFeatures(["3 kamar tidur", "2 kamar mandi", "Ruang keluarga", "Dapur", "Carport", "Ruang makan"]),
        media: { floorPlanImage: FLOORPLAN_45, gallery: [HERO, FLOORPLAN_45] }
      }
    ],
    faqs: [
      {
        question: "Apakah legalitas Nusa Idaman Residence aman?",
        answer:
          "Aman. Unit memiliki sertifikat dan izin bangunan yang sah, dan seluruh dokumen dapat diperiksa langsung sebelum transaksi."
      },
      {
        question: "Apa saja pilihan tipe rumahnya?",
        answer:
          "Tersedia beberapa tipe, mulai dari Type 30 untuk kebutuhan praktis hingga Type 50 yang lebih luas. Detail spesifikasi dan harga tiap tipe ada di halaman ini."
      },
      {
        question: "Apakah tersedia promo DP ringan?",
        answer:
          "Kami secara berkala menawarkan promo DP ringan dan skema pembayaran fleksibel. Hubungi tim kami via WhatsApp untuk promo yang sedang berlaku."
      },
      {
        question: "Bagaimana cara menjadwalkan kunjungan ke lokasi?",
        answer:
          "Klik tombol WhatsApp atau isi formulir inquiry di halaman ini. Tim pemasaran akan mengatur jadwal survei lokasi sesuai waktu Anda."
      }
    ]
  }
];

const ARTICLES = [
  {
    slug: "tips-memilih-perumahan-pertama",
    title: "Tips Memilih Perumahan Pertama untuk Keluarga",
    excerpt: "Panduan ringkas mengevaluasi lokasi, legalitas, fasilitas, dan biaya kepemilikan rumah.",
    content:
      "Memilih rumah pertama perlu dimulai dari kebutuhan harian. Perhatikan jarak ke sekolah, kantor, fasilitas kesehatan, dan akses jalan. Setelah itu, cek legalitas perumahan dan skema pembayaran secara teliti.",
    media: { coverImage: HERO }
  }
];

const TESTIMONIALS = [
  {
    name: "Andi Pratama",
    role: "Pemilik Rumah",
    quote: "Tim Dayaprima responsif sejak survei lokasi sampai proses serah terima."
  },
  {
    name: "Nur Aisyah",
    role: "Pembeli Rumah Pertama",
    quote:
      "Informasi tipe rumah dan pembayaran dijelaskan dengan rapi, jadi kami lebih yakin mengambil keputusan."
  }
];

const GLOBAL = {
  companyName: "Dayaprima Nusawisesa",
  tagline: "Hunian bernilai untuk keluarga yang tumbuh",
  phone: "0853-4190-9329",
  whatsapp: "6285341909329",
  email: "informasi@dayaprima.id",
  address:
    "Ruko BTP, Jalan Pujasera Blok M No.3-4, Tamalanrea, Kec. Tamalanrea, Kota Makassar, Sulawesi Selatan 90245",
  socialLinks: [
    { label: "Instagram", url: "https://instagram.com/dayaprima" },
    { label: "Facebook", url: "https://facebook.com/dayaprima" }
  ],
  kprInterestRate: 7,
  kprTenorYears: 15,
  kprDpPercent: 20
};

const PUBLIC_ACTIONS = [
  "api::project.project.find",
  "api::project.project.findOne",
  "api::article.article.find",
  "api::article.article.findOne",
  "api::testimonial.testimonial.find",
  "api::testimonial.testimonial.findOne",
  "api::global-setting.global-setting.find",
  "api::lead.lead.create"
];

async function buildProjectData(app, project) {
  const { media = {}, houseTypes = [], ...rest } = project;
  const data = { ...rest };

  if (media.heroImage) data.heroImage = await uploadFile(app, media.heroImage);
  if (media.promoBanner) data.promoBanner = await uploadFile(app, media.promoBanner);
  if (media.video) data.video = await uploadFile(app, media.video);
  if (media.gallery) data.gallery = await uploadMany(app, media.gallery);

  data.houseTypes = [];
  for (const houseType of houseTypes) {
    const { media: htMedia = {}, ...htRest } = houseType;
    const htData = { ...htRest };
    if (htMedia.floorPlanImage) htData.floorPlanImage = await uploadFile(app, htMedia.floorPlanImage);
    if (htMedia.gallery) htData.gallery = await uploadMany(app, htMedia.gallery);
    data.houseTypes.push(htData);
  }

  return data;
}

async function buildArticleData(app, article) {
  const { media = {}, ...rest } = article;
  const data = { ...rest };
  if (media.coverImage) data.coverImage = await uploadFile(app, media.coverImage);
  return data;
}

async function clearCollection(app, uid) {
  const existing = await app.documents(uid).findMany({ fields: ["documentId"], status: "draft" });
  for (const doc of existing) {
    await app.documents(uid).delete({ documentId: doc.documentId });
  }
}

async function enablePublicPermissions(app) {
  const publicRole = await app.db
    .query("plugin::users-permissions.role")
    .findOne({ where: { type: "public" } });
  if (!publicRole) {
    app.log.warn("Public role tidak ditemukan, lewati pengaturan izin.");
    return;
  }
  for (const action of PUBLIC_ACTIONS) {
    const existing = await app.db
      .query("plugin::users-permissions.permission")
      .findOne({ where: { action, role: publicRole.id } });
    if (!existing) {
      await app.db
        .query("plugin::users-permissions.permission")
        .create({ data: { action, role: publicRole.id } });
    }
  }
}

async function run() {
  const app = await strapi.createStrapi().load();
  app.log.level = "error";

  try {
    await clearCollection(app, "api::project.project");
    await clearCollection(app, "api::article.article");
    await clearCollection(app, "api::testimonial.testimonial");

    for (const project of PROJECTS) {
      const data = await buildProjectData(app, project);
      await app.documents("api::project.project").create({ data, status: "published" });
    }
    for (const article of ARTICLES) {
      const data = await buildArticleData(app, article);
      await app.documents("api::article.article").create({ data, status: "published" });
    }
    for (const data of TESTIMONIALS) {
      await app.documents("api::testimonial.testimonial").create({ data, status: "published" });
    }

    const existingGlobal = await app.documents("api::global-setting.global-setting").findMany({ status: "draft" });
    if (existingGlobal.length) {
      await app.documents("api::global-setting.global-setting").update({
        documentId: existingGlobal[0].documentId,
        data: GLOBAL,
        status: "published"
      });
    } else {
      await app.documents("api::global-setting.global-setting").create({ data: GLOBAL, status: "published" });
    }

    await enablePublicPermissions(app);

    // eslint-disable-next-line no-console
    console.log(
      `\n✅ Seed selesai: ${PROJECTS.length} perumahan, ${ARTICLES.length} artikel, ${TESTIMONIALS.length} testimoni, 1 global setting (semua dipublish + media terunggah). Izin publik diaktifkan.\n`
    );
  } catch (error) {
    // eslint-disable-next-line no-console
    console.error("\n❌ Seed gagal:", error);
    await app.destroy();
    process.exit(1);
  }

  await app.destroy();
  process.exit(0);
}

run();
