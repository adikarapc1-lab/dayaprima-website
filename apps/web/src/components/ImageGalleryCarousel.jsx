"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useState } from "react";

export function ImageGalleryCarousel({ images, title }) {
  const safeImages = images?.length ? images : [];
  const [active, setActive] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  if (!safeImages.length) return null;

  function move(direction) {
    setActive((current) => (current + direction + safeImages.length) % safeImages.length);
  }

  const previous = (active - 1 + safeImages.length) % safeImages.length;
  const next = (active + 1) % safeImages.length;

  return (
    <div className="overflow-hidden py-2">
      <div className="relative">
        {safeImages.length > 1 ? (
          <>
            <div className="absolute left-0 top-1/2 hidden h-[62%] w-1/4 -translate-y-1/2 overflow-hidden rounded-md opacity-75 md:block">
              <Image src={safeImages[previous]} alt={`${title} sebelumnya`} fill className="object-cover" />
              <div className="absolute inset-0 bg-mist/35" />
            </div>
            <div className="absolute right-0 top-1/2 hidden h-[62%] w-1/4 -translate-y-1/2 overflow-hidden rounded-md opacity-75 md:block">
              <Image src={safeImages[next]} alt={`${title} berikutnya`} fill className="object-cover" />
              <div className="absolute inset-0 bg-mist/35" />
            </div>
          </>
        ) : null}

        <button
          type="button"
          onClick={() => setLightboxOpen(true)}
          className="relative z-10 mx-auto block aspect-[16/9] w-full overflow-hidden rounded-md bg-white text-left shadow-soft md:w-[78%]"
          aria-label="Buka galeri besar"
        >
          <Image src={safeImages[active]} alt={`${title} ${active + 1}`} fill className="object-cover" />
        </button>

        {safeImages.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Gambar sebelumnya"
              onClick={() => move(-1)}
              className="absolute left-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-clay text-white shadow-soft transition hover:bg-forest md:left-[10%]"
            >
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              aria-label="Gambar berikutnya"
              onClick={() => move(1)}
              className="absolute right-3 top-1/2 z-20 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-clay text-white shadow-soft transition hover:bg-forest md:right-[10%]"
            >
              <ChevronRight size={22} />
            </button>
          </>
        ) : null}
      </div>

      {safeImages.length > 1 ? (
        <div className="mt-5 flex justify-center gap-2">
          {safeImages.map((image, index) => (
            <button
              key={image}
              type="button"
              aria-label={`Tampilkan gambar ${index + 1}`}
              onClick={() => setActive(index)}
              className={`relative h-14 w-20 overflow-hidden rounded-md border transition ${
                index === active ? "border-clay" : "border-transparent opacity-65 hover:opacity-100"
              }`}
            >
              <Image src={image} alt="" fill className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}

      {lightboxOpen ? (
        <div className="fixed inset-0 z-[9999] isolate bg-black/70" onClick={() => setLightboxOpen(false)}>
          <div className="absolute inset-0 z-0 bg-black/5" />
          <div className="absolute left-4 top-4 z-20 text-sm font-semibold text-white/80">
            {active + 1} / {safeImages.length}
          </div>
          <button
            type="button"
            aria-label="Tutup galeri"
            onClick={(event) => {
              event.stopPropagation();
              setLightboxOpen(false);
            }}
            className="absolute right-4 top-4 z-30 grid size-11 place-items-center rounded-md bg-white/10 text-white transition hover:bg-white/20 lg:right-[calc(11rem+1rem)]"
          >
            <X size={24} />
          </button>
          {safeImages.length > 1 ? (
            <>
              <button
                type="button"
                aria-label="Gambar sebelumnya"
                onClick={(event) => {
                  event.stopPropagation();
                  move(-1);
                }}
                className="absolute left-3 top-1/2 z-30 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/12 text-white transition hover:bg-clay md:left-8"
              >
                <ChevronLeft size={26} />
              </button>
              <button
                type="button"
                aria-label="Gambar berikutnya"
                onClick={(event) => {
                  event.stopPropagation();
                  move(1);
                }}
                className="absolute right-3 top-1/2 z-30 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/12 text-white transition hover:bg-clay lg:right-[calc(11rem+2rem)]"
              >
                <ChevronRight size={26} />
              </button>
            </>
          ) : null}
          <div className="relative z-10 flex h-full items-center justify-center p-4 pb-28 lg:pr-48 md:p-12">
            <div className="relative aspect-[16/9] w-full max-w-6xl bg-black shadow-[0_28px_90px_rgba(0,0,0,0.75)]" onClick={(event) => event.stopPropagation()}>
              <Image src={safeImages[active]} alt={`${title} ${active + 1}`} fill className="object-contain" />
            </div>
          </div>
          {safeImages.length > 1 ? (
            <aside className="absolute bottom-0 right-0 z-20 flex w-full gap-2 overflow-x-auto bg-white/95 p-2 lg:bottom-auto lg:top-0 lg:h-full lg:w-44 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden" onClick={(event) => event.stopPropagation()}>
              {safeImages.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setActive(index)}
                  className={`relative h-20 w-28 shrink-0 overflow-hidden border-4 transition lg:h-20 lg:w-full ${
                    index === active ? "border-clay" : "border-transparent hover:border-gold"
                  }`}
                  aria-label={`Buka gambar ${index + 1}`}
                >
                  <Image src={image} alt="" fill className="object-cover" />
                </button>
              ))}
            </aside>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
