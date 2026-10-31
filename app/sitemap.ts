import type { MetadataRoute } from "next";
import { ministries } from "@/lib/ministries";
import { navLinks, site } from "@/lib/site";

// Every page in the main nav, plus the ministry detail pages.
export default function sitemap(): MetadataRoute.Sitemap {
  const changeFrequency: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
    "/": "weekly",
    "/events": "weekly",
    "/calendar": "weekly",
    "/gallery": "weekly",
  };

  const navPages: MetadataRoute.Sitemap = navLinks.map((link) => ({
    url: link.href === "/" ? site.url : `${site.url}${link.href}`,
    changeFrequency: changeFrequency[link.href] ?? "monthly",
    priority: link.href === "/" ? 1 : 0.7,
  }));

  // Ministry detail pages aren't in the nav; they're linked from the home page.
  const ministryPages: MetadataRoute.Sitemap = ministries.map((m) => ({
    url: `${site.url}/ministries/${m.slug}`,
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [...navPages, ...ministryPages];
}
