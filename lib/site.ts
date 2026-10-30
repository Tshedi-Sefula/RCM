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
    "Restoration Center Ministries Toitskraal is a community of believers passionate about Jesus and people. Join us for Sunday and midweek services in Toitskraal, Marble Hall.",
  copyright: "© 2026 Restoration Center Ministries Toitskraal",
  spotifyUrl:
    "https://open.spotify.com/artist/2n5wafdQFWEOKTK3vc9Cwf?si=z3knZ89NTbO0VHz2pDB6dg",
  // Phone and email are placeholders: replace with the church's real details.
  contact: {
    address: "RCM Toitskraal, D5 Toitskraal Woongebied, Marble Hall",
    phone: "[Phone number]",
    email: "[Email address]",
  },
  serviceTimes: [
    { day: "Sunday", time: "9:00 AM – 12:00 PM" },
    { day: "Wednesday", time: "7:00 PM" },
  ],
  // The same services as start times, for the home page countdown.
  // weekday: 0 = Sunday … 6 = Saturday, in the church's local time.
  serviceSchedule: [
    { weekday: 0, hour: 9, minute: 0 },
    { weekday: 3, hour: 19, minute: 0 },
  ],
  // Weekly services shown on every matching day of the /calendar page.
  // They're a given, so they live here rather than as calendar entries.
  // Times are "HH:MM" in the church's local time.
  recurringServices: [
    { title: "Sunday Service", weekday: 0, startTime: "09:00", endTime: "12:00" },
  ],
  // Home page "Our Fellowships" cards. Placeholders: edit the names,
  // descriptions and photos to match the church's ministries.
  fellowships: [
    {
      title: "Restoration Kids",
      description:
        "A safe, joyful space for children to learn about Jesus through stories, songs and play while parents join the service.",
      image: "/images/img1.jpg",
    },
    {
      title: "Women of Purpose",
      description:
        "Women growing together in faith and friendship through prayer, the Word and encouraging one another in every season.",
      image: "/images/img2.jpg",
    },
    {
      title: "Word & Prayer",
      description:
        "Our midweek gathering to go deeper in Scripture and stand together in prayer for our families and community.",
      image: "/images/img3.jpg",
    },
    {
      title: "Community Outreach",
      description:
        "Sharing the love of Christ in Toitskraal and beyond through children's events, care drives and practical help.",
      image: "/images/videos-hero.jpg",
    },
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
