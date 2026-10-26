import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { CaseConverterWorkspace } from "@/components/tools/implementations/case-converter-workspace";

const tool = getTool("case-converter")!;

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
          <p>Paste text and click a case style to apply it immediately. Use undo above the editor to revert.</p>
          <h2>What each style does</h2>
          <ul>
            <li><strong>Title Case</strong> keeps common small words (a, the, of, and, ...) lowercase unless they&apos;re the first or last word.</li>
            <li><strong>Sentence case</strong> capitalizes the first letter after sentence-ending punctuation.</li>
            <li><strong>Toggle case</strong> flips the case of every letter.</li>
          </ul>
          <h2>Limitations</h2>
          <p>Case conversion uses standard Unicode case-folding, so it works for accented Latin, Cyrillic, and Greek text; scripts without a case distinction (CJK, Arabic, etc.) are left unchanged, which is correct.</p>
        </>
      }
    >
      <CaseConverterWorkspace />
    </ToolPageLayout>
  );
}
