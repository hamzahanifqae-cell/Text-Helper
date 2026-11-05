import Link from "next/link";
import { getRelatedTools } from "@/lib/seo/related-tools";

export function RelatedTools({ slug }: { slug: string }) {
  const related = getRelatedTools(slug);
  if (related.length === 0) return null;

  return (
    <section className="mt-10 max-w-3xl border-t border-border pt-8" aria-labelledby="related-tools-heading">
      <h2 id="related-tools-heading" className="text-xl font-semibold">
        Related tools
      </h2>
      <ul className="mt-4 flex flex-col gap-3">
        {related.map((tool) => (
          <li key={tool.slug}>
            <Link href={`/tools/${tool.slug}`} className="font-medium text-primary hover:underline">
              {tool.title}
            </Link>
            <p className="text-sm text-muted-foreground">{tool.shortDescription}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
