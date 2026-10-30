import type { Metadata } from "next";
import Image from "next/image";
import Hero from "@/components/ui/Hero";

export const metadata: Metadata = { title: "Gallery" };

const photos = [
  { src: "/images/img1.jpg", alt: "Church event 1" },
  { src: "/images/img2.jpg", alt: "Church event 2" },
  { src: "/images/img3.jpg", alt: "Church event 3" },
];

export default function GalleryPage() {
  return (
    <>
      <Hero title="Our Moments" />
      <section className="mx-auto grid max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3">
        {photos.map((photo) => (
          <div key={photo.src} className="relative aspect-[4/3] overflow-hidden rounded-lg bg-brand-cream">
            <Image
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              className="object-cover transition duration-300 hover:scale-105"
            />
          </div>
        ))}
      </section>
    </>
  );
}
