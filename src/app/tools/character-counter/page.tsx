import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextStatsWorkspace } from "@/components/tools/implementations/text-stats-workspace";

const tool = getTool("character-counter")!;

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
          <h2>How counting works</h2>
          <p>
            Characters are counted as user-perceived characters (graphemes), not raw UTF-16 code units - so a
            flag emoji or an accented letter built from combining marks counts as one character, matching
            what you&apos;d count by eye, which is usually what platform character limits (social posts, SMS,
            form fields) care about.
          </p>
          <h2>Selected text</h2>
          <p>Select any portion of your text in the box above to see a character count for just that selection.</p>
        </>
      }
    >
      <TextStatsWorkspace toolSlug={tool.slug} emphasis="characters" />
    </ToolPageLayout>
  );
}
