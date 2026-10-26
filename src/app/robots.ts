import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/config/site";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        // No private/user-result routes exist on this site to disallow -
        // tool results are rendered client-side and never persisted at a
        // public URL (see PRIVACY.md / Privacy page).
      },
    ],
    sitemap: `${siteConfig.url}/sitemap.xml`,
  };
}
