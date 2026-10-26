import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/registry/categories";
import { getToolsByCategory } from "@/lib/registry/tools";
import { ToolCard } from "@/components/tools/tool-card";
import { AdSlot } from "@/components/ads/ad-slot";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.id }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) return {};
  return {
    title: category.title,
    description: category.description,
    alternates: { canonical: `/categories/${category.id}` },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) notFound();
  const tools = getToolsByCategory(category.id);

  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="section-heading">{category.title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{category.description}</p>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      <AdSlot slot="category-bottom" className="mt-10" />
    </div>
  );
}
