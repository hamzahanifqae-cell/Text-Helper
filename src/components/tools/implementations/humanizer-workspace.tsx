"use client";
import { useState } from "react";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

type Tone = "casual" | "professional" | "conversational";

export function HumanizerWorkspace() {
  const [tone, setTone] = useState<Tone>("conversational");
  const [strength, setStrength] = useState(3);
  const [preserveQuotes, setPreserveQuotes] = useState(true);
  const [preserveCitations, setPreserveCitations] = useState(true);
  const [preserveFormatting, setPreserveFormatting] = useState(true);

  return (
    <AIRewriteWorkspace
      toolSlug="ai-text-humanizer"
      taskId="humanize"
      generateLabel="Humanize text"
      buildOptions={(protectedPhrases) => ({
        tone,
        strength,
        preserveQuotes,
        preserveCitations,
        preserveFormatting,
        protectedPhrases,
      })}
      settings={
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="tone-select">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as Tone)}>
              <SelectTrigger id="tone-select">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual</SelectItem>
                <SelectItem value="professional">Professional</SelectItem>
                <SelectItem value="conversational">Conversational</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex flex-col gap-1.5">
            <Label htmlFor="strength-slider">
              Rewrite strength: {strength} / 5
            </Label>
            <Slider
              id="strength-slider"
              min={1}
              max={5}
              step={1}
              value={[strength]}
              onValueChange={([v]) => setStrength(v ?? 3)}
            />
          </div>

          <div className="flex items-center gap-2">
            <Switch id="preserve-quotes" checked={preserveQuotes} onCheckedChange={setPreserveQuotes} />
            <Label htmlFor="preserve-quotes" className="font-normal">Preserve quotations</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="preserve-citations" checked={preserveCitations} onCheckedChange={setPreserveCitations} />
            <Label htmlFor="preserve-citations" className="font-normal">Preserve citations</Label>
          </div>
          <div className="flex items-center gap-2">
            <Switch id="preserve-formatting" checked={preserveFormatting} onCheckedChange={setPreserveFormatting} />
            <Label htmlFor="preserve-formatting" className="font-normal">Preserve formatting</Label>
          </div>
        </div>
      }
    />
  );
}
