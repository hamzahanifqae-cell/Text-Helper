"use client";
import { useState } from "react";
import { Copy, Download, Check, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { downloadTextAsTxt } from "@/lib/utils/download";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";

// Deliberately rendered apart from any ad slot and from the editor's action
// button, per the product requirement that ads never sit next to copy/
// download controls or the processing action.
export function CopyExportBar({ text, filenameBase }: { text: string; filenameBase: string }) {
  const { toast } = useToast();
  const [copied, setCopied] = useState(false);

  async function onCopy() {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      toast("Copied to clipboard");
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast("Could not copy - please copy manually.", "destructive");
    }
  }

  async function onExport(format: "txt" | "docx" | "pdf") {
    if (!text) {
      toast("There's nothing to export yet.", "destructive");
      return;
    }
    try {
      if (format === "txt") {
        downloadTextAsTxt(text, `${filenameBase}.txt`);
        return;
      }
      if (format === "docx") {
        const { exportTextAsDocxBlob } = await import("@/lib/docx/export");
        const { downloadBlob } = await import("@/lib/utils/download");
        downloadBlob(await exportTextAsDocxBlob(text), `${filenameBase}.docx`);
        return;
      }
      const { exportTextAsPdfBlob } = await import("@/lib/pdf/export");
      const { downloadBlob } = await import("@/lib/utils/download");
      downloadBlob(await exportTextAsPdfBlob(text), `${filenameBase}.pdf`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Export failed.", "destructive");
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="outline" size="sm" onClick={onCopy} disabled={!text}>
        {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
        Copy
      </Button>
      <DropdownPrimitive.Root>
        <DropdownPrimitive.Trigger asChild>
          <Button variant="outline" size="sm" disabled={!text}>
            <Download className="h-4 w-4" />
            Export
            <ChevronDown className="h-3.5 w-3.5" />
          </Button>
        </DropdownPrimitive.Trigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onSelect={() => onExport("txt")}>Export as .txt</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onExport("docx")}>Export as .docx</DropdownMenuItem>
          <DropdownMenuItem onSelect={() => onExport("pdf")}>Export as .pdf</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownPrimitive.Root>
    </div>
  );
}
