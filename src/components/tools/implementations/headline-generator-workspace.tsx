"use client";
import { useState } from "react";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

export function HeadlineGeneratorWorkspace() {
  const [count, setCount] = useState(3);

  return (
    <AIRewriteWorkspace
      toolSlug="headline-generator"
      taskId="headline-generator"
      generateLabel="Generate headlines"
      showDiff={false}
      showProtectedPhrases={false}
      buildOptions={() => ({ count })}
      settings={
        <div className="flex flex-col gap-1.5 sm:max-w-xs">
          <Label htmlFor="headline-count">Number of headlines: {count}</Label>
          <Slider
            id="headline-count"
            min={1}
            max={8}
            step={1}
            value={[count]}
            onValueChange={([v]) => setCount(v ?? 3)}
          />
        </div>
      }
    />
  );
}
