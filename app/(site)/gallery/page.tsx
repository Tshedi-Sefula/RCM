import type { Metadata } from "next";
import { Suspense } from "react";
import GalleryGrid from "@/components/GalleryGrid";
import { Container, Hero, Notice } from "@/components/ui";
import { getGalleryImages } from "@/lib/data/public";
import { defaultGalleryImages, toGalleryGridItems } from "@/lib/default-gallery";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata: Metadata = {
  title: "Gallery",
  description: "Photos from services, events and community life at RCM Toitskraal.",
  alternates: { canonical: "/gallery" },
};

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
  const { data: uploaded, error } = await getGalleryImages();

  if (error !== null) {
    // Local development without Supabase: preview with the bundled photos.
    if (!isSupabaseConfigured) {
      return <GalleryGrid images={defaultGalleryImages} />;
    }
    return (
      <Notice tone="error" title="We couldn't load the gallery">
        Please try again in a little while.
      </Notice>
    );
  }

  // Temporary sync: combine Supabase uploads with the bundled photos in
  // /public/images (without duplicates) until the admin uploads/replaces them.
  const images = toGalleryGridItems(uploaded);
  if (images.length === 0) {
    return (
      <Notice title="No photos yet">Photos from our services and events will appear here soon.</Notice>
    );
  }

  return <GalleryGrid images={images} />;
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
