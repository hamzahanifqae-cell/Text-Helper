import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextExtractorWorkspace } from "@/components/tools/implementations/text-extractor-workspace";

const tool = getTool("text-extractor")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste text and pick emails, URLs, hashtags, or numbers. Matches are found with pattern matching
            and listed one per line. Emails, URLs, and hashtags are de-duplicated. Everything runs in your
            browser.
          </p>
          <h2>Example</h2>
          <p>
            From &quot;Ping ada@example.com and visit https://example.com #launch&quot;, the email mode lists
            <code>ada@example.com</code>, the URL mode lists <code>https://example.com</code>, and the
            hashtag mode lists <code>#launch</code>.
          </p>
          <h2>Limitations</h2>
          <p>
            Pattern-based detection can miss unusual formats or pick up a false positive. Review the list
            before relying on it.
          </p>
        </>
      }
    >
      <TextExtractorWorkspace />
    </ToolPageLayout>
  );
}
