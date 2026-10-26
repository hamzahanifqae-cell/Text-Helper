import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ToneChangerWorkspace } from "@/components/tools/implementations/tone-changer-workspace";

const tool = getTool("tone-changer")!;

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
          <p>Paste text, choose a target tone, and click Generate. The AI rewrites the text in that tone while keeping the same meaning and information.</p>
          <h2>Example use</h2>
          <p>Turning a blunt internal note into something more empathetic before sending it externally.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Tone is subjective - review the result to make sure it matches what you intended.</li>
          </ul>
        </>
      }
    >
      <ToneChangerWorkspace />
    </ToolPageLayout>
  );
}
