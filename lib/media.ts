import type { StreamPlatform } from "@/lib/types/database";

// The host next.config.ts allows: this project's Supabase, or any
// *.supabase.co host when the URL isn't configured.
const supabaseHost = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SUPABASE_URL ?? "").hostname;
  } catch {
    return null;
  }
})();

// next/image only optimises hosts listed in next.config.ts (Supabase public
// storage). Anything else is rendered unoptimised instead of erroring.
export function isOptimizableImage(url: string) {
  try {
    const { protocol, hostname, pathname } = new URL(url);
    return (
      protocol === "https:" &&
      (supabaseHost ? hostname === supabaseHost : hostname.endsWith(".supabase.co")) &&
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

const YOUTUBE_ID_PATTERN = /^[\w-]{11}$/;
const YOUTUBE_HOSTS = new Set(["youtube.com", "www.youtube.com", "m.youtube.com", "music.youtube.com"]);

// Accepts a bare video ID or any common YouTube URL
// (watch?v=, youtu.be/, /embed/, /live/, /shorts/). Returns the 11-character
// ID, or null when there isn't one.
export function youtubeVideoId(idOrUrl: string) {
  const value = idOrUrl.trim();
  if (YOUTUBE_ID_PATTERN.test(value)) return value;
  try {
    // Pasted links often lack the scheme ("youtu.be/abc…").
    const url = new URL(/^https?:\/\//i.test(value) ? value : `https://${value}`);
    const host = url.hostname.toLowerCase();
    let id: string | null = null;
    if (host === "youtu.be") id = url.pathname.split("/")[1] ?? null;
    else if (YOUTUBE_HOSTS.has(host)) {
      id = url.searchParams.get("v") ?? url.pathname.match(/^\/(?:embed|live|shorts)\/([^/]+)/)?.[1] ?? null;
    }
    return id && YOUTUBE_ID_PATTERN.test(id) ? id : null;
  } catch {
    return null;
  }
}

// A public facebook.com (or fb.watch) video link, over https.
export function isFacebookVideoUrl(value: string) {
  try {
    const url = new URL(value.trim());
    return (
      url.protocol === "https:" &&
      /^((www|m|web)\.)?facebook\.com$|^fb\.watch$/i.test(url.hostname) &&
      url.pathname.length > 1
    );
  } catch {
    return false;
  }
}

// What the admin form stores in stream_videos.video_id_or_url: the bare
// video ID for YouTube, the full link for Facebook. Null if it's not valid.
export function normalizeStreamSource(platform: StreamPlatform, input: string) {
  if (platform === "youtube") return youtubeVideoId(input);
  return isFacebookVideoUrl(input) ? input.trim() : null;
}

// Returns the iframe src for a stream, or null if the value can't be parsed.
export function streamEmbedUrl(platform: StreamPlatform, idOrUrl: string) {
  if (platform === "youtube") {
    const id = youtubeVideoId(idOrUrl);
    return id ? `https://www.youtube.com/embed/${id}` : null;
  }
  // Facebook needs the full public video URL.
  if (!isFacebookVideoUrl(idOrUrl)) return null;
  return `https://www.facebook.com/plugins/video.php?href=${encodeURIComponent(idOrUrl.trim())}&show_text=false`;
}

// A normal watch link for a stored stream, for "open in new tab" links.
export function streamWatchUrl(platform: StreamPlatform, idOrUrl: string) {
  if (platform === "facebook") return isFacebookVideoUrl(idOrUrl) ? idOrUrl.trim() : null;
  const id = youtubeVideoId(idOrUrl);
  return id ? `https://www.youtube.com/watch?v=${id}` : null;
}
