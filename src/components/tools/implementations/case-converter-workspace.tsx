"use client";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Button } from "@/components/ui/button";
import { useTextHistory } from "@/hooks/use-text-history";
import { applyCase, type CaseMode } from "@/lib/tools/caseConversion";

const MODES: { id: CaseMode; label: string }[] = [
  { id: "upper", label: "UPPERCASE" },
  { id: "lower", label: "lowercase" },
  { id: "sentence", label: "Sentence case" },
  { id: "title", label: "Title Case" },
  { id: "toggle", label: "tOGGLE cASE" },
];

export function CaseConverterWorkspace() {
  const history = useTextHistory("");

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="case-converter"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      <div className="flex flex-wrap gap-2">
        {MODES.map((mode) => (
          <Button
            key={mode.id}
            variant="outline"
            size="sm"
            disabled={!history.value}
            onClick={() => history.set(applyCase(history.value, mode.id))}
          >
            {mode.label}
          </Button>
        ))}
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Result</h2>
        <CopyExportBar text={history.value} filenameBase="case-converter" />
      </div>
    </div>
  );
}
