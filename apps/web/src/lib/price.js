// Harga tipe rumah di CMS berupa teks bebas ("Mulai Rp 420 juta", "Rp 450.000.000",
// "1,5 miliar", dst). Util ini menebak nilai rupiahnya untuk simulasi & filter harga.

const DEFAULT_PRICE = 400_000_000;

export function parsePrice(text, fallback = DEFAULT_PRICE) {
  if (typeof text === "number" && Number.isFinite(text)) return text;
  if (!text) return fallback;

  const lower = String(text).toLowerCase();
  const match = lower.match(/[\d.,]+/);
  if (!match) return fallback;

  const hasMiliar = /miliar|milyar/.test(lower);
  const hasJuta = /juta|jt/.test(lower);
  let value;

  if (hasMiliar || hasJuta) {
    value = parseFloat(match[0].replace(/\.(?=\d{3}(\D|$))/g, "").replace(",", "."));
    value *= hasMiliar ? 1_000_000_000 : 1_000_000;
  } else {
    value = parseFloat(match[0].replace(/[.,]/g, ""));
  }

  return Number.isFinite(value) && value > 0 ? value : fallback;
}

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  maximumFractionDigits: 0
});

export function formatIDR(value) {
  return idrFormatter.format(Number(value) || 0);
}
