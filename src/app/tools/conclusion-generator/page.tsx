import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { AIRewriteWorkspace } from "@/components/tools/ai-rewrite-workspace";

const tool = getTool("conclusion-generator")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste the body of an article, report, or essay, then click Generate conclusion. The tool writes
            one closing paragraph from that text. It is instructed not to add claims that are not already there.
          </p>
          <h2>Example</h2>
          <p>Input:</p>
          <p>
            The library extended its weekday hours to 8 p.m. in March. Evening visits rose, and more students
            used the quiet study rooms after class. Weekend hours stayed the same.
          </p>
          <p>A closing paragraph that only restates those points:</p>
          <p>
            Extending weekday hours to 8 p.m. brought more evening visits and more use of the quiet study rooms
            after class, while weekend hours stayed the same.
          </p>
          <p>
            This illustration shows the shape of the requested result. The paragraph produced when you click
            Generate can be worded differently, and it still needs a review.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>The conclusion can only reflect what is in the pasted content.</li>
            <li>It writes a closing paragraph. It does not rewrite the whole piece.</li>
          </ul>
        </>
      }
    >
      <AIRewriteWorkspace
        toolSlug={tool.slug}
        taskId="conclusion-generator"
        generateLabel="Generate conclusion"
        placeholder="Paste the article, report, or essay you want to close…"
        guidance={
          <p>
            Paste the content itself, not only a topic. The tool writes one concluding paragraph from that
            text and is instructed not to add new claims.
          </p>
        }
      />
    </ToolPageLayout>
  );
}
