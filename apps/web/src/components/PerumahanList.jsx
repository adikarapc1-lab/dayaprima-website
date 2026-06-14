"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BedDouble, Home, MapPin, RotateCcw, Search } from "lucide-react";
import { formatIDR } from "@/lib/price";

const BEDROOM_OPTIONS = [0, 1, 2, 3, 4];
const PRICE_STEP = 50_000_000;

function ceilTo(value, step) {
  return Math.ceil(value / step) * step;
}

export function PerumahanList({ items }) {
  const priceBound = useMemo(() => {
    const prices = items.map((item) => item.minPrice).filter((value) => typeof value === "number" && value > 0);
    if (!prices.length) return null;
    return ceilTo(Math.max(...prices), PRICE_STEP);
  }, [items]);

  const [query, setQuery] = useState("");
  const [minBedrooms, setMinBedrooms] = useState(0);
  const [maxPrice, setMaxPrice] = useState(priceBound);

  const priceFilterActive = priceBound !== null && maxPrice !== null && maxPrice < priceBound;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return items.filter((item) => {
      const matchesQuery =
        !q ||
        item.name.toLowerCase().includes(q) ||
        (item.location || "").toLowerCase().includes(q);
      const matchesBedrooms = item.maxBedrooms >= minBedrooms;
      const matchesPrice = !priceFilterActive
        ? true
        : typeof item.minPrice === "number" && item.minPrice <= maxPrice;
      return matchesQuery && matchesBedrooms && matchesPrice;
    });
  }, [items, query, minBedrooms, maxPrice, priceFilterActive]);

  function resetFilters() {
    setQuery("");
    setMinBedrooms(0);
    setMaxPrice(priceBound);
  }

  const isDirty = query !== "" || minBedrooms !== 0 || priceFilterActive;

  return (
    <div className="grid gap-8 lg:grid-cols-[280px_1fr]">
      <aside className="space-y-6 lg:sticky lg:top-24 lg:self-start">
        <div className="rounded-md bg-white p-5 shadow-soft">
          <label className="text-sm font-semibold text-ink" htmlFor="perumahan-search">
            Cari perumahan
          </label>
          <div className="mt-2 flex items-center gap-2 rounded-md border border-ink/15 px-3 focus-within:border-forest">
            <Search size={16} className="text-ink/40" />
            <input
              id="perumahan-search"
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Nama atau lokasi"
              className="w-full py-2.5 text-sm outline-none"
            />
          </div>
        </div>

        <div className="rounded-md bg-white p-5 shadow-soft">
          <p className="text-sm font-semibold text-ink">Jumlah kamar (minimal)</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {BEDROOM_OPTIONS.map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setMinBedrooms(value)}
                className={`rounded-md border px-3 py-1.5 text-sm transition ${
                  minBedrooms === value
                    ? "border-forest bg-forest text-white"
                    : "border-ink/15 text-ink/70 hover:border-forest"
                }`}
              >
                {value === 0 ? "Semua" : `${value}+`}
              </button>
            ))}
          </div>
        </div>

        {priceBound !== null ? (
          <div className="rounded-md bg-white p-5 shadow-soft">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-ink">Harga maksimum</p>
              <span className="text-sm font-medium text-forest">
                {priceFilterActive ? formatIDR(maxPrice) : "Semua"}
              </span>
            </div>
            <input
              type="range"
              min={PRICE_STEP}
              max={priceBound}
              step={PRICE_STEP}
              value={maxPrice ?? priceBound}
              onChange={(event) => setMaxPrice(Number(event.target.value))}
              className="mt-3 w-full accent-forest"
            />
            <p className="mt-1 text-xs text-ink/50">Berdasarkan harga tipe termurah tiap perumahan.</p>
          </div>
        ) : null}

        {isDirty ? (
          <button
            type="button"
            onClick={resetFilters}
            className="inline-flex items-center gap-2 text-sm font-semibold text-clay hover:underline"
          >
            <RotateCcw size={15} /> Reset filter
          </button>
        ) : null}
      </aside>

      <div>
        <p className="mb-5 text-sm text-ink/60">
          Menampilkan <span className="font-semibold text-ink">{filtered.length}</span> dari {items.length} perumahan
        </p>

        {filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2">
            {filtered.map((item) => (
              <Link
                key={item.slug}
                href={`/perumahan/${item.slug}`}
                className="group overflow-hidden rounded-md bg-white shadow-soft transition hover:-translate-y-1"
              >
                <div className="relative aspect-[16/10]">
                  <Image
                    src={item.heroImage || "/images/dayaprima-hero.png"}
                    alt={item.name}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <div className="flex items-center gap-2 text-sm text-leaf">
                    <MapPin size={16} /> {item.location?.split("(")[0]?.trim() || item.location}
                  </div>
                  <h3 className="mt-3 text-xl font-semibold text-ink">{item.name}</h3>
                  <p className="mt-2 text-sm leading-6 text-ink/65 line-clamp-2">{item.excerpt}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-ink/60">
                    {item.typeCount ? (
                      <span className="flex items-center gap-1.5">
                        <Home size={15} /> {item.typeCount} tipe
                      </span>
                    ) : null}
                    {item.maxBedrooms ? (
                      <span className="flex items-center gap-1.5">
                        <BedDouble size={15} /> hingga {item.maxBedrooms} kamar
                      </span>
                    ) : null}
                  </div>
                  <div className="mt-5 flex items-center justify-between">
                    {typeof item.minPrice === "number" ? (
                      <span className="text-sm">
                        <span className="text-ink/50">Mulai </span>
                        <span className="font-bold text-clay">{formatIDR(item.minPrice)}</span>
                      </span>
                    ) : (
                      <span className="text-sm font-medium text-ink/50">Hubungi kami</span>
                    )}
                    <span className="inline-flex items-center gap-1 text-sm font-semibold text-forest">
                      Detail <ArrowRight size={15} className="transition group-hover:translate-x-1" />
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="rounded-md border border-dashed border-ink/20 bg-white p-10 text-center">
            <p className="font-semibold text-ink">Tidak ada perumahan yang cocok</p>
            <p className="mt-2 text-sm text-ink/60">Coba ubah kata kunci atau longgarkan filter harga/kamar.</p>
            <button type="button" onClick={resetFilters} className="btn-secondary mt-5">
              <RotateCcw size={15} /> Reset filter
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
