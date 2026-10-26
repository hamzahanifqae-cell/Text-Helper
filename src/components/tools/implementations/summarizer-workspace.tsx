"use client";
import { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { GenerateControls } from "@/components/tools/generate-controls";
import { AIDisclosureNote, AIUnavailableBanner } from "@/components/tools/ai-status-banner";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useTextHistory } from "@/hooks/use-text-history";
import { useAITask } from "@/hooks/use-ai-task";
import { useAIStatus } from "@/hooks/use-ai-status";
import { getMaxInputCharsClientHint } from "@/lib/ai/clientHint";

type Format = "paragraph" | "bullets" | "keyPoints";
type Length = "short" | "medium" | "long";

export function SummarizerWorkspace() {
  const history = useTextHistory("");
  const [format, setFormat] = useState<Format>("paragraph");
  const [length, setLength] = useState<Length>("medium");
  const aiStatus = useAIStatus();
  const { status, result, error, run, cancel, regenerate } = useAITask<{ text: string }>("summarize");

  const maxChars = getMaxInputCharsClientHint();
  const tooLong = history.value.length > maxChars;

  function onGenerate() {
    if (!history.value.trim() || tooLong) return;
    void run(history.value, { format, length });
  }

  return (
    <div className="flex flex-col gap-6">
      {aiStatus && !aiStatus.configured && <AIUnavailableBanner />}
      {aiStatus && aiStatus.configured && !aiStatus.quotaAvailable && <AIUnavailableBanner quotaOnly />}

      <TextInputPanel
        toolSlug="text-summarizer"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
        placeholder="Paste the text you want summarized…"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {history.value.length.toLocaleString()} / {maxChars.toLocaleString()} characters
        </span>
        {tooLong && <span className="text-destructive">Text is too long for the AI tool - shorten it to continue.</span>}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="summary-format">Format</Label>
          <Select value={format} onValueChange={(v) => setFormat(v as Format)}>
            <SelectTrigger id="summary-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="paragraph">Paragraph</SelectItem>
              <SelectItem value="bullets">Bullet list</SelectItem>
              <SelectItem value="keyPoints">Key points only</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="summary-length">Length</Label>
          <Select value={length} onValueChange={(v) => setLength(v as Length)}>
            <SelectTrigger id="summary-length">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Short</SelectItem>
              <SelectItem value="medium">Medium</SelectItem>
              <SelectItem value="long">Long</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <AIDisclosureNote />

      <GenerateControls
        status={status}
        error={error}
        disabled={!history.value.trim() || tooLong || Boolean(aiStatus && !aiStatus.configured)}
        onGenerate={onGenerate}
        onCancel={cancel}
        onRegenerate={regenerate}
        label="Summarize"
      />

      {result && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Summary</h2>
            <CopyExportBar text={result.text} filenameBase="text-summarizer" />
          </div>
          <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {result.text}
          </div>
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            AI-generated from the text you provided - review before relying on it. This tool summarizes only what&apos;s in your source text and should not add outside facts.
          </p>
        </div>
      )}
    </div>
  );
}
