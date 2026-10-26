"use client";
import { useMemo } from "react";
import { Sparkles, ShieldAlert } from "lucide-react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { StatsGrid } from "@/components/tools/stats-grid";
import { AIDisclosureNote, AIUnavailableBanner } from "@/components/tools/ai-status-banner";
import { Button } from "@/components/ui/button";
import { useTextHistory } from "@/hooks/use-text-history";
import { useAITask } from "@/hooks/use-ai-task";
import { useAIStatus } from "@/hooks/use-ai-status";
import { analyzeWritingPatterns } from "@/lib/tools/writingPatterns";

interface CommentaryResult {
  commentary: string;
  scrubbed: boolean;
}

export function AiPatternAnalysisWorkspace() {
  const history = useTextHistory("");
  const aiStatus = useAIStatus();
  const aiTask = useAITask<CommentaryResult>("ai-pattern-commentary");

  const report = useMemo(() => analyzeWritingPatterns(history.value), [history.value]);
  const hasText = history.value.trim().length > 0;

  function onGetCommentary() {
    void aiTask.run(history.value, { metrics: report });
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2.5 text-sm text-warning">
        <ShieldAlert className="mt-0.5 h-4 w-4 shrink-0" />
        <span>
          Experimental. This tool reports writing-style signals, not a calibrated probability that text is
          AI-generated or human-written. No suitably licensed, independently-evaluated AI-authorship detector
          was available within this project&apos;s hosting constraints, so this tool deliberately does not
          produce an authorship percentage or verdict. Do not use it as proof of authorship.
        </span>
      </div>

      <TextInputPanel
        toolSlug="ai-writing-pattern-analysis"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      {hasText && (
        <div>
          <h2 className="mb-2 text-sm font-semibold">Writing-style signals (computed instantly, no AI)</h2>
          <StatsGrid
            stats={[
              { label: "Sentences", value: report.sentenceCount },
              { label: "Avg. sentence length", value: `${report.averageSentenceLength} words` },
              { label: "Sentence-length variation", value: report.sentenceLengthStdDev },
              { label: "Burstiness", value: report.burstiness },
              { label: "Vocabulary variety", value: `${report.vocabularyTypeTokenRatio}%` },
              { label: "Transition-word density", value: `${report.transitionWordDensityPer100Words}/100w` },
              { label: "Longest sentence", value: `${report.longestSentenceWords}w` },
              { label: "Shortest sentence", value: `${report.shortestSentenceWords}w` },
            ]}
          />
          {report.repeatedSentenceStarters.length > 0 && (
            <p className="mt-3 text-sm text-muted-foreground">
              Repeated sentence openings:{" "}
              {report.repeatedSentenceStarters.map((r) => `"${r.starter}" (x${r.count})`).join(", ")}
            </p>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            &quot;Burstiness&quot; is the ratio of sentence-length variation to average sentence length - very
            uniform sentence lengths are <em>one</em> weak stylistic signal sometimes associated with
            machine-generated text, but plenty of human writing is also uniform, and plenty of AI writing
            varies a lot. Treat all of these as descriptive, not diagnostic.
          </p>
        </div>
      )}

      <div className="border-t border-border pt-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> Optional AI commentary
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Ask an AI model to explain the signals above in plain language. It is explicitly instructed never
          to state or imply an AI-generated percentage or authorship verdict - and if it ever did, we strip
          it out automatically before showing you anything.
        </p>
        {aiStatus && !aiStatus.configured && <AIUnavailableBanner />}
        {aiStatus && aiStatus.configured && !aiStatus.quotaAvailable && <AIUnavailableBanner quotaOnly />}
        <AIDisclosureNote />
        <div className="mt-3">
          {aiTask.status === "processing" ? (
            <Button variant="secondary" onClick={aiTask.cancel}>
              Cancel
            </Button>
          ) : (
            <Button variant="outline" disabled={!hasText || Boolean(aiStatus && !aiStatus.configured)} onClick={onGetCommentary}>
              Get AI commentary
            </Button>
          )}
        </div>
        {aiTask.status === "error" && aiTask.error && (
          <p className="mt-2 text-sm text-destructive">{aiTask.error.message}</p>
        )}
        {aiTask.status === "success" && aiTask.result && (
          <div className="mt-3 rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {aiTask.result.commentary}
            {aiTask.result.scrubbed && (
              <p className="mt-2 text-xs text-warning">
                Note: the AI attempted to state an authorship percentage, which we removed - that output
                would have been fabricated, not a real detection result.
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
