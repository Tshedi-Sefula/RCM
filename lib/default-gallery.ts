import type { LightboxImage } from "@/components/Lightbox";
import type { GalleryImage } from "@/lib/types/database";

// TEMPORARY SYNC: the photos bundled in /public/images (ministry covers and
// galleries, page heroes) are merged into the public Gallery alongside the
// admin's Supabase uploads so the gallery isn't missing them before they've
// been uploaded. Once the admin manually uploads or replaces them via the
// dashboard, this fallback can be removed.
//
// Posters and the logo are left out on purpose: they aren't gallery photos.
//
// Duplicate prevention: a default image is skipped when an uploaded row in
// `gallery_images` matches either:
// - the same `image_url` / filename (e.g. "/images/drum.png" or ".../drum.png"), or
// - the same caption (case-insensitive), since Supabase uploads use random UUID
//   filenames (`lib/uploads.ts`).

export type DefaultGalleryImage = GalleryImage & LightboxImage;

const SEED_UPLOADED_AT = "2026-01-01T00:00:00.000Z";

export const defaultGalleryImages: DefaultGalleryImage[] = [
  {
    id: "default-drum",
    image_url: "/images/drum.png",
    src: "/images/drum.png",
    alt: "RCM Toitskraal's young men in vintage outfits on a Drum magazine-style cover",
    caption: "Young Men, Vintage Sunday, November 2025",
    uploaded_at: SEED_UPLOADED_AT,
  },
  {
    id: "default-youth-beauty-galore",
    image_url: "/images/youth-beauty-galore.png",
    src: "/images/youth-beauty-galore.png",
    alt: "RCM Toitskraal's young women in vintage outfits on a Drum magazine-style cover",
    caption: "Beauty Galore, Vintage Sunday, November 2025",
    uploaded_at: SEED_UPLOADED_AT,
  },
  {
    id: "default-youth-outreach",
    image_url: "/images/youth-outreach.jpeg",
    src: "/images/youth-outreach.jpeg",
    alt: "Youth members in tutus dancing with children at an outreach day",
    caption: "RCM Youth outreach",
    uploaded_at: SEED_UPLOADED_AT,
  },
  {
    id: "default-hero",
    image_url: "/images/hero.jpg",
    src: "/images/hero.jpg",
    alt: "The congregation gathered for a Sunday service",
    caption: null,
    uploaded_at: SEED_UPLOADED_AT,
  },
  {
    id: "default-about-hero",
    image_url: "/images/about-hero.jpg",
    src: "/images/about-hero.jpg",
    alt: "Members praying for one another during a service",
    caption: null,
    uploaded_at: SEED_UPLOADED_AT,
  },
  {
    id: "default-img1",
    image_url: "/images/img1.jpg",
    src: "/images/img1.jpg",
    alt: "Children holding Restoration Kids banners",
    caption: null,
    uploaded_at: SEED_UPLOADED_AT,
  },
  {
    id: "default-img2",
    image_url: "/images/img2.jpg",
    src: "/images/img2.jpg",
    alt: "A member worshipping during the service",
    caption: null,
    uploaded_at: SEED_UPLOADED_AT,
  },
  {
    id: "default-img3",
    image_url: "/images/img3.jpg",
    src: "/images/img3.jpg",
    alt: "A speaker sharing the Word from the pulpit",
    caption: null,
    uploaded_at: SEED_UPLOADED_AT,
  },
  {
    id: "default-videos-hero",
    image_url: "/images/videos-hero.jpg",
    src: "/images/videos-hero.jpg",
    alt: "Families at a children's outreach day",
    caption: null,
    uploaded_at: SEED_UPLOADED_AT,
  },
];

const normalize = (value: string | null | undefined) => value?.trim().toLowerCase() || null;

const basename = (url: string) => {
  const clean = url.split("?")[0] ?? url;
  return clean.slice(clean.lastIndexOf("/") + 1).toLowerCase();
};

const defaultAltByUrl = new Map(defaultGalleryImages.map((img) => [img.image_url, img.alt]));

// Combines Supabase `gallery_images` rows with `defaultGalleryImages`, omitting
// any default that has already been uploaded (matched by URL, filename, or caption).
export function mergeWithDefaultGalleryImages(uploaded: GalleryImage[]): GalleryImage[] {
  const seenUrls = new Set(uploaded.map((img) => img.image_url.trim().toLowerCase()));
  const seenFiles = new Set(uploaded.map((img) => basename(img.image_url)).filter(Boolean));
  const seenCaptions = new Set(uploaded.map((img) => normalize(img.caption)).filter(Boolean));

  const remainingDefaults = defaultGalleryImages.filter((item) => {
    const url = item.image_url.toLowerCase();
    const file = basename(item.image_url);
    const caption = normalize(item.caption);
    if (seenUrls.has(url) || (file && seenFiles.has(file))) return false;
    if (caption && seenCaptions.has(caption)) return false;
    return true;
  });

  return [
    ...uploaded,
    ...remainingDefaults.map(({ id, image_url, caption, uploaded_at }) => ({
      id,
      image_url,
      caption,
      uploaded_at,
    })),
  ];
}

// Formats merged gallery rows for <GalleryGrid />, preserving descriptive alt
// text for bundled images that don't have a visible caption.
export function toGalleryGridItems(images: GalleryImage[]): Array<LightboxImage & { id: string }> {
  return mergeWithDefaultGalleryImages(images).map((img) => ({
    id: img.id,
    src: img.image_url,
    alt: img.caption ?? defaultAltByUrl.get(img.image_url) ?? "Photo from a church gathering",
    caption: img.caption,
  }));
}
