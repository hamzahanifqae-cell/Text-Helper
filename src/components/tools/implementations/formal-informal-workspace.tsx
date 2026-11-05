"use client";
import { useState } from "react";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";

type Direction = "toFormal" | "toInformal";

export function FormalInformalWorkspace() {
  const [direction, setDirection] = useState<Direction>("toFormal");

  return (
    <AIRewriteWorkspace
      toolSlug="formal-informal-converter"
      taskId="formal-informal"
      placeholder="Paste the text you want to make formal or informal…"
      guidance={
        <p>Choose Make formal or Make informal under the box. Both directions are available on this page.</p>
      }
      buildOptions={(protectedPhrases) => ({ direction, protectedPhrases })}
      settings={
        <div className="flex flex-col gap-2">
          <Tabs value={direction} onValueChange={(v) => setDirection(v as Direction)}>
            <TabsList>
              <TabsTrigger value="toFormal">Make formal</TabsTrigger>
              <TabsTrigger value="toInformal">Make informal</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-sm text-muted-foreground">
            {direction === "toFormal"
              ? "Make formal removes contractions and slang and uses complete, precise sentences."
              : "Make informal allows contractions and conversational wording."}
          </p>
        </div>
      }
    />
  );
}
