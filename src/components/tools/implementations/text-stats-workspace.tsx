"use client";
import { useMemo, useState } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { StatsGrid } from "@/components/tools/stats-grid";
import { computeTextStats, formatDuration } from "@/lib/tools/counters";
import { useTextHistory } from "@/hooks/use-text-history";

export function TextStatsWorkspace({ toolSlug, emphasis }: { toolSlug: string; emphasis: "words" | "characters" | "time" }) {
  const history = useTextHistory("");
  const [selection, setSelection] = useState("");

  const stats = useMemo(() => computeTextStats(history.value), [history.value]);
  const selectionStats = useMemo(() => (selection ? computeTextStats(selection) : null), [selection]);

  const primaryStats =
    emphasis === "characters"
      ? [
          { label: "Characters (with spaces)", value: stats.charactersWithSpaces.toLocaleString() },
          { label: "Characters (no spaces)", value: stats.charactersWithoutSpaces.toLocaleString() },
          { label: "Words", value: stats.words.toLocaleString() },
          { label: "Sentences", value: stats.sentences.toLocaleString() },
        ]
      : emphasis === "time"
      ? [
          { label: "Reading time", value: formatDuration(stats.readingTimeSeconds) },
          { label: "Speaking time", value: formatDuration(stats.speakingTimeSeconds) },
          { label: "Words", value: stats.words.toLocaleString() },
          { label: "Sentences", value: stats.sentences.toLocaleString() },
        ]
      : [
          { label: "Words", value: stats.words.toLocaleString() },
          { label: "Characters (with spaces)", value: stats.charactersWithSpaces.toLocaleString() },
          { label: "Characters (no spaces)", value: stats.charactersWithoutSpaces.toLocaleString() },
          { label: "Sentences", value: stats.sentences.toLocaleString() },
        ];

  const secondaryStats = [
    { label: "Paragraphs", value: stats.paragraphs.toLocaleString() },
    { label: "Lines", value: stats.lines.toLocaleString() },
    { label: "Reading time", value: formatDuration(stats.readingTimeSeconds) },
    { label: "Speaking time", value: formatDuration(stats.speakingTimeSeconds) },
  ];

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug={toolSlug}
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
        onSelectionChange={setSelection}
      />
      <div>
        <StatsGrid stats={primaryStats} />
        <div className="mt-3">
          <StatsGrid stats={secondaryStats} />
        </div>
      </div>

      {selectionStats && (
        <div>
          <h2 className="mb-2 text-sm font-semibold">Selected text</h2>
          <StatsGrid
            stats={[
              { label: "Words", value: selectionStats.words.toLocaleString() },
              { label: "Characters", value: selectionStats.charactersWithSpaces.toLocaleString() },
              { label: "Sentences", value: selectionStats.sentences.toLocaleString() },
            ]}
          />
        </div>
      )}
    </div>
  );
}
