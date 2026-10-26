"use client";
import { useMemo, useState } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTextHistory } from "@/hooks/use-text-history";
import { escapeHtml, unescapeHtml } from "@/lib/tools/formatting";

export function HtmlEscapeWorkspace() {
  const history = useTextHistory("");
  const [mode, setMode] = useState<"escape" | "unescape">("escape");

  const output = useMemo(
    () => (mode === "escape" ? escapeHtml(history.value) : unescapeHtml(history.value)),
    [history.value, mode]
  );

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "escape" | "unescape")}>
        <TabsList>
          <TabsTrigger value="escape">Escape</TabsTrigger>
          <TabsTrigger value="unescape">Unescape</TabsTrigger>
        </TabsList>
      </Tabs>

      <TextInputPanel
        toolSlug="html-escape-tool"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Result</h2>
        <CopyExportBar text={output} filenameBase="html-escape" />
      </div>
      <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words font-mono min-h-20">
        {output || <span className="text-muted-foreground font-sans">Nothing yet.</span>}
      </div>
    </div>
  );
}
