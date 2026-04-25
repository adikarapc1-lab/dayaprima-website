import { NextResponse } from "next/server";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { submitLead } from "@/lib/cms";

export async function POST(request) {
  const body = await request.json();
  const payload = {
    name: body.name,
    phone: body.phone,
    message: body.message || "",
    projectReference: body.project || "",
    source: "website",
    submittedAt: new Date().toISOString()
  };

  try {
    await submitLead(payload);
    return NextResponse.json({ ok: true, stored: "cms" });
  } catch {
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
    return NextResponse.json({ ok: true, stored: "local-fallback" });
  }
}
