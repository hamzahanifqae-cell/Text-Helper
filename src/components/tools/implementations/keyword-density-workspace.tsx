"use client";
import { useMemo, useState } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { StatsGrid } from "@/components/tools/stats-grid";
import { useTextHistory } from "@/hooks/use-text-history";
import { wordFrequency, repeatedPhrases, vocabularyVariety, keywordStats } from "@/lib/tools/keywordAnalysis";

export function KeywordDensityWorkspace() {
  const history = useTextHistory("");
  const [excludeStopwords, setExcludeStopwords] = useState(true);
  const [keyword, setKeyword] = useState("");

  const frequency = useMemo(() => wordFrequency(history.value, excludeStopwords, 20), [history.value, excludeStopwords]);
  const phrases = useMemo(() => repeatedPhrases(history.value), [history.value]);
  const variety = useMemo(() => vocabularyVariety(history.value), [history.value]);
  const keywordResult = useMemo(() => keywordStats(history.value, keyword), [history.value, keyword]);
  const hasText = history.value.trim().length > 0;

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="keyword-density-analyzer"
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
          <StatsGrid
            stats={[
              { label: "Unique words", value: variety.uniqueWords },
              { label: "Total words", value: variety.totalWords },
              { label: "Vocabulary variety", value: `${variety.typeTokenRatio}%` },
            ]}
          />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="keyword-input">Check a specific keyword or phrase</Label>
              <label className="flex items-center gap-2 text-xs text-muted-foreground">
                <Switch checked={excludeStopwords} onCheckedChange={setExcludeStopwords} /> Exclude common words
              </label>
            </div>
            <Input id="keyword-input" value={keyword} onChange={(e) => setKeyword(e.target.value)} placeholder="e.g. your target keyword" className="max-w-sm" />
            {keyword && (
              <p className="text-sm text-muted-foreground">
                &quot;{keyword}&quot; appears {keywordResult.occurrences} time{keywordResult.occurrences === 1 ? "" : "s"} ({keywordResult.density}% density).
              </p>
            )}
          </div>

          <div>
            <h2 className="mb-2 text-sm font-semibold">Word frequency (top 20)</h2>
            <div className="flex flex-wrap gap-2">
              {frequency.map((f) => (
                <span key={f.word} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                  {f.word} <span className="text-muted-foreground">x{f.count} ({f.percentage}%)</span>
                </span>
              ))}
            </div>
          </div>

          {phrases.length > 0 && (
            <div>
              <h2 className="mb-2 text-sm font-semibold">Repeated phrases</h2>
              <div className="flex flex-wrap gap-2">
                {phrases.slice(0, 15).map((p) => (
                  <span key={p.phrase} className="rounded-full border border-border bg-card px-3 py-1 text-sm">
                    &quot;{p.phrase}&quot; <span className="text-muted-foreground">x{p.count}</span>
                  </span>
                ))}
              </div>
            </div>
          )}

          <p className="text-xs text-muted-foreground">
            Keyword density is informational only - it is not a guarantee of search ranking, and modern search
            engines don&apos;t use simple density as a ranking signal.
          </p>
        </>
      )}
    </div>
  );
}
