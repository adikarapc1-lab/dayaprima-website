"use client";

import Image from "next/image";
import Link from "next/link";
import { Download } from "lucide-react";
import { useEffect, useState } from "react";
import { WhatsappButton } from "@/components/WhatsappButton";

export function HeroCarousel({ globals }) {
  const slides = [
    "/images/dayaprima-hero.png",
    "/images/dayaprima-hero-2.png",
    "/images/dayaprima-hero-3.png"
  ];
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-[calc(100vh-4rem)] overflow-hidden">
      {slides.map((image, index) => (
        <Image
          key={image}
          src={image}
          alt={`Kawasan perumahan ${globals.companyName} ${index + 1}`}
          fill
          priority={index === 0}
          sizes="100vw"
          className={`object-cover transition-opacity duration-1000 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        />
      ))}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/94 via-ink/62 to-ink/12" />
      <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_28%_52%,rgba(23,33,27,0.76)_0%,rgba(23,33,27,0.48)_34%,rgba(23,33,27,0.08)_66%,transparent_100%)]" />
      <div className="container-x relative flex min-h-[calc(100vh-4rem)] items-center py-20">
        <div className="max-w-2xl text-white [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
          <p className="mb-5 inline-flex rounded-md bg-white/12 px-3 py-2 text-sm font-medium backdrop-blur">
            Developer Perumahan Terpercaya
          </p>
          <h1 className="text-4xl font-semibold leading-tight sm:text-6xl">{globals.companyName}</h1>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/82">
            {globals.tagline}. Temukan proyek hunian strategis dengan lingkungan tertata dan proses konsultasi yang jelas.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <WhatsappButton number={globals.whatsapp} />
            <Link href="#projects" className="btn-secondary bg-white/95">
              Lihat Perumahan
            </Link>
          </div>
          <div className="mt-3">
            <a href="/api/brochure" className="btn-secondary bg-white/95" download>
              <Download size={18} />
              Download Brosur
            </a>
          </div>
          <div className="mt-8 flex gap-2" aria-label="Slide hero aktif">
            {slides.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`Tampilkan slide ${index + 1}`}
                onClick={() => setActive(index)}
                className={`h-2.5 rounded-full transition-all ${
                  index === active ? "w-8 bg-gold" : "w-2.5 bg-white/55 hover:bg-white"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
