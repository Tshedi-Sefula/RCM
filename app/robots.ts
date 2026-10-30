import type { MetadataRoute } from "next";
import { site } from "@/lib/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The admin pages also send noindex; this keeps crawlers off them entirely.
      disallow: "/admin",
    },
    sitemap: `${site.url}/sitemap.xml`,
  };
}
