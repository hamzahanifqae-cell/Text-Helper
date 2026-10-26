import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ToolMeta } from "@/lib/registry/tools";
import { ToolIcon } from "@/components/tools/tool-icon";
import { categoryColor } from "@/lib/registry/tool-colors";
import { cn } from "@/lib/utils/cn";

export function ToolCard({ tool, className }: { tool: ToolMeta; className?: string }) {
  return (
    <Link href={`/tools/${tool.slug}`} data-color={categoryColor(tool.category)}
      className={cn("tool-card group flex flex-col gap-5 focus-visible:ring-2 focus-visible:ring-ring", className)}>
      <div className="flex items-center justify-between gap-2">
        <span className="tool-card-icon"><ToolIcon name={tool.icon} className="h-5 w-5" /></span>
        <span className="rounded-full border border-border px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">{tool.kind === "ai" ? "AI" : "Instant"}</span>
      </div>
      <div className="flex-1">
        <h3 className="group-hover:text-primary">{tool.title}</h3>
        <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{tool.shortDescription}</p>
      </div>
      <div className="flex items-center justify-between border-t border-border pt-3 text-xs font-medium text-muted-foreground">
        <span>{tool.experimental ? "Experimental" : "Open tool"}</span>
        <ArrowUpRight aria-hidden="true" className="h-4 w-4 text-primary transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </div>
    </Link>
  );
}
