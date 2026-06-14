"use client";

import { useEffect } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

// Modal galeri layar penuh yang dipakai bersama oleh GalleryGrid & ImageGalleryCarousel.
// Index dikontrol parent (controlled) supaya state galeri tetap satu sumber.
export function Lightbox({ images, title = "", index, onIndexChange, onClose }) {
  const count = images?.length || 0;

  useEffect(() => {
    function onKey(event) {
      if (event.key === "Escape") onClose();
      else if (event.key === "ArrowLeft") onIndexChange((index - 1 + count) % count);
      else if (event.key === "ArrowRight") onIndexChange((index + 1) % count);
    }
    document.addEventListener("keydown", onKey);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [index, count, onIndexChange, onClose]);

  if (!count) return null;

  const go = (direction) => onIndexChange((index + direction + count) % count);

  return (
    <div className="fixed inset-0 z-[9999] isolate bg-black/70" onClick={onClose} role="dialog" aria-modal="true">
      <div className="absolute left-4 top-4 z-20 text-sm font-semibold text-white/80">
        {index + 1} / {count}
      </div>
      <button
        type="button"
        aria-label="Tutup galeri"
        onClick={(event) => {
          event.stopPropagation();
          onClose();
        }}
        className="absolute right-4 top-4 z-30 grid size-11 place-items-center rounded-md bg-white/10 text-white transition hover:bg-white/20 lg:right-[calc(11rem+1rem)]"
      >
        <X size={24} />
      </button>

      {count > 1 ? (
        <>
          <button
            type="button"
            aria-label="Gambar sebelumnya"
            onClick={(event) => {
              event.stopPropagation();
              go(-1);
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
              go(1);
            }}
            className="absolute right-3 top-1/2 z-30 grid size-12 -translate-y-1/2 place-items-center rounded-full bg-white/12 text-white transition hover:bg-clay lg:right-[calc(11rem+2rem)]"
          >
            <ChevronRight size={26} />
          </button>
        </>
      ) : null}

      <div className="relative z-10 flex h-full items-center justify-center p-4 pb-28 md:p-12 lg:pr-48">
        <div
          className="relative aspect-[16/9] w-full max-w-6xl bg-black shadow-[0_28px_90px_rgba(0,0,0,0.75)]"
          onClick={(event) => event.stopPropagation()}
        >
          <Image src={images[index]} alt={`${title} ${index + 1}`} fill className="object-contain" />
        </div>
      </div>

      {count > 1 ? (
        <aside
          className="absolute bottom-0 right-0 z-20 flex w-full gap-2 overflow-x-auto bg-white/95 p-2 lg:bottom-auto lg:top-0 lg:h-full lg:w-44 lg:flex-col lg:overflow-y-auto lg:overflow-x-hidden"
          onClick={(event) => event.stopPropagation()}
        >
          {images.map((image, thumbIndex) => (
            <button
              key={image}
              type="button"
              onClick={() => onIndexChange(thumbIndex)}
              className={`relative h-20 w-28 shrink-0 overflow-hidden border-4 transition lg:h-20 lg:w-full ${
                thumbIndex === index ? "border-clay" : "border-transparent hover:border-gold"
              }`}
              aria-label={`Buka gambar ${thumbIndex + 1}`}
            >
              <Image src={image} alt="" fill className="object-cover" />
            </button>
          ))}
        </aside>
      ) : null}
    </div>
  );
}
