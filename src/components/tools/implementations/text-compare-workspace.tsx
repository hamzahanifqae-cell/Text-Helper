"use client";
import { useMemo, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatsGrid } from "@/components/tools/stats-grid";
import { compareWords, compareLines, diffStats } from "@/lib/tools/compare";

export function TextCompareWorkspace() {
  const [original, setOriginal] = useState("");
  const [revised, setRevised] = useState("");
  const [mode, setMode] = useState<"word" | "line">("word");

  const segments = useMemo(
    () => (mode === "word" ? compareWords(original, revised) : compareLines(original, revised)),
    [original, revised, mode]
  );
  const stats = useMemo(() => diffStats(segments), [segments]);

  return (
    <div className="flex flex-col gap-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="original-text">Original</Label>
          <Textarea id="original-text" value={original} onChange={(e) => setOriginal(e.target.value)} rows={10} className="font-mono text-[13px]" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="revised-text">Revised</Label>
          <Textarea id="revised-text" value={revised} onChange={(e) => setRevised(e.target.value)} rows={10} className="font-mono text-[13px]" />
        </div>
      </div>

      <Tabs value={mode} onValueChange={(v) => setMode(v as "word" | "line")}>
        <TabsList>
          <TabsTrigger value="word">Word-level</TabsTrigger>
          <TabsTrigger value="line">Line-level</TabsTrigger>
        </TabsList>
      </Tabs>

      {(original || revised) && (
        <>
          <StatsGrid
            stats={[
              { label: "Additions", value: stats.additions },
              { label: "Deletions", value: stats.deletions },
              { label: "Unchanged", value: stats.unchanged },
            ]}
          />
          <div>
            <h2 className="mb-2 text-sm font-semibold">Comparison</h2>
            <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {segments.map((seg, i) => (
                <span
                  key={i}
                  className={
                    seg.added
                      ? "bg-success/20 text-success"
                      : seg.removed
                      ? "bg-destructive/15 text-destructive line-through"
                      : undefined
                  }
                >
                  {seg.value}
                </span>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
