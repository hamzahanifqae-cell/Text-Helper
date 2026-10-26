"use client";
import { useState } from "react";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

type Tone = "formal" | "casual" | "friendly" | "confident" | "empathetic" | "persuasive" | "neutral";

const TONES: { value: Tone; label: string }[] = [
  { value: "formal", label: "Formal" },
  { value: "casual", label: "Casual" },
  { value: "friendly", label: "Friendly" },
  { value: "confident", label: "Confident" },
  { value: "empathetic", label: "Empathetic" },
  { value: "persuasive", label: "Persuasive" },
  { value: "neutral", label: "Neutral" },
];

export function ToneChangerWorkspace() {
  const [targetTone, setTargetTone] = useState<Tone>("neutral");

  return (
    <AIRewriteWorkspace
      toolSlug="tone-changer"
      taskId="tone-change"
      buildOptions={(protectedPhrases) => ({ targetTone, protectedPhrases })}
      settings={
        <div className="flex flex-col gap-1.5 sm:max-w-xs">
          <Label htmlFor="target-tone">Target tone</Label>
          <Select value={targetTone} onValueChange={(v) => setTargetTone(v as Tone)}>
            <SelectTrigger id="target-tone">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TONES.map((t) => (
                <SelectItem key={t.value} value={t.value}>
                  {t.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      }
    />
  );
}
