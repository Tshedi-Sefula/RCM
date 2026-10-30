import type { StreamPlatform } from "@/lib/types/database";

// next/image only optimises hosts listed in next.config.ts (Supabase public
// storage). Anything else is rendered unoptimised instead of erroring.
export function isOptimizableImage(url: string) {
  try {
    const { protocol, hostname, pathname } = new URL(url);
    return (
      protocol === "https:" &&
      hostname.endsWith(".supabase.co") &&
      pathname.startsWith("/storage/v1/object/public/")
    );
  } catch {
    // Relative paths (files in /public) are always fine.
    return url.startsWith("/");
  }
}

// The object path inside `bucket` for one of its public URLs, so the file
// can be removed later. Null when the URL points anywhere else.
export function storagePathFromPublicUrl(url: string, bucket: string) {
  try {
    const { pathname } = new URL(url);
    const prefix = `/storage/v1/object/public/${bucket}/`;
    return pathname.startsWith(prefix) ? decodeURIComponent(pathname.slice(prefix.length)) : null;
  } catch {
    return null;
  }
}

// Accepts a bare video ID or any common YouTube URL
// (watch?v=, youtu.be/, /embed/, /live/, /shorts/).
export function youtubeVideoId(idOrUrl: string) {
  const value = idOrUrl.trim();
  if (/^[\w-]{11}$/.test(value)) return value;
  try {
    const url = new URL(value);
    if (url.hostname === "youtu.be") return url.pathname.slice(1) || null;
    const v = url.searchParams.get("v");
    if (v) return v;
    const match = url.pathname.match(/^\/(?:embed|live|shorts)\/([\w-]{11})/);
    return match ? match[1] : null;
  } catch {
    return null;
  }
}

// Returns the iframe src for a stream, or null if the value can't be parsed.
export function streamEmbedUrl(platform: StreamPlatform, idOrUrl: string) {
  if (platform === "youtube") {
    const id = youtubeVideoId(idOrUrl);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  // Facebook needs the full public video URL.
  if (!/^https:\/\/(www\.|m\.|web\.)?(facebook\.com|fb\.watch)\//.test(idOrUrl.trim())) return null;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(idOrUrl.trim())}&show_text=false`;
}
