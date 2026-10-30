// The public address of the site, used for canonical URLs, Open Graph tags,
// robots.txt and the sitemap. Set NEXT_PUBLIC_SITE_URL once you have a custom
// domain; on Vercel it falls back to the project's production domain.
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export const site = {
  name: "Restoration Center Ministries Toitskraal",
  shortName: "RCM Toitskraal",
  url: siteUrl(),
  description:
    "Restoration Center Ministries Toitskraal is a community of believers passionate about Jesus and people. Join us for Sunday and midweek services in Toitskraal, Mpumalanga.",
  copyright: "© 2026 Restoration Center Ministries Toitskraal",
  spotifyUrl:
    "https://open.spotify.com/artist/2n5wafdQFWEOKTK3vc9Cwf?si=z3knZ89NTbO0VHz2pDB6dg",
  // Placeholders: replace with the church's real details.
  contact: {
    address: "Toitskraal, Mpumalanga, South Africa",
    phone: "[Phone number]",
    email: "[Email address]",
  },
  serviceTimes: [
    { day: "Sunday", time: "9:00 AM & 6:00 PM" },
    { day: "Wednesday", time: "7:00 PM" },
  ],
  // Home page intro video. Placeholder: replace with the church's own
  // YouTube video ID (the part after "watch?v=" in the URL).
  introVideo: {
    youtubeId: "aqz-KE-bpKQ",
    title: "Welcome to RCM Toitskraal",
  },
  // Dates and times are shown in the church's local time zone.
  timeZone: "Africa/Johannesburg",
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/beliefs", label: "Beliefs" },
  { href: "/events", label: "Events" },
  { href: "/calendar", label: "Calendar" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;
