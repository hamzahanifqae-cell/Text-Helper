"use client";
import { useMemo, useState } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTextHistory } from "@/hooks/use-text-history";
import { urlEncode, urlDecode } from "@/lib/tools/formatting";

export function UrlEncodeWorkspace() {
  const history = useTextHistory("");
  const [mode, setMode] = useState<"encode" | "decode">("encode");

  const output = useMemo(
    () => (mode === "encode" ? urlEncode(history.value) : urlDecode(history.value)),
    [history.value, mode]
  );

  return (
    <div className="flex flex-col gap-6">
      <Tabs value={mode} onValueChange={(v) => setMode(v as "encode" | "decode")}>
        <TabsList>
          <TabsTrigger value="encode">Encode</TabsTrigger>
          <TabsTrigger value="decode">Decode</TabsTrigger>
        </TabsList>
      </Tabs>

      <TextInputPanel
        toolSlug="url-encoder-decoder"
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
        <CopyExportBar text={output.value} filenameBase="url-encode" />
      </div>
      {!output.ok && <p className="text-sm text-destructive">{output.error}</p>}
      <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words font-mono min-h-20">
        {output.value || <span className="text-muted-foreground font-sans">Nothing yet.</span>}
      </div>
    </div>
  );
}
