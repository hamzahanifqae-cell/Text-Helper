import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CATEGORIES, getCategory } from "@/lib/registry/categories";
import { getTool, getToolsByCategory } from "@/lib/registry/tools";
import { ToolCard } from "@/components/tools/tool-card";
import { AdSlot } from "@/components/ads/ad-slot";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata } from "@/lib/seo/metadata";
import { categorySchema } from "@/lib/seo/schema";

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
  return pageMetadata({
    title: `Browse ${category.title}`,
    description: category.description,
    path: `/categories/${category.id}`,
  });
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: categoryId } = await params;
  const category = getCategory(categoryId);
  if (!category) notFound();
  const tools = getToolsByCategory(category.id);

  return (
    <div className="container-page py-10 sm:py-14">
      <JsonLd data={categorySchema(category, tools)} />
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/" className="hover:text-foreground">Home</Link>
        {" / "}
        <Link href="/tools" className="hover:text-foreground">Tools</Link>
        {" / "}
        <span aria-current="page">{category.title}</span>
      </nav>
      <h1 className="section-heading">{category.title}</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">{category.audience}</p>
      <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{category.choose}</p>
      {getTool(category.startSlug) ? (
        <p className="mt-3 text-sm">
          <Link href={`/tools/${category.startSlug}`} className="font-medium text-primary hover:underline">
            Start with {getTool(category.startSlug)?.title}
          </Link>
        </p>
      ) : null}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {tools.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
      <AdSlot slot="category-bottom" className="mt-10" />
    </div>
  );
}
