import type { MetadataRoute } from "next";
import { navLinks, site } from "@/lib/site";

// Every public page is in the main nav, so the sitemap follows it.
export default function sitemap(): MetadataRoute.Sitemap {
  const changeFrequency: Record<string, MetadataRoute.Sitemap[number]["changeFrequency"]> = {
    "/": "weekly",
    "/events": "weekly",
    "/calendar": "weekly",
    "/gallery": "weekly",
  };

  return navLinks.map((link) => ({
    url: link.href === "/" ? site.url : `${site.url}${link.href}`,
    changeFrequency: changeFrequency[link.href] ?? "monthly",
    priority: link.href === "/" ? 1 : 0.7,
  }));
}
