import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { ReadabilityWorkspace } from "@/components/tools/implementations/readability-workspace";

const tool = getTool("readability-checker")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Paste text to see Flesch Reading Ease, Flesch-Kincaid Grade Level, and Gunning Fog, plus average
            word and sentence length, long sentences, and a few simpler word suggestions. Scoring runs in your
            browser.
          </p>
          <h2>How to read the scores</h2>
          <p>
            Higher Flesch Reading Ease usually means easier silent reading for general English prose. Grade
            Level and Gunning Fog estimate the years of schooling associated with the sentence and word
            lengths. They are directional, not exact.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>These formulas were designed for English and use approximate syllable counting.</li>
            <li>
              The simpler-alternatives list is a small curated set, not a full thesaurus.
            </li>
            <li>
              Scores describe sentence and word complexity. They do not measure accuracy, engagement, or search
              ranking.
            </li>
          </ul>
        </>
      }
    >
      <ReadabilityWorkspace />
    </ToolPageLayout>
  );
}
