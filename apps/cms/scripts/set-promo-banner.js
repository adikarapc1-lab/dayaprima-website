"use strict";

/**
 * Upload gambar promo dan set sebagai `promoBanner` perumahan tertentu (by slug),
 * tanpa mengubah data lain. Jalankan dengan Strapi MATI (hentikan `npm run dev`):
 *   npm --workspace apps/cms run set-promo
 */

const fs = require("fs");
const path = require("path");
const strapi = require("@strapi/strapi");

const IMAGES_DIR = path.join(__dirname, "..", "..", "web", "public", "images");

// Daftar perumahan -> file gambar promo (di apps/web/public/images).
const ITEMS = [{ slug: "nusa-idaman", image: "promo-nusa-idaman-v2.png" }];

const MIME = { ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg", ".webp": "image/webp" };

async function run() {
  const app = await strapi.createStrapi().load();
  app.log.level = "error";

  try {
    for (const item of ITEMS) {
      const abs = path.join(IMAGES_DIR, item.image);
      if (!fs.existsSync(abs)) {
        console.log(`Lewati ${item.slug}: file tidak ada (${item.image})`);
        continue;
      }

      const stats = fs.statSync(abs);
      const uploaded = await app.plugin("upload").service("upload").upload({
        data: {},
        files: {
          filepath: abs,
          originalFilename: item.image,
          mimetype: MIME[path.extname(abs).toLowerCase()] || "application/octet-stream",
          size: stats.size
        }
      });
      const fileId = Array.isArray(uploaded) ? uploaded[0] && uploaded[0].id : uploaded && uploaded.id;

      const docs = await app
        .documents("api::project.project")
        .findMany({ filters: { slug: item.slug }, fields: ["documentId"], status: "draft" });
      if (!docs.length) {
        console.log(`Lewati ${item.slug}: perumahan tidak ditemukan di Strapi`);
        continue;
      }

      await app.documents("api::project.project").update({
        documentId: docs[0].documentId,
        data: { promoBanner: fileId },
        status: "published"
      });
      console.log(`OK: promoBanner ${item.slug} -> ${item.image} (file id ${fileId})`);
    }
    console.log("\n✅ Selesai.");
  } catch (error) {
    console.error("\n❌ Gagal:", error);
    await app.destroy();
    process.exit(1);
  }

  await app.destroy();
  process.exit(0);
}

run();
