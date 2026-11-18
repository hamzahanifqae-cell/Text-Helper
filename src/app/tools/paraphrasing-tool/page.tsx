import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("paraphrasing-tool")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste a paragraph or more and click Generate. The request goes to TextHelper&apos;s API, which
            forwards the text to Groq. The model rewrites with different wording and sentence structure while
            keeping the same meaning and points, in the same order. Text is not sent while you type.
          </p>
          <h2>Example</h2>
          <p>
            Input: &quot;The committee approved the budget after a long discussion.&quot; One possible rewrite:
            &quot;After a lengthy discussion, the committee approved the budget.&quot; Another run can word it
            differently. Read the result before you use it.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>
              Paraphrased text can still be close in meaning to the original. This is not a tool for disguising
              authorship.
            </li>
            <li>Very short input may come back nearly unchanged.</li>
            <li>The model can drop a nuance. Check accuracy before publishing.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace toolSlug={tool.slug} taskId="paraphrase" />
    </ToolPageLayout>
  );
}
