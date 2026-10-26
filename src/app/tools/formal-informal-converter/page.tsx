import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { FormalInformalWorkspace } from "@/components/tools/implementations/formal-informal-workspace";

const tool = getTool("formal-informal-converter")!;

export const metadata: Metadata = {
  title: tool.title,
  description: tool.shortDescription,
  alternates: { canonical: `/tools/${tool.slug}` },
};

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>Paste text, pick a direction, and click Generate. &quot;Make formal&quot; removes contractions and slang for a professional register; &quot;Make informal&quot; relaxes it to an everyday, conversational register.</p>
          <h2>Example use</h2>
          <p>Converting a casual Slack message into formal email copy, or the reverse.</p>
          <h2>Limitations</h2>
          <ul>
            <li>What counts as &quot;formal&quot; varies by industry and audience - review before using in a professional context.</li>
          </ul>
        </>
      }
    >
      <FormalInformalWorkspace />
    </ToolPageLayout>
  );
}
