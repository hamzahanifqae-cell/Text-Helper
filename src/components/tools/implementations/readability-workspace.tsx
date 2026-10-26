"use client";
import { useMemo } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { StatsGrid } from "@/components/tools/stats-grid";
import { useTextHistory } from "@/hooks/use-text-history";
import { computeReadability, fleschEaseLabel, longSentences, difficultWordSuggestions } from "@/lib/tools/readability";

export function ReadabilityWorkspace() {
  const history = useTextHistory("");
  const scores = useMemo(() => computeReadability(history.value), [history.value]);
  const long = useMemo(() => longSentences(history.value), [history.value]);
  const difficult = useMemo(() => difficultWordSuggestions(history.value), [history.value]);
  const hasText = history.value.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="readability-checker"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      {hasText && (
        <>
          <div>
            <h2 className="mb-2 text-sm font-semibold">Scores</h2>
            <StatsGrid
              stats={[
                { label: `Flesch Reading Ease (${fleschEaseLabel(scores.fleschReadingEase)})`, value: scores.fleschReadingEase },
                { label: "Flesch-Kincaid Grade Level", value: scores.fleschKincaidGrade },
                { label: "Gunning Fog Index", value: scores.gunningFog },
                { label: "Avg. word length", value: `${scores.averageWordLength} chars` },
                { label: "Avg. sentence length", value: `${scores.averageSentenceLength} words` },
                { label: "Complex words", value: `${scores.complexWordRatio}%` },
              ]}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Flesch Reading Ease: 206.835 - 1.015 x (words/sentence) - 84.6 x (syllables/word), higher is
              easier to read. Flesch-Kincaid Grade Level estimates a US school grade level. Gunning Fog
              estimates years of education needed. All three rely on an approximate syllable counter and are
              English-language heuristics - treat them as directional, not exact, and expect less accuracy on
              technical vocabulary, non-English text, or very short passages.
            </p>
          </div>

          {long.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold">Long sentences ({long.length})</h2>
              <ul className="flex flex-col gap-2">
                {long.slice(0, 10).map((s, i) => (
                  <li key={i} className="rounded-md border border-border bg-card p-2.5 text-sm">
                    <span className="text-xs text-muted-foreground">{s.wordCount} words - </span>
                    {s.text}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {difficult.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold">Possible simpler alternatives</h2>
              <ul className="flex flex-wrap gap-2">
                {difficult.map((d, i) => (
                  <li key={i} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                    <span className="text-destructive">{d.word}</span> &rarr; {d.alternatives.join(" / ")}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </>
      )}
    </div>
  );
}
