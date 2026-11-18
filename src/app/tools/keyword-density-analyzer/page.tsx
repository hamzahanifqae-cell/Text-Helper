import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { KeywordDensityWorkspace } from "@/components/tools/implementations/keyword-density-workspace";

const tool = getTool("keyword-density-analyzer")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste text to see frequent words, repeated multi-word phrases, and vocabulary variety (unique
            words divided by total words). You can also check the count and density of one keyword or phrase.
            Everything runs in your browser.
          </p>
          <h2>Example</h2>
          <p>
            In a short product blurb that repeats &quot;shipping&quot; three times in 60 words, the density for
            that word is 5%. That number describes the paste; it does not predict search ranking.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>Keyword density is not a guarantee of search ranking.</li>
            <li>
              The common-words filter uses a general English stop-word list and may not suit every language or
              domain.
            </li>
          </ul>
        </>
      }
    >
      <KeywordDensityWorkspace />
    </ToolPageLayout>
  );
}
