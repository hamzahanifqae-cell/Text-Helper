import type { MetadataRoute } from "next";
import { TOOLS } from "@/lib/registry/tools";
import { CATEGORIES } from "@/lib/registry/categories";
import { siteConfig } from "@/lib/config/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteConfig.url;
  const staticPages = ["", "/tools", "/about", "/contact", "/privacy", "/terms"].map((path) => ({
    url: `${base}${path}`,
    changeFrequency: "monthly" as const,
    priority: path === "" ? 1 : 0.6,
  }));
  const categoryPages = CATEGORIES.map((c) => ({
    url: `${base}/categories/${c.id}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));
  const toolPages = TOOLS.map((t) => ({
    url: `${base}/tools/${t.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));
  return [...staticPages, ...categoryPages, ...toolPages];
}
