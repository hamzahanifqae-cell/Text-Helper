import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/registry/tools";
import { CATEGORIES } from "@/lib/registry/categories";
import { siteConfig } from "@/lib/config/site";
import { CONTENT_UPDATED, PAGE_UPDATED_9_NOV, TOOL_CONTENT_UPDATED } from "@/lib/seo/content-updated";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const policyPages = ["/about", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    lastModified: PAGE_UPDATED_9_NOV,
    changeFrequency: "yearly" as const,
    priority: 0.4,
  }));
  const updatedHubs = ["", "/tools"].map((path) => ({
    url: `${base}${path}`,
    lastModified: CONTENT_UPDATED,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
  const categoryPages = CATEGORIES.map((c) => ({
    url: `${base}/categories/${c.id}`,
    lastModified: PAGE_UPDATED_9_NOV,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const toolPages = TOOLS.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    lastModified: TOOL_CONTENT_UPDATED[t.slug] ?? CONTENT_UPDATED,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...updatedHubs, ...policyPages, ...categoryPages, ...toolPages];
}
