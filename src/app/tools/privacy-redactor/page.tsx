import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { PrivacyRedactorWorkspace } from "@/components/tools/implementations/privacy-redactor-workspace";

const tool = getTool("privacy-redactor")!;

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
          <p>Paste text and the tool replaces recognizable email addresses and phone numbers with &quot;[redacted]&quot; as you type - entirely in your browser.</p>
          <h2>Limitations</h2>
          <ul>
            <li>Detection is pattern-based and heuristic - unusual formats can be missed, and some number sequences that aren&apos;t phone numbers may be flagged.</li>
            <li>This does not redact names, addresses, or other personal information - only emails and phone-number-shaped text.</li>
            <li>This is not a guarantee of complete anonymization; always review the output before sharing it.</li>
          </ul>
        </>
      }
    >
      <PrivacyRedactorWorkspace />
    </ToolPageLayout>
  );
}
