"use client";
import { useState } from "react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useTextHistory } from "@/hooks/use-text-history";
import {
  sortLines,
  reverseLineOrder,
  numberLines,
  removeDuplicateLineEntries,
  addPrefix,
  removePrefix,
  addSuffix,
  removeSuffix,
} from "@/lib/tools/listTools";

export function ListLineToolsWorkspace() {
  const history = useTextHistory("");
  const [affix, setAffix] = useState("");

  return (
    <div className="flex flex-col gap-6">
      <TextInputPanel
        toolSlug="list-line-tools"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
        placeholder="One item per line…"
      />

      <div className="flex flex-wrap gap-2">
        <Button variant="outline" size="sm" disabled={!history.value} onClick={() => history.set(sortLines(history.value, "asc"))}>
          Sort A-Z
        </Button>
        <Button variant="outline" size="sm" disabled={!history.value} onClick={() => history.set(sortLines(history.value, "desc"))}>
          Sort Z-A
        </Button>
        <Button variant="outline" size="sm" disabled={!history.value} onClick={() => history.set(reverseLineOrder(history.value))}>
          Reverse order
        </Button>
        <Button variant="outline" size="sm" disabled={!history.value} onClick={() => history.set(numberLines(history.value))}>
          Number lines
        </Button>
        <Button variant="outline" size="sm" disabled={!history.value} onClick={() => history.set(removeDuplicateLineEntries(history.value))}>
          Remove duplicates
        </Button>
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="affix-input">Prefix / suffix text</Label>
          <Input id="affix-input" value={affix} onChange={(e) => setAffix(e.target.value)} placeholder="e.g. - " className="w-48" />
        </div>
        <Button variant="outline" size="sm" disabled={!affix} onClick={() => history.set(addPrefix(history.value, affix))}>
          Add as prefix
        </Button>
        <Button variant="outline" size="sm" disabled={!affix} onClick={() => history.set(removePrefix(history.value, affix))}>
          Remove prefix
        </Button>
        <Button variant="outline" size="sm" disabled={!affix} onClick={() => history.set(addSuffix(history.value, affix))}>
          Add as suffix
        </Button>
        <Button variant="outline" size="sm" disabled={!affix} onClick={() => history.set(removeSuffix(history.value, affix))}>
          Remove suffix
        </Button>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">Result</h2>
        <CopyExportBar text={history.value} filenameBase="list-line-tools" />
      </div>
    </div>
  );
}
