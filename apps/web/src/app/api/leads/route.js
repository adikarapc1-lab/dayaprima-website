import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { submitLead } from "@/lib/cms";
import { notifyLead } from "@/lib/notify";

const MIN_FILL_MS = 2500; // submit lebih cepat dari ini hampir pasti bot

export async function POST(request) {
  const body = await request.json();

  // Anti-spam: honeypot field (`company`) harus kosong, dan form tidak boleh
  // diisi terlalu cepat. Bot dibalas ok agar tidak mencoba ulang, tanpa disimpan.
  const isBot =
    Boolean(body.company) ||
    (typeof body.elapsedMs === "number" && body.elapsedMs >= 0 && body.elapsedMs < MIN_FILL_MS);
  if (isBot) {
    return NextResponse.json({ ok: true, stored: "skipped" });
  }

  const name = String(body.name || "").trim();
  const phone = String(body.phone || "").trim();
  if (!name || !phone) {
    return NextResponse.json(
      { ok: false, error: "Nama dan nomor telepon wajib diisi." },
      { status: 400 }
    );
  }

  const payload = {
    name,
    phone,
    message: String(body.message || "").trim(),
    projectReference: body.project || "",
    source: "website",
    submittedAt: new Date().toISOString()
  };

  let stored = "cms";
  try {
    await submitLead(payload);
  } catch {
    stored = "local-fallback";
    const dir = path.join(process.cwd(), ".local");
    const file = path.join(dir, "leads.json");
    await mkdir(dir, { recursive: true });
    let existing = [];
    try {
      existing = JSON.parse(await readFile(file, "utf8"));
    } catch {
      existing = [];
    }
    existing.push(payload);
    await writeFile(file, JSON.stringify(existing, null, 2));
  }

  // Notifikasi best-effort; tidak boleh menggagalkan respons ke pengunjung.
  try {
    await notifyLead(payload);
  } catch {
    // diabaikan: lead sudah tersimpan
  }

  return NextResponse.json({ ok: true, stored });
}
