// Shared by the staff login form (HTML5 attributes) and its Server Action.
export const EMAIL_MAX = 254;
export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const PASSWORD_MIN = 6;
// Supabase (bcrypt) ignores anything past 72 bytes.
export const PASSWORD_MAX = 72;

// Client-side brute-force lockout: after this many failed attempts the form
// is disabled for LOCKOUT_MS. Supabase Auth rate-limits on the server too.
export const MAX_ATTEMPTS = 5;
export const LOCKOUT_MS = 60_000;
