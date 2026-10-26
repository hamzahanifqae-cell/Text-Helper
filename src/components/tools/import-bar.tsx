"use client";
import { useRef } from "react";
import { Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { importAnyTextFile } from "@/lib/docx/import";

export function ImportBar({ onImported }: { onImported: (text: string) => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  async function onFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    try {
      const text = await importAnyTextFile(file);
      onImported(text);
      toast(`Imported ${file.name}`);
    } catch (err) {
      toast(err instanceof Error ? err.message : "Could not import this file.", "destructive");
    }
  }

  return (
    <>
      <input
        ref={inputRef}
        type="file"
        accept=".txt,.docx,text/plain"
        className="sr-only"
        onChange={onFileChange}
        aria-hidden="true"
        tabIndex={-1}
      />
      <Button variant="outline" size="sm" onClick={() => inputRef.current?.click()}>
        <Upload className="h-4 w-4" />
        Import .txt / .docx
      </Button>
    </>
  );
}
