"use client";
import { useState } from "react";
import { AlertTriangle, ShieldAlert } from "lucide-react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { ProtectedPhrasesInput } from "@/components/tools/protected-phrases-input";
import { GenerateControls } from "@/components/tools/generate-controls";
import { AIDisclosureNote, AIUnavailableBanner } from "@/components/tools/ai-status-banner";
import { SideBySideDiff } from "@/components/tools/side-by-side-diff";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { useTextHistory } from "@/hooks/use-text-history";
import { useAITask } from "@/hooks/use-ai-task";
import { useAIStatus } from "@/hooks/use-ai-status";
import { getMaxInputCharsClientHint } from "@/lib/ai/clientHint";

interface TextResult {
  text: string;
}

export function AIRewriteWorkspace({
  toolSlug,
  taskId,
  settings,
  buildOptions = (protectedPhrases) => ({ protectedPhrases }),
  generateLabel = "Generate",
  showProtectedPhrases = true,
  showDiff = true,
}: {
  toolSlug: string;
  taskId: string;
  settings?: React.ReactNode;
  buildOptions?: (protectedPhrases: string[]) => Record<string, unknown>;
  generateLabel?: string;
  showProtectedPhrases?: boolean;
  showDiff?: boolean;
}) {
  const history = useTextHistory("");
  const [protectedPhrases, setProtectedPhrases] = useState<string[]>([]);
  const aiStatus = useAIStatus();
  const { status, result, error, protectedPhraseCheck, run, cancel, regenerate } = useAITask<TextResult>(taskId);

  const maxChars = getMaxInputCharsClientHint();
  const tooLong = history.value.length > maxChars;

  function onGenerate() {
    if (!history.value.trim() || tooLong) return;
    void run(history.value, buildOptions(protectedPhrases));
  }

  const unpreserved = protectedPhraseCheck?.filter((p) => !p.preserved) ?? [];

  return (
    <div className="flex flex-col gap-6">
      {aiStatus && !aiStatus.configured && <AIUnavailableBanner />}
      {aiStatus && aiStatus.configured && !aiStatus.quotaAvailable && <AIUnavailableBanner quotaOnly />}

      <TextInputPanel
        toolSlug={toolSlug}
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>
          {history.value.length.toLocaleString()} / {maxChars.toLocaleString()} characters
        </span>
        {tooLong && <span className="text-destructive">Text is too long for the AI tool - shorten it to continue.</span>}
      </div>

      {settings}
      {showProtectedPhrases && (
        <ProtectedPhrasesInput phrases={protectedPhrases} onChange={setProtectedPhrases} />
      )}

      <AIDisclosureNote />

      <GenerateControls
        status={status}
        error={error}
        disabled={!history.value.trim() || tooLong || Boolean(aiStatus && !aiStatus.configured)}
        onGenerate={onGenerate}
        onCancel={cancel}
        onRegenerate={regenerate}
        label={generateLabel}
      />

      {unpreserved.length > 0 && (
        <p className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2 text-sm text-warning">
          <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
          Could not confirm these protected phrases survived unchanged: {unpreserved.map((p) => `"${p.phrase}"`).join(", ")}.
          Please review the result.
        </p>
      )}

      {result && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold">Result</h2>
            <CopyExportBar text={result.text} filenameBase={toolSlug} />
          </div>
          {showDiff ? (
            <SideBySideDiff original={history.value} result={result.text} />
          ) : (
            <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
              {result.text}
            </div>
          )}
          <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            AI-generated - review before relying on it.{showDiff ? " Highlighted text is new or changed wording." : ""}
          </p>
        </div>
      )}
    </div>
  );
}
