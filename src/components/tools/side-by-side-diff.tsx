"use client";
import { compareWords } from "@/lib/tools/compare";

export function SideBySideDiff({ original, result }: { original: string; result: string }) {
  const segments = compareWords(original, result);
  return (
    <div className="grid gap-4 sm:grid-cols-2">
      <div>
        <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Original</h3>
        <div className="rounded-md border border-border bg-muted/40 p-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {original || <span className="text-muted-foreground">Nothing yet.</span>}
        </div>
      </div>
      <div>
        <h3 className="mb-1.5 text-xs font-semibold uppercase tracking-wide text-muted-foreground">Result</h3>
        <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
          {result
            ? segments.map((seg, i) =>
                seg.removed ? null : (
                  <span key={i} className={seg.added ? "bg-success/20 text-success" : undefined}>
                    {seg.value}
                  </span>
                )
              )
            : <span className="text-muted-foreground">Nothing yet.</span>}
        </div>
      </div>
    </div>
  );
}
