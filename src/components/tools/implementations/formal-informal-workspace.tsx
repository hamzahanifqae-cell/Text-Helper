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
      buildOptions={(protectedPhrases) => ({ direction, protectedPhrases })}
      settings={
        <Tabs value={direction} onValueChange={(v) => setDirection(v as Direction)}>
          <TabsList>
            <TabsTrigger value="toFormal">Make formal</TabsTrigger>
            <TabsTrigger value="toInformal">Make informal</TabsTrigger>
          </TabsList>
        </Tabs>
      }
    />
  );
}
