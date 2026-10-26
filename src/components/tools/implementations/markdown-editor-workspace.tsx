"use client";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { useTextHistory } from "@/hooks/use-text-history";
import { renderMarkdownSafe } from "@/lib/tools/markdown";

export function MarkdownEditorWorkspace() {
  const history = useTextHistory("");
  const [html, setHtml] = useState("");

  useEffect(() => {
    let cancelled = false;
    void renderMarkdownSafe(history.value).then((rendered) => {
      if (!cancelled) setHtml(rendered);
    });
    return () => {
      cancelled = true;
    };
  }, [history.value]);

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="markdown-editor"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
        placeholder="# Heading&#10;&#10;Write **Markdown** here…"
      />

      <div className="flex items-center justify-between">
        <Label>Preview (sanitized)</Label>
        <CopyExportBar text={history.value} filenameBase="markdown" />
      </div>
      <div
        className="prose-tool break-words rounded-md border border-border bg-card p-4 text-sm min-h-24"
        dangerouslySetInnerHTML={{ __html: html || "<p class=\"text-muted-foreground\">Nothing to preview yet.</p>" }}
      />
    </div>
  );
}
