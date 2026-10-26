"use client";
import { useState } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Button } from "@/components/ui/button";
import { useTextHistory } from "@/hooks/use-text-history";
import { useToast } from "@/components/ui/toast";
import { applyCleanupOperation, type CleanupOperation } from "@/lib/tools/cleanup";

const OPERATIONS: { id: CleanupOperation; label: string }[] = [
  { id: "extraSpaces", label: "Remove extra spaces" },
  { id: "emptyLines", label: "Remove empty lines" },
  { id: "duplicateLines", label: "Remove duplicate lines" },
  { id: "lineBreaks", label: "Normalize line breaks" },
  { id: "formattingArtifacts", label: "Strip pasted formatting" },
  { id: "htmlTags", label: "Remove HTML tags" },
  { id: "tabsToSpaces", label: "Tabs to spaces" },
  { id: "spacesToTabs", label: "Spaces to tabs" },
];

export function TextCleanerWorkspace() {
  const history = useTextHistory("");
  const { toast } = useToast();
  const [lastOp, setLastOp] = useState<string | null>(null);

  function apply(op: CleanupOperation, label: string) {
    const { text, changes } = applyCleanupOperation(history.value, op);
    history.set(text);
    setLastOp(label);
    toast(changes > 0 ? `${label}: ${changes} change${changes === 1 ? "" : "s"} made` : `${label}: nothing to change`);
  }

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="text-cleaner"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      <div>
        <div className="mb-2 flex items-center justify-between">
          <h2 className="text-sm font-semibold">Cleanup operations</h2>
          {lastOp && <span className="text-xs text-muted-foreground">Last applied: {lastOp} (undo above to revert)</span>}
        </div>
        <div className="flex flex-wrap gap-2">
          {OPERATIONS.map((op) => (
            <Button key={op.id} variant="outline" size="sm" onClick={() => apply(op.id, op.label)} disabled={!history.value}>
              {op.label}
            </Button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Result</h2>
        <CopyExportBar text={history.value} filenameBase="text-cleaner" />
      </div>
    </div>
  );
}
