"use client";
import { useMemo, useState } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTextHistory } from "@/hooks/use-text-history";
import { extractEmails, extractUrls, extractHashtags, extractNumbers } from "@/lib/tools/extraction";

type Mode = "emails" | "urls" | "hashtags" | "numbers";

export function TextExtractorWorkspace() {
  const history = useTextHistory("");
  const [mode, setMode] = useState<Mode>("emails");

  const extracted = useMemo(() => {
    switch (mode) {
      case "emails":
        return extractEmails(history.value);
      case "urls":
        return extractUrls(history.value);
      case "hashtags":
        return extractHashtags(history.value);
      case "numbers":
        return extractNumbers(history.value);
    }
  }, [history.value, mode]);

  const resultText = extracted.join("\n");

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="text-extractor"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      <Tabs value={mode} onValueChange={(v) => setMode(v as Mode)}>
        <TabsList>
          <TabsTrigger value="emails">Emails</TabsTrigger>
          <TabsTrigger value="urls">URLs</TabsTrigger>
          <TabsTrigger value="hashtags">Hashtags</TabsTrigger>
          <TabsTrigger value="numbers">Numbers</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          {extracted.length} found
        </h2>
        <CopyExportBar text={resultText} filenameBase={`extracted-${mode}`} />
      </div>
      <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words min-h-24">
        {extracted.length > 0 ? resultText : <span className="text-muted-foreground">Nothing found yet.</span>}
      </div>
    </div>
  );
}
