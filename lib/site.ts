// The public address of the site, used for canonical URLs, Open Graph tags,
// robots.txt and the sitemap. Set NEXT_PUBLIC_SITE_URL once you have a custom
// domain; on Vercel it falls back to the project's production domain.
function siteUrl() {
  if (process.env.NEXT_PUBLIC_SITE_URL) return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/$/, "");
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`;
  return "http://localhost:3000";
}

export type ServiceTime = {
  day: string;
  // Who the service is for, e.g. "RCM Youth"; null for the whole church.
  group: string | null;
  time: string;
  online: boolean;
  whatsappUrl: string | null;
};

export const site = {
  name: "Restoration Center Ministries Toitskraal",
  shortName: "RCM Toitskraal",
  url: siteUrl(),
  description:
    "Restoration Center Ministries Toitskraal is a community of believers passionate about Jesus and people. Join us on Sundays in Toitskraal, Marble Hall, and online midweek.",
  copyright: "© 2026 Restoration Center Ministries Toitskraal",
  spotifyUrl: "https://open.spotify.com/artist/2n5wafdQFWEOKTK3vc9Cwf",
  youtubeUrl: "https://youtube.com/@rcm_toitskraal?si=saY10tOEmNm0Hqi4",
  facebookUrl: "https://www.facebook.com/share/1JbSbE3SxM/",
  // Phone and email are placeholders: replace with the church's real details.
  contact: {
    address: "RCM Toitskraal, D5 Toitskraal Woongebied, Marble Hall",
    phone: "[Phone number]",
    email: "[Email address]",
  },
  // Shown on the home page service bar, the footer and the contact page.
  // Online services are held in WhatsApp groups; set whatsappUrl to a group's
  // invite link to turn its "Online via WhatsApp" note into a join link.
  serviceTimes: [
    { day: "Sunday", group: null, time: "9:00 AM – 12:00 PM", online: false, whatsappUrl: null },
    { day: "Wednesday", group: null, time: "7:00 PM", online: true, whatsappUrl: null },
    { day: "Thursday", group: "RCM Youth", time: "7:00 PM", online: true, whatsappUrl: null },
  ] as ServiceTime[],
  // The same services as start times, for the home page countdown.
  // weekday: 0 = Sunday … 6 = Saturday, in the church's local time.
  serviceSchedule: [
    { weekday: 0, hour: 9, minute: 0 },
    { weekday: 3, hour: 19, minute: 0 },
    { weekday: 4, hour: 19, minute: 0 },
  ],
  // Weekly services shown on every matching day of the /calendar page.
  // They're a given, so they live here rather than as calendar entries.
  // Times are "HH:MM" in the church's local time. Online services show
  // "Online via WhatsApp group" instead of the church's address.
  // The midweek end times assume an hour; adjust if they run longer.
  recurringServices: [
    { title: "Sunday Service", weekday: 0, startTime: "09:00", endTime: "12:00", online: false, about: null },
    { title: "Midweek Service", weekday: 3, startTime: "19:00", endTime: "20:00", online: true, about: null },
    // Short title so it fits a month-view cell; `about` leads the description.
    { title: "RCM Youth", weekday: 4, startTime: "19:00", endTime: "20:00", online: true, about: "Youth Bible Study." },
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
