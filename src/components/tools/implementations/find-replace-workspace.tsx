"use client";
import { useMemo, useState } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { useTextHistory } from "@/hooks/use-text-history";
import { useToast } from "@/components/ui/toast";
import { findMatches, replaceAll } from "@/lib/tools/findReplace";

export function FindReplaceWorkspace() {
  const history = useTextHistory("");
  const [find, setFind] = useState("");
  const [replace, setReplace] = useState("");
  const [caseSensitive, setCaseSensitive] = useState(false);
  const [wholeWord, setWholeWord] = useState(false);
  const { toast } = useToast();

  const matches = useMemo(
    () => (find ? findMatches(history.value, find, { caseSensitive, wholeWord }) : []),
    [history.value, find, caseSensitive, wholeWord]
  );

  const preview = useMemo(() => {
    if (!find || matches.length === 0) return null;
    const nodes: React.ReactNode[] = [];
    let last = 0;
    matches.forEach((m, i) => {
      nodes.push(history.value.slice(last, m.start));
      nodes.push(
        <mark key={i} className="rounded bg-accent px-0.5 text-accent-foreground">
          {history.value.slice(m.start, m.end)}
        </mark>
      );
      last = m.end;
    });
    nodes.push(history.value.slice(last));
    return nodes;
  }, [find, matches, history.value]);

  function onReplaceAll() {
    const result = replaceAll(history.value, find, replace, { caseSensitive, wholeWord });
    history.set(result.text);
    toast(`${result.count} replacement${result.count === 1 ? "" : "s"} made`);
  }

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="find-and-replace"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="find-input">Find</Label>
          <Input id="find-input" value={find} onChange={(e) => setFind(e.target.value)} placeholder="Text to find" />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="replace-input">Replace with</Label>
          <Input id="replace-input" value={replace} onChange={(e) => setReplace(e.target.value)} placeholder="Replacement text" />
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={caseSensitive} onCheckedChange={setCaseSensitive} /> Case-sensitive
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={wholeWord} onCheckedChange={setWholeWord} /> Whole word
        </label>
        <Button onClick={onReplaceAll} disabled={!find || matches.length === 0}>
          Replace all ({matches.length})
        </Button>
      </div>

      {preview && (
        <div>
          <h2 className="mb-2 text-sm font-semibold">Preview ({matches.length} match{matches.length === 1 ? "" : "es"})</h2>
          <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words">
            {preview}
          </div>
        </div>
      )}

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Result</h2>
        <CopyExportBar text={history.value} filenameBase="find-and-replace" />
      </div>
    </div>
  );
}
