import { siteConfig } from "@/lib/config/site";
import type { Category } from "@/lib/registry/categories";
import type { ToolMeta } from "@/lib/registry/tools";

export function absoluteUrl(path: string): string {
  return new URL(path, siteConfig.url).toString();
}

export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

export function toolSchema(tool: ToolMeta, category: Category | undefined) {
  const url = absoluteUrl(`/tools/${tool.slug}`);
  const crumbs = [
    { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
    { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/tools") },
    ...(category
      ? [
          {
            "@type": "ListItem",
            position: 3,
            name: category.title,
            item: absoluteUrl(`/categories/${category.id}`),
          },
        ]
      : []),
    {
      "@type": "ListItem",
      position: category ? 4 : 3,
      name: tool.title,
      item: url,
    },
  ];

  return {
    "@context": "https://schema.org",
    "@graph": [
      { "@type": "BreadcrumbList", itemListElement: crumbs },
      {
        "@type": "WebApplication",
        name: tool.title,
        url,
        description: tool.shortDescription,
        applicationCategory: "BrowserApplication",
        operatingSystem: "Any",
        offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
      },
    ],
  };
}

export function categorySchema(category: Category, tools: ToolMeta[]) {
  const url = absoluteUrl(`/categories/${category.id}`);
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: absoluteUrl("/") },
          { "@type": "ListItem", position: 2, name: "Tools", item: absoluteUrl("/tools") },
          { "@type": "ListItem", position: 3, name: category.title, item: url },
        ],
      },
      {
        "@type": "CollectionPage",
        name: category.title,
        description: category.description,
        url,
        isPartOf: { "@type": "WebSite", name: siteConfig.name, url: siteConfig.url },
        mainEntity: {
          "@type": "ItemList",
          numberOfItems: tools.length,
          itemListElement: tools.map((tool, index) => ({
            "@type": "ListItem",
            position: index + 1,
            name: tool.title,
            url: absoluteUrl(`/tools/${tool.slug}`),
          })),
        },
      },
    ],
  };
}
