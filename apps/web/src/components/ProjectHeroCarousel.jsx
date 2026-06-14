"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

export function ProjectHeroCarousel({ project }) {
  const slides = useMemo(() => {
    const items = [
      { src: project.heroImage, isPromo: false },
      { src: project.promoBanner, isPromo: true },
      ...(project.gallery || []).map((src) => ({ src, isPromo: false })),
      { src: "/images/dayaprima-hero-2.png", isPromo: false },
      { src: "/images/dayaprima-hero-3.png", isPromo: false }
    ].filter((item) => item.src);

    return items.filter((item, index) => items.findIndex((candidate) => candidate.src === item.src) === index);
  }, [project.gallery, project.heroImage, project.promoBanner]);
  const [active, setActive] = useState(0);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActive((current) => (current + 1) % slides.length);
    }, 5200);

    return () => window.clearInterval(timer);
  }, [slides.length]);

  return (
    <section className="relative min-h-[58vh] w-full overflow-hidden bg-forest">
      {slides.map((slide, index) => (
        <div
          key={slide.src}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === active ? "opacity-100" : "opacity-0"
          }`}
        >
          {slide.isPromo ? (
            <>
              {/* Latar blur untuk mengisi area kosong saat letterbox (mis. di mobile). */}
              <Image
                src={slide.src}
                alt=""
                aria-hidden
                fill
                sizes="100vw"
                className="scale-110 object-cover blur-2xl brightness-50"
              />
              {/* Banner promo (desain khusus 3:1) tampil utuh memenuhi hero. */}
              <Image
                src={slide.src}
                alt={`${project.name} ${index + 1}`}
                fill
                priority={index === 0}
                sizes="100vw"
                className="object-contain"
              />
            </>
          ) : (
            <Image
              src={slide.src}
              alt={`${project.name} ${index + 1}`}
              fill
              priority={index === 0}
              sizes="100vw"
              className="object-cover"
            />
          )}
        </div>
      ))}

      {/* Gradient gelap dari kiri agar teks terbaca di semua slide (termasuk promo). */}
      <div className="absolute inset-0 bg-gradient-to-r from-ink/94 via-ink/62 to-ink/12" />
      <div className="absolute inset-y-0 left-0 w-full bg-[radial-gradient(circle_at_28%_58%,rgba(23,33,27,0.74)_0%,rgba(23,33,27,0.48)_36%,rgba(23,33,27,0.08)_68%,transparent_100%)]" />

      <div className="container-x relative flex min-h-[58vh] flex-col justify-end pb-12 text-white">
        <div className="max-w-3xl [text-shadow:0_2px_18px_rgba(0,0,0,0.45)]">
          <nav className="mb-5 flex items-center gap-2 text-sm text-white/78">
            <Link href="/">Home</Link>
            <ChevronRight size={15} /> <span>{project.name}</span>
          </nav>
          <h1 className="text-4xl font-semibold md:text-6xl">{project.name}</h1>
          <p className="mt-5 max-w-2xl text-lg leading-8 text-white/86">{project.excerpt}</p>
        </div>

        <div className="mt-7 flex gap-2" aria-label="Navigasi slide">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
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
    </section>
  );
}
