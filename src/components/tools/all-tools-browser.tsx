"use client";
import { useMemo, useState } from "react";
import { TOOLS } from "@/lib/registry/tools";
import { CATEGORIES } from "@/lib/registry/categories";
import { ToolCard } from "@/components/tools/tool-card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export function AllToolsBrowser() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return TOOLS.filter((tool) => {
      if (category && tool.category !== category) return false;
      if (!q) return true;
      const haystack = [tool.title, tool.shortDescription, ...(tool.keywords ?? [])].join(" ").toLowerCase();
      return haystack.includes(q);
    });
  }, [query, category]);

  return (
    <div>
      <div className="directory-filters flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Filter tools…"
          className="sm:max-w-sm"
          aria-label="Filter tools"
        />
      </div>

      <div className="mt-4 flex flex-wrap gap-2" role="group" aria-label="Filter by category">
        <button
          aria-pressed={category === null}
          onClick={() => setCategory(null)}
          className={cn(
            "filter-chip rounded-full border px-3.5 py-1.5 text-xs font-medium",
            category === null ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground"
          )}
        >
          All
        </button>
        {CATEGORIES.map((c) => (
          <button
            key={c.id}
            aria-pressed={category === c.id}
            onClick={() => setCategory(c.id)}
            className={cn(
              "filter-chip rounded-full border px-3.5 py-1.5 text-xs font-medium",
              category === c.id ? "border-primary bg-accent text-accent-foreground" : "border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {c.title}
          </button>
        ))}
      </div>

      <p className="mt-4 text-sm text-muted-foreground">
        {filtered.length} tool{filtered.length === 1 ? "" : "s"}
      </p>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="mt-10 text-center text-sm text-muted-foreground">No tools match that search.</p>
      )}
    </div>
  );
}
