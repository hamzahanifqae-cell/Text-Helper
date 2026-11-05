import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // /api/* is not a page, but robots.txt is not a reliable way to keep a
        // URL out of search. Those routes send X-Robots-Tag: noindex instead,
        // which Google can see only if it is allowed to fetch them.
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
