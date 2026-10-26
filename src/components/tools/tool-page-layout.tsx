import { ToolMeta } from "@/lib/registry/tools";
import { ToolIcon } from "@/components/tools/tool-icon";
import { Badge } from "@/components/ui/badge";
import { getCategory } from "@/lib/registry/categories";
import Link from "next/link";

export function ToolPageLayout({
  tool,
  children,
  instructions,
}: {
  tool: ToolMeta;
  children: React.ReactNode;
  instructions: React.ReactNode;
}) {
  const category = getCategory(tool.category);
  return (
    <div className="container-page py-8 sm:py-10">
      <nav className="mb-4 text-sm text-muted-foreground" aria-label="Breadcrumb">
        <Link href="/tools" className="hover:text-foreground">
          Tools
        </Link>
        {category && (
          <>
            {" / "}
            <Link href={`/categories/${category.id}`} className="hover:text-foreground">
              {category.title}
            </Link>
          </>
        )}
      </nav>

      <div className="tool-heading mb-2 flex flex-wrap items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-accent text-accent-foreground">
            <ToolIcon name={tool.icon} className="h-5 w-5" />
          </span>
          <div>
            <h1 className="text-3xl font-semibold sm:text-4xl">{tool.title}</h1>
            <p className="mt-1 max-w-2xl text-muted-foreground">{tool.shortDescription}</p>
          </div>
        </div>
        <div className="flex gap-2">
          {tool.kind === "ai" ? <Badge>Uses AI</Badge> : <Badge variant="outline">Runs instantly - no AI</Badge>}
          {tool.experimental && <Badge variant="warning">Experimental</Badge>}
        </div>
      </div>

      <div className="workspace-shell">{children}</div>

      <div className="prose-tool mt-12 max-w-3xl border-t border-border pt-8">{instructions}</div>
    </div>
  );
}
