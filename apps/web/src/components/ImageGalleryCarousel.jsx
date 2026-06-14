"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Lightbox } from "@/components/Lightbox";

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
        <Lightbox
          images={safeImages}
          title={title}
          index={active}
          onIndexChange={setActive}
          onClose={() => setLightboxOpen(false)}
        />
      ) : null}
    </div>
  );
}
