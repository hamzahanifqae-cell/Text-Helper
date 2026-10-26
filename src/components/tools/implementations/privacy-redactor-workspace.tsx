"use client";
import { useMemo, useState } from "react";
import { AlertTriangle } from "lucide-react";
import { TextInputPanel } from "@/components/tools/text-input-panel";
import { CopyExportBar } from "@/components/tools/copy-export-bar";
import { Switch } from "@/components/ui/switch";
import { useTextHistory } from "@/hooks/use-text-history";
import { redactPII } from "@/lib/tools/extraction";

export function PrivacyRedactorWorkspace() {
  const history = useTextHistory("");
  const [redactEmails, setRedactEmails] = useState(true);
  const [redactPhones, setRedactPhones] = useState(true);

  const redacted = useMemo(
    () => redactPII(history.value, { redactEmails, redactPhones }),
    [history.value, redactEmails, redactPhones]
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2.5 text-sm text-warning">
        <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
        Automatic detection can miss personal information or occasionally flag something that isn&apos;t one -
        this is not a guarantee of complete anonymization. Review the result yourself before sharing it.
      </div>

      <TextInputPanel
        toolSlug="privacy-redactor"
        value={history.value}
        onChange={history.set}
        undo={history.undo}
        redo={history.redo}
        canUndo={history.canUndo}
        canRedo={history.canRedo}
        clear={history.clear}
      />

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={redactEmails} onCheckedChange={setRedactEmails} /> Redact emails
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Switch checked={redactPhones} onCheckedChange={setRedactPhones} /> Redact phone numbers
        </label>
      </div>

      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold">
          Result ({redacted.emailsRedacted} email{redacted.emailsRedacted === 1 ? "" : "s"},{" "}
          {redacted.phonesRedacted} phone number{redacted.phonesRedacted === 1 ? "" : "s"} redacted)
        </h2>
        <CopyExportBar text={redacted.text} filenameBase="privacy-redactor" />
      </div>
      <div className="rounded-md border border-border bg-card p-3 text-sm leading-relaxed whitespace-pre-wrap break-words min-h-24">
        {redacted.text || <span className="text-muted-foreground">Nothing yet.</span>}
      </div>
    </div>
  );
}
