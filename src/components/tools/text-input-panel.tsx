"use client";
import { useEffect, useRef, useState } from "react";
import { Undo2, Redo2, Trash2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ImportBar } from "@/components/tools/import-bar";
import { useLocalDraft } from "@/hooks/use-local-draft";
import { useToast } from "@/components/ui/toast";

export interface TextInputPanelHandle {
  value: string;
  setValue: (text: string) => void;
}

export function TextInputPanel({
  toolSlug,
  value,
  onChange,
  undo,
  redo,
  canUndo,
  canRedo,
  clear,
  placeholder = "Paste or type your text here…",
  rows = 12,
  onSelectionChange,
}: {
  toolSlug: string;
  value: string;
  onChange: (text: string) => void;
  undo: () => void;
  redo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  clear: () => void;
  placeholder?: string;
  rows?: number;
  onSelectionChange?: (selectedText: string) => void;
}) {
  const { toast } = useToast();
  const [autosave, setAutosave] = useState(false);
  const { saveDraft, loadDraft, clearDraft } = useLocalDraft(toolSlug, autosave);
  const restoredOnce = useRef(false);

  useEffect(() => {
    if (restoredOnce.current) return;
    restoredOnce.current = true;
    loadDraft().then((draft) => {
      if (draft) onChange(draft);
    });
  }, [loadDraft, onChange]);

  function handleChange(next: string) {
    onChange(next);
    if (autosave) saveDraft(next);
  }

  function handleClear() {
    clear();
    void clearDraft();
  }

  return (
    <div className="editor-panel">
      <div className="editor-toolbar flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <Button variant="ghost" size="icon" onClick={undo} disabled={!canUndo} aria-label="Undo">
            <Undo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={redo} disabled={!canRedo} aria-label="Redo">
            <Redo2 className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={handleClear} disabled={!value} aria-label="Clear input">
            <Trash2 className="h-4 w-4" />
          </Button>
          <ImportBar onImported={(text) => { handleChange(text); toast("Text imported into the editor"); }} />
        </div>
        <div className="flex items-center gap-2">
          <Switch id={`${toolSlug}-autosave`} checked={autosave} onCheckedChange={setAutosave} />
          <Label htmlFor={`${toolSlug}-autosave`} className="text-xs font-normal text-muted-foreground">
            Autosave draft locally
          </Label>
        </div>
      </div>
      <Textarea
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        onSelect={
          onSelectionChange
            ? (e) => {
                const el = e.currentTarget;
                onSelectionChange(el.value.slice(el.selectionStart, el.selectionEnd));
              }
            : undefined
        }
        placeholder={placeholder}
        rows={rows}
        className="text-base"
        aria-label="Input text"
      />
    </div>
  );
}
