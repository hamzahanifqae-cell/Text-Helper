"use client";
import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { SuggestionList, type DisplaySuggestion } from "@/components/tools/suggestion-list";
import { AIDisclosureNote, AIUnavailableBanner } from "@/components/tools/ai-status-banner";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTextHistory } from "@/hooks/use-text-history";
import { useAITask } from "@/hooks/use-ai-task";
import { useAIStatus } from "@/hooks/use-ai-status";
import { useToast } from "@/components/ui/toast";
import { dictionaryStore } from "@/lib/storage/db";
import {
  detectAll,
  applySuggestion,
  type EnglishVariant,
  type GrammarSuggestion,
} from "@/lib/tools/grammarLite";
import type { AiGrammarSuggestion, GrammarDeepResult } from "@/lib/ai/tasks/grammarDeep";

function toDisplay(s: GrammarSuggestion): DisplaySuggestion {
  return { key: `${s.type}-${s.start}-${s.end}-${s.id}`, type: s.type, original: s.original, suggestion: s.suggestion, explanation: s.explanation };
}

export function GrammarCheckerWorkspace() {
  const history = useTextHistory("");
  const [variant, setVariant] = useState<EnglishVariant>("US");
  const [customDictionary, setCustomDictionary] = useState<Set<string>>(new Set());
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [checkRepetition, setCheckRepetition] = useState(true);
  const [checkSpelling, setCheckSpelling] = useState(true);
  const [checkVariant, setCheckVariant] = useState(true);
  const [checkPunctuation, setCheckPunctuation] = useState(true);
  const { toast } = useToast();
  const aiStatus = useAIStatus();
  const aiTask = useAITask<GrammarDeepResult>("grammar-deep");
  const [acceptedAiKeys, setAcceptedAiKeys] = useState<Set<string>>(new Set());

  useEffect(() => {
    dictionaryStore.list().then((words) => setCustomDictionary(new Set(words)));
  }, []);

  const localSuggestions = useMemo(() => {
    const all = detectAll(history.value, {
      variant,
      customDictionary,
      checkRepetition,
      checkSpelling,
      checkVariant,
      checkPunctuation,
    });
    return all.filter((s) => !dismissed.has(`${s.start}-${s.end}-${s.original}`));
  }, [history.value, variant, customDictionary, checkRepetition, checkSpelling, checkVariant, checkPunctuation, dismissed]);

  function acceptLocal(key: string) {
    const s = localSuggestions.find((x) => `${x.type}-${x.start}-${x.end}-${x.id}` === key);
    if (!s) return;
    const result = applySuggestion(history.value, s);
    if (result.ok && result.text !== undefined) {
      history.set(result.text);
    } else {
      toast(result.reason ?? "Could not apply this suggestion.", "destructive");
    }
  }

  function rejectLocal(key: string) {
    const s = localSuggestions.find((x) => `${x.type}-${x.start}-${x.end}-${x.id}` === key);
    if (!s) return;
    setDismissed((prev) => new Set(prev).add(`${s.start}-${s.end}-${s.original}`));
  }

  async function addToDictionary(key: string, word: string) {
    await dictionaryStore.add(word);
    setCustomDictionary((prev) => new Set(prev).add(word.toLowerCase()));
    toast(`"${word}" added to your local custom dictionary`);
  }

  const aiSuggestions: AiGrammarSuggestion[] = (aiTask.result?.suggestions ?? []).filter(
    (s) => !acceptedAiKeys.has(`${s.start}-${s.end}-${s.original}`)
  );

  function acceptAi(key: string) {
    const s = aiSuggestions.find((x) => `${x.start}-${x.end}-${x.original}` === key);
    if (!s) return;
    const result = applySuggestion(history.value, { ...s, id: key, type: "spelling" });
    if (result.ok && result.text !== undefined) {
      history.set(result.text);
      setAcceptedAiKeys((prev) => new Set(prev).add(`${s.start}-${s.end}-${s.original}`));
    } else {
      toast(result.reason ?? "Could not apply this suggestion.", "destructive");
    }
  }

  function rejectAi(key: string) {
    const s = aiSuggestions.find((x) => `${x.start}-${x.end}-${x.original}` === key);
    if (!s) return;
    setAcceptedAiKeys((prev) => new Set(prev).add(`${s.start}-${s.end}-${s.original}`));
  }

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="grammar-checker"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      <div className="flex flex-wrap items-center justify-between gap-4">
        <Tabs value={variant} onValueChange={(v) => setVariant(v as EnglishVariant)}>
          <TabsList>
            <TabsTrigger value="US">US English</TabsTrigger>
            <TabsTrigger value="UK">UK English</TabsTrigger>
          </TabsList>
        </Tabs>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={checkSpelling} onCheckedChange={setCheckSpelling} /> Spelling
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={checkPunctuation} onCheckedChange={setCheckPunctuation} /> Punctuation
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={checkRepetition} onCheckedChange={setCheckRepetition} /> Repeated words
          </label>
          <label className="flex items-center gap-2 text-sm">
            <Switch checked={checkVariant} onCheckedChange={setCheckVariant} /> US/UK spelling
          </label>
        </div>
      </div>

      <div>
        <h2 className="mb-2 text-sm font-semibold">
          Suggestions {localSuggestions.length > 0 && `(${localSuggestions.length})`}
        </h2>
        <SuggestionList
          suggestions={localSuggestions.map(toDisplay)}
          onAccept={acceptLocal}
          onReject={rejectLocal}
          onAddToDictionary={addToDictionary}
        />
      </div>

      <div className="border-t border-border pt-5">
        <h2 className="mb-2 flex items-center gap-2 text-sm font-semibold">
          <Sparkles className="h-4 w-4 text-primary" /> Deeper AI suggestions (optional)
        </h2>
        <p className="mb-3 text-xs text-muted-foreground">
          Catches context-dependent grammar and clarity issues that the checks above miss. Not a replacement
          for the checks above - run both.
        </p>
        {aiStatus && !aiStatus.configured && <AIUnavailableBanner />}
        {aiStatus && aiStatus.configured && !aiStatus.quotaAvailable && <AIUnavailableBanner quotaOnly />}
        <AIDisclosureNote />
        <div className="mt-3 flex items-center gap-2">
          {aiTask.status === "processing" ? (
            <Button variant="secondary" onClick={aiTask.cancel}>
              Cancel
            </Button>
          ) : (
            <Button
              variant="outline"
              disabled={!history.value.trim() || Boolean(aiStatus && !aiStatus.configured)}
              onClick={() => void aiTask.run(history.value, { variant })}
            >
              Get deeper AI suggestions
            </Button>
          )}
        </div>
        {aiTask.status === "error" && aiTask.error && (
          <p className="mt-2 text-sm text-destructive">{aiTask.error.message}</p>
        )}
        {aiTask.result?.parseError && (
          <p className="mt-2 text-sm text-warning">The AI couldn&apos;t produce structured suggestions this time - try again.</p>
        )}
        {aiTask.status === "success" && !aiTask.result?.parseError && (
          <div className="mt-3">
            <SuggestionList
              suggestions={aiSuggestions.map((s) => ({
                key: `${s.start}-${s.end}-${s.original}`,
                type: "AI suggestion",
                original: s.original,
                suggestion: s.suggestion,
                explanation: s.explanation,
              }))}
              onAccept={acceptAi}
              onReject={rejectAi}
            />
          </div>
        )}
      </div>

      {customDictionary.size > 0 && (
        <p className="text-xs text-muted-foreground">
          Custom dictionary: {customDictionary.size} word{customDictionary.size === 1 ? "" : "s"} saved locally on this device.
        </p>
      )}
    </div>
  );
}
