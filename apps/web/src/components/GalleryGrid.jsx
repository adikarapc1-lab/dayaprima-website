"use client";

import { useState } from "react";
import Image from "next/image";
import { Lightbox } from "@/components/Lightbox";

// Grid thumbnail yang membuka Lightbox saat diklik (pengganti link <a> ke file mentah).
export function GalleryGrid({ images, title = "" }) {
  const safeImages = images?.length ? images : [];
  const [open, setOpen] = useState(false);
  const [index, setIndex] = useState(0);

  if (!safeImages.length) return null;

  function openAt(targetIndex) {
    setIndex(targetIndex);
    setOpen(true);
  }

  return (
    <>
      <div className="grid gap-4 sm:grid-cols-2">
        {safeImages.map((image, imageIndex) => (
          <button
            key={image}
            type="button"
            onClick={() => openAt(imageIndex)}
            className="group relative aspect-[4/3] overflow-hidden rounded-md bg-white shadow-soft"
            aria-label={`Perbesar gambar ${imageIndex + 1}`}
          >
            <Image
              src={image}
              alt={`${title} ${imageIndex + 1}`}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
            />
          </button>
        ))}
      </div>

      {open ? (
        <Lightbox
          images={safeImages}
          title={title}
          index={index}
          onIndexChange={setIndex}
          onClose={() => setOpen(false)}
        />
      ) : null}
    </>
  );
}
