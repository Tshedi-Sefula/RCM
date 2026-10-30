// Image upload rules, shared by the admin forms (to reject a file before
// uploading it) and Server Actions (to check the path they're handed).
// Mirrors the bucket limits in supabase/migrations/20261030000100_storage.sql,
// which Storage enforces regardless.

export const IMAGE_MAX_BYTES = 10 * 1024 * 1024;

const IMAGE_EXTENSIONS: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/avif": "avif",
};

export const IMAGE_ACCEPT = Object.keys(IMAGE_EXTENSIONS).join(",");

// Returns a message to show the admin, or null if the file is fine.
export function validateImage(file: File) {
  if (!IMAGE_EXTENSIONS[file.type]) return "Choose a JPEG, PNG, WebP or AVIF image.";
  if (file.size > IMAGE_MAX_BYTES) return "Images must be 10 MB or smaller.";
  return null;
}

// A fresh, unguessable object name, so uploads never overwrite each other.
export function newImagePath(file: File) {
  return `${crypto.randomUUID()}.${IMAGE_EXTENSIONS[file.type]}`;
}

// Only paths made by newImagePath are accepted from forms.
export const IMAGE_PATH_PATTERN =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}\.(jpg|png|webp|avif)$/;
