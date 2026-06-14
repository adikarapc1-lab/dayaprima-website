"use client";

import { useMemo, useState } from "react";
import { Calculator, MessageCircle } from "lucide-react";
import { trackEvent, whatsappUrl } from "@/lib/analytics";
import { formatIDR, parsePrice } from "@/lib/price";

const DEFAULTS = { interestRate: 7, tenorYears: 15, dpPercent: 20 };

export function KprSimulator({
  priceText,
  whatsapp,
  contextName,
  interestRate,
  tenorYears,
  dpPercent
}) {
  const basePrice = useMemo(() => parsePrice(priceText), [priceText]);
  const [price, setPrice] = useState(basePrice);
  const [dp, setDp] = useState(dpPercent ?? DEFAULTS.dpPercent);
  const [tenor, setTenor] = useState(tenorYears ?? DEFAULTS.tenorYears);
  const [rate, setRate] = useState(interestRate ?? DEFAULTS.interestRate);

  const { dpAmount, loan, monthly } = useMemo(() => {
    const safePrice = Number(price) > 0 ? Number(price) : 0;
    const dpAmount = Math.round((safePrice * dp) / 100);
    const loan = Math.max(safePrice - dpAmount, 0);
    const r = rate / 100 / 12;
    const n = Math.max(Math.round(tenor * 12), 1);
    const raw = r > 0 ? (loan * r * (1 + r) ** n) / ((1 + r) ** n - 1) : loan / n;
    return { dpAmount, loan, monthly: Math.round(raw) };
  }, [price, dp, tenor, rate]);

  const waHref = whatsappUrl({
    number: whatsapp,
    projectName: contextName,
    source: "kpr_simulator",
    message:
      `Halo Dayaprima, saya tertarik dengan ${contextName}. ` +
      `Dari Simulasi KPR: harga ${formatIDR(price || 0)}, DP ${dp}% (${formatIDR(dpAmount)}), ` +
      `tenor ${tenor} tahun, bunga ${rate}%, estimasi cicilan ${formatIDR(monthly)}/bulan. ` +
      `Mohon info lebih lanjut.`
  });

  return (
    <div id="simulasi-kpr" className="rounded-md bg-white p-6 shadow-soft">
      <div className="flex items-center gap-2">
        <Calculator className="text-leaf" />
        <h2 className="text-2xl font-semibold text-ink">Simulasi KPR</h2>
      </div>
      <p className="mt-2 text-sm text-ink/60">
        Geser nilai di bawah untuk memperkirakan cicilan bulanan dengan skema anuitas.
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <div className="space-y-5">
          <label className="block">
            <span className="text-sm font-medium text-ink/70">Harga rumah</span>
            <input
              type="number"
              min={0}
              step={1000000}
              value={price}
              onChange={(event) => setPrice(Number(event.target.value))}
              className="mt-2 w-full rounded-md border border-ink/15 px-4 py-2.5 text-sm focus:border-forest focus:outline-none"
            />
            <span className="mt-1 block text-xs text-ink/50">{formatIDR(price || 0)}</span>
          </label>

          <label className="block">
            <div className="flex items-center justify-between text-sm font-medium text-ink/70">
              <span>Uang muka (DP)</span>
              <span className="text-forest">{dp}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={50}
              step={1}
              value={dp}
              onChange={(event) => setDp(Number(event.target.value))}
              className="mt-3 w-full accent-forest"
            />
            <span className="mt-1 block text-xs text-ink/50">{formatIDR(dpAmount)}</span>
          </label>

          <label className="block">
            <div className="flex items-center justify-between text-sm font-medium text-ink/70">
              <span>Tenor</span>
              <span className="text-forest">{tenor} tahun</span>
            </div>
            <input
              type="range"
              min={1}
              max={25}
              step={1}
              value={tenor}
              onChange={(event) => setTenor(Number(event.target.value))}
              className="mt-3 w-full accent-forest"
            />
          </label>

          <label className="block">
            <div className="flex items-center justify-between text-sm font-medium text-ink/70">
              <span>Suku bunga / tahun</span>
              <span className="text-forest">{rate}%</span>
            </div>
            <input
              type="range"
              min={0}
              max={20}
              step={0.25}
              value={rate}
              onChange={(event) => setRate(Number(event.target.value))}
              className="mt-3 w-full accent-forest"
            />
          </label>
        </div>

        <div className="flex flex-col justify-between gap-5 rounded-md bg-mist p-5">
          <div>
            <p className="text-sm text-ink/60">Estimasi cicilan per bulan</p>
            <p className="mt-1 text-3xl font-bold text-clay">{formatIDR(monthly)}</p>
            <dl className="mt-5 space-y-2 text-sm">
              <div className="flex items-center justify-between">
                <dt className="text-ink/60">Uang muka</dt>
                <dd className="font-medium text-ink">{formatIDR(dpAmount)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink/60">Pokok pinjaman</dt>
                <dd className="font-medium text-ink">{formatIDR(loan)}</dd>
              </div>
              <div className="flex items-center justify-between">
                <dt className="text-ink/60">Tenor</dt>
                <dd className="font-medium text-ink">{tenor} tahun ({tenor * 12} bulan)</dd>
              </div>
            </dl>
          </div>

          <a
            href={waHref}
            target="_blank"
            rel="noreferrer"
            onClick={() => trackEvent("kpr_simulate_whatsapp", { project_name: contextName })}
            className="btn-primary w-full justify-center"
          >
            <MessageCircle size={18} />
            Konsultasi via WhatsApp
          </a>
        </div>
      </div>

      <p className="mt-5 text-xs leading-5 text-ink/50">
        *Estimasi ini hanya simulasi awal dengan metode anuitas dan bukan penawaran resmi. Suku bunga,
        biaya, dan persetujuan KPR mengikuti ketentuan bank.
      </p>
    </div>
  );
}
