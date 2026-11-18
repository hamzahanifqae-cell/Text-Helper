import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { PrivacyRedactorWorkspace } from "@/components/tools/implementations/privacy-redactor-workspace";

const tool = getTool("privacy-redactor")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste text and the tool replaces recognizable email addresses and phone numbers with
            &quot;[redacted]&quot; as you type. Processing stays in your browser. No text is sent to
            TextHelper or Groq.
          </p>
          <h2>Example</h2>
          <p>
            <code>Email me at ada@example.com or call +1 555-010-7788.</code> becomes roughly
            &quot;Email me at [redacted] or call [redacted].&quot; Review the result before sharing it.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>
              Detection is pattern-based. Unusual formats can be missed, and some number sequences that are
              not phone numbers may be flagged.
            </li>
            <li>This does not redact names, street addresses, or other personal information.</li>
            <li>This is not a guarantee of complete anonymization.</li>
          </ul>
        </>
      }
    >
      <PrivacyRedactorWorkspace />
    </ToolPageLayout>
  );
}
