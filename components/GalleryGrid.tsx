"use client";

import Image from "next/image";
import { useState } from "react";
import Lightbox, { type LightboxImage } from "@/components/Lightbox";
import { isOptimizableImage } from "@/lib/media";

// Responsive photo grid; each photo opens in the lightbox.
export default function GalleryGrid({ images }: { images: Array<LightboxImage & { id: string }> }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <>
      <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3">
        {images.map((image, i) => (
          <li key={image.id}>
            <button
              type="button"
              onClick={() => setOpenIndex(i)}
              aria-label={`View larger: ${image.alt}`}
              className="group relative block aspect-[4/3] w-full overflow-hidden rounded-lg bg-brand-cream"
            >
              <Image
                src={image.src}
                alt={image.alt}
                fill
                unoptimized={!isOptimizableImage(image.src)}
                sizes="(min-width: 1024px) 33vw, 50vw"
                className="object-cover transition duration-300 group-hover:scale-105 motion-reduce:transition-none"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={openIndex} onIndexChange={setOpenIndex} />
    </>
  );
}
