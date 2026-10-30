import type { Metadata } from "next";
import Image from "next/image";
import { Suspense } from "react";
import { deleteGalleryImage } from "@/app/admin/gallery/actions";
import AdminLayout from "@/components/admin/AdminLayout";
import DeleteButton from "@/components/admin/DeleteButton";
import GalleryUploadButton from "@/components/admin/GalleryUploadButton";
import PageHeader from "@/components/admin/PageHeader";
import { Notice } from "@/components/ui";
import { getAllGalleryImages } from "@/lib/data/admin";
import { isOptimizableImage } from "@/lib/media";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Gallery images" };

const dateFormat = new Intl.DateTimeFormat("en-ZA", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: site.timeZone,
});

export default function AdminGalleryPage() {
  return (
    <AdminLayout>
      <PageHeader
        eyebrow="Content"
        title="Gallery images"
        description="Photos shown on the website's Gallery page, newest first."
        action={<GalleryUploadButton />}
      />
      <Suspense fallback={<GallerySkeleton />}>
        <GalleryList />
      </Suspense>
    </AdminLayout>
  );
}

async function GalleryList() {
  const { data: images, error } = await getAllGalleryImages();

  if (error !== null) {
    return (
      <Notice tone="error" title="Gallery images couldn't be loaded">
        Refresh the page to try again.
      </Notice>
    );
  }

  if (images.length === 0) {
    return <Notice title="No photos yet">Use “Upload photos” to add the first ones.</Notice>;
  }

  return (
    <>
      <p className="mb-4 text-sm text-brand-muted">
        {images.length} {images.length === 1 ? "photo" : "photos"}
      </p>
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
        {images.map((image) => (
          <li key={image.id} className="overflow-hidden rounded-2xl border border-brand-line bg-white shadow-card">
            <div className="relative aspect-[4/3] bg-brand-cream">
              <Image
                src={image.image_url}
                alt={image.caption ?? ""}
                fill
                sizes="(min-width: 1280px) 25vw, (min-width: 640px) 33vw, 50vw"
                unoptimized={!isOptimizableImage(image.image_url)}
                className="object-cover"
              />
            </div>
            <div className="flex items-start justify-between gap-2 p-3">
              <div className="min-w-0 text-sm">
                <p className={image.caption ? "line-clamp-2 text-brand-ink" : "italic text-brand-muted"}>
                  {image.caption ?? "No caption"}
                </p>
                <p className="mt-0.5 text-xs text-brand-muted">
                  <time dateTime={image.uploaded_at}>{dateFormat.format(new Date(image.uploaded_at))}</time>
                </p>
              </div>
              <DeleteButton
                action={deleteGalleryImage.bind(null, image.id)}
                itemName={image.caption ? `“${image.caption}”` : "This photo"}
              />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

function GallerySkeleton() {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4" aria-hidden>
      {Array.from({ length: 8 }, (_, i) => (
        <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-brand-cream" />
      ))}
    </div>
  );
}
