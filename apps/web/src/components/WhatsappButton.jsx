"use client";

import { MessageCircle } from "lucide-react";
import { trackEvent, whatsappUrl } from "@/lib/analytics";

export function WhatsappButton({ number, projectName, className = "btn-primary" }) {
  const href = whatsappUrl({ number, projectName, source: projectName ? "project_page" : "sitewide" });

  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className={className}
      onClick={() => trackEvent("whatsapp_click", { project_name: projectName || "general" })}
    >
      <MessageCircle size={18} />
      WhatsApp
    </a>
  );
}
