export const site = {
  name: "Restoration Center Ministries Toitskraal",
  shortName: "RCM Toitskraal",
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
};

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/beliefs", label: "Beliefs" },
  { href: "/events", label: "Events" },
  { href: "/calendar", label: "Calendar" },
  { href: "/gallery", label: "Gallery" },
  { href: "/contact", label: "Contact" },
] as const;
