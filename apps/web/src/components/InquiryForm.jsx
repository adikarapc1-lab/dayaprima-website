"use client";

import { useState } from "react";
import { Send } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

export function InquiryForm({ project }) {
  const [status, setStatus] = useState("idle");

  async function onSubmit(event) {
    event.preventDefault();
    setStatus("loading");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    const res = await fetch("/api/leads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...payload, project: project?.name || "" })
    });

    if (res.ok) {
      trackEvent("lead_submit", { project_name: project?.name || "general" });
      event.currentTarget.reset();
      setStatus("success");
    } else {
      setStatus("error");
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 rounded-md border border-ink/10 bg-white p-5 shadow-soft">
      <div>
        <label className="text-sm font-semibold" htmlFor="name">Nama</label>
        <input id="name" name="name" required className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 outline-none focus:border-gold" />
      </div>
      <div>
        <label className="text-sm font-semibold" htmlFor="phone">Nomor Telepon</label>
        <input id="phone" name="phone" required className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 outline-none focus:border-gold" />
      </div>
      <div>
        <label className="text-sm font-semibold" htmlFor="message">Pesan</label>
        <textarea id="message" name="message" rows={4} className="mt-2 w-full rounded-md border border-ink/15 px-3 py-3 outline-none focus:border-gold" />
      </div>
      <button className="btn-primary w-full" disabled={status === "loading"}>
        <Send size={18} />
        {status === "loading" ? "Mengirim..." : "Kirim Inquiry"}
      </button>
      {status === "success" ? <p className="text-sm text-leaf">Terima kasih, tim kami akan menghubungi Anda.</p> : null}
      {status === "error" ? <p className="text-sm text-clay">Inquiry belum terkirim. Silakan coba lagi.</p> : null}
    </form>
  );
}
