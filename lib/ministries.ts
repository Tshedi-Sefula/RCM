// Ministries shown as cards on the home page ("Our Fellowships") and as
// detail pages at /ministries/[slug]. Edit the entries here and both update.
//
// - `slug` is the URL segment, e.g. "rcm-youth" → /ministries/rcm-youth.
//   Keep it lowercase with hyphens, and unique.
// - `description` is the short blurb on the home page card.
// - `coverImage` is the card photo and the detail page hero; null shows a
//   branded placeholder on the card and a dark gradient on the hero.
// - `fullDescription` is the detail page text. Separate paragraphs with a
//   blank line ("\n\n").
// - `gallery` lists photos (paths under /public) shown on the detail page;
//   leave it empty to hide the gallery section.

export type Ministry = {
  slug: string;
  title: string;
  description: string;
  coverImage: string | null;
  fullDescription: string;
  gallery: string[];
};

export const ministries: Ministry[] = [
  {
    slug: "restoration-kids",
    title: "Restoration Kids",
    description:
      "A safe, joyful space for children to learn about Jesus through stories, songs and play while parents join the service.",
    coverImage: "/images/img1.jpg",
    // Placeholder: replace with a fuller description of the ministry.
    fullDescription:
      "Restoration Kids is a safe, joyful space for children to learn about Jesus through stories, songs and play while parents join the service.",
    gallery: [],
  },
  {
    slug: "rcm-youth",
    title: "RCM Youth",
    description:
      "Empowering the next generation to grow in faith, build meaningful friendships and discover their purpose in Christ.",
    coverImage: "/images/drum.png",
    fullDescription:
      "RCM Youth is a vibrant community of young people passionate about Jesus. We meet every Thursday at 7:00 PM online via WhatsApp for Bible Study, diving deep into the Word and supporting each other in our daily walks with Christ. Join us as we grow in faith, build meaningful friendships, and discover our purpose.",
    gallery: ["/images/drum.png", "/images/youth-beauty-galore.png", "/images/youth-outreach.jpeg"],
  },
  {
    slug: "women-of-purpose",
    title: "Women of Purpose",
    description:
      "Women growing together in faith and friendship through prayer, the Word and encouraging one another in every season.",
    coverImage: "/images/img2.jpg",
    // Placeholder: replace with a fuller description of the ministry.
    fullDescription:
      "Women of Purpose is a community of women growing together in faith and friendship through prayer, the Word and encouraging one another in every season.",
    gallery: [],
  },
  {
    slug: "word-and-prayer",
    title: "Word & Prayer",
    description:
      "Our midweek gathering to go deeper in Scripture and stand together in prayer for our families and community.",
    coverImage: "/images/img3.jpg",
    // Placeholder: replace with a fuller description of the ministry.
    fullDescription:
      "Word & Prayer is our midweek gathering to go deeper in Scripture and stand together in prayer for our families and community.",
    gallery: [],
  },
  {
    slug: "community-outreach",
    title: "Community Outreach",
    description:
      "Sharing the love of Christ in Toitskraal and beyond through children's events, care drives and practical help.",
    coverImage: "/images/videos-hero.jpg",
    // Placeholder: replace with a fuller description of the ministry.
    fullDescription:
      "Community Outreach shares the love of Christ in Toitskraal and beyond through children's events, care drives and practical help.",
    gallery: [],
  },
];

export function getMinistry(slug: string): Ministry | undefined {
  return ministries.find((m) => m.slug === slug);
}
