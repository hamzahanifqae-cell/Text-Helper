import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextCompareWorkspace } from "@/components/tools/implementations/text-compare-workspace";

const tool = getTool("text-compare")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste the original text on the left and the revised version on the right. Additions are
            highlighted in green; deletions are red with a strikethrough. Switch between word-level and
            line-level comparison. Everything runs in your browser.
          </p>
          <h2>Example</h2>
          <p>
            Original: &quot;The team reviewed the report.&quot; Revised: &quot;The team reviewed the final
            report.&quot; Word mode highlights the added word &quot;final.&quot;
          </p>
          <h2>Limitations</h2>
          <p>
            Very large pastes can make the highlight hard to scan. Use line mode for long drafts when you care
            about whole-line changes.
          </p>
        </>
      }
    >
      <TextCompareWorkspace />
    </ToolPageLayout>
  );
}
