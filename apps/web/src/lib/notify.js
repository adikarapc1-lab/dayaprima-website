// Best-effort lead notifications. Every channel is optional and enabled purely by
// environment variables, so the site runs fine with none configured. A failure in
// any channel never blocks the lead from being saved.

const TIMEOUT_MS = 4000;

async function postJson(url, body, headers = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify(body),
      signal: controller.signal
    });
    return res.ok;
  } catch {
    return false;
  } finally {
    clearTimeout(timer);
  }
}

function formatText(lead) {
  return [
    "🏡 Lead baru dari website Dayaprima",
    `Nama: ${lead.name}`,
    `Telepon: ${lead.phone}`,
    lead.projectReference ? `Perumahan: ${lead.projectReference}` : null,
    lead.message ? `Pesan: ${lead.message}` : null,
    `Waktu: ${lead.submittedAt}`
  ]
    .filter(Boolean)
    .join("\n");
}

export async function notifyLead(lead) {
  const text = formatText(lead);
  const tasks = [];

  // Telegram bot — paling mudah disiapkan: buat bot via @BotFather, ambil chat id.
  const tgToken = process.env.TELEGRAM_BOT_TOKEN;
  const tgChat = process.env.TELEGRAM_CHAT_ID;
  if (tgToken && tgChat) {
    tasks.push(
      postJson(`https://api.telegram.org/bot${tgToken}/sendMessage`, {
        chat_id: tgChat,
        text
      })
    );
  }

  // Webhook generik — kompatibel dengan Slack (`text`), Discord (`content`),
  // Google Chat (`text`), Zapier/Make (`lead`).
  const webhook = process.env.LEAD_WEBHOOK_URL;
  if (webhook) {
    tasks.push(postJson(webhook, { text, content: text, lead }));
  }

  // Email via Resend (tanpa dependency, cukup fetch ke REST API-nya).
  const resendKey = process.env.RESEND_API_KEY;
  const notifyEmail = process.env.LEAD_NOTIFY_EMAIL;
  if (resendKey && notifyEmail) {
    const from = process.env.LEAD_FROM_EMAIL || "Dayaprima <onboarding@resend.dev>";
    tasks.push(
      postJson(
        "https://api.resend.com/emails",
        {
          from,
          to: notifyEmail.split(",").map((value) => value.trim()),
          subject: `Lead baru: ${lead.name}${lead.projectReference ? ` - ${lead.projectReference}` : ""}`,
          text
        },
        { Authorization: `Bearer ${resendKey}` }
      )
    );
  }

  if (!tasks.length) return { sent: 0, total: 0 };
  const results = await Promise.allSettled(tasks);
  return {
    sent: results.filter((result) => result.status === "fulfilled" && result.value).length,
    total: tasks.length
  };
}
