"use client";
import { X, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

export function ProtectedPhrasesInput({
  phrases,
  onChange,
}: {
  phrases: string[];
  onChange: (phrases: string[]) => void;
}) {
  const [draft, setDraft] = useState("");

  function add() {
    const trimmed = draft.trim();
    if (!trimmed || phrases.includes(trimmed) || phrases.length >= 25) return;
    onChange([...phrases, trimmed]);
    setDraft("");
  }

  function remove(phrase: string) {
    onChange(phrases.filter((p) => p !== phrase));
  }

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor="protected-phrases">Protected words/phrases (optional)</Label>
      <div className="flex gap-2">
        <Input
          id="protected-phrases"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              add();
            }
          }}
          placeholder="e.g. a brand name or exact quote"
        />
        <Button type="button" variant="outline" onClick={add}>
          Add
        </Button>
      </div>
      {phrases.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {phrases.map((phrase) => (
            <Badge key={phrase} variant="outline" className="gap-1 pr-1">
              <ShieldCheck className="h-3 w-3" />
              {phrase}
              <button
                type="button"
                onClick={() => remove(phrase)}
                aria-label={`Remove protected phrase ${phrase}`}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      <p className="text-xs text-muted-foreground">
        We ask the AI to keep these exactly as written and check afterward whether it did - this is a
        best-effort request, not a guarantee.
      </p>
    </div>
  );
}
