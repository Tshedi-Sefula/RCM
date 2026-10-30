import type { Metadata } from "next";
import { Suspense } from "react";
import GalleryGrid from "@/components/GalleryGrid";
import { Container, Hero, Notice } from "@/components/ui";
import { getGalleryImages } from "@/lib/data/public";

export const metadata: Metadata = { title: "Gallery" };

export default function GalleryPage() {
  return (
    <>
      <Hero title="Our Moments" />
      <Container className="py-16">
        <Suspense fallback={<GallerySkeleton />}>
          <Gallery />
        </Suspense>
      </Container>
    </>
  );
}

async function Gallery() {
  const { data: images, error } = await getGalleryImages();

  if (error !== null) {
    return (
      <Notice tone="error" title="We couldn't load the gallery">
        Please try again in a little while.
      </Notice>
    );
  }
  if (images.length === 0) {
    return (
      <Notice title="No photos yet">Photos from our services and events will appear here soon.</Notice>
    );
  }

  return (
    <GalleryGrid
      images={images.map((img) => ({
        id: img.id,
        src: img.image_url,
        alt: img.caption ?? "Photo from a church gathering",
        caption: img.caption,
      }))}
    />
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-3" aria-hidden>
      {Array.from({ length: 6 }, (_, i) => (
        <div key={i} className="aspect-[4/3] animate-pulse rounded-lg bg-brand-cream" />
      ))}
    </div>
  );
}
