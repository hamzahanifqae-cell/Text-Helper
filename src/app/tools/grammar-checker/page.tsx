import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { GrammarCheckerWorkspace } from "@/components/tools/implementations/grammar-checker-workspace";

const tool = getTool("grammar-checker")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            As you type or paste text, this tool runs fast local checks for repeated words, a curated list of
            common misspellings, basic punctuation issues, and US/UK spelling mismatches. Those checks stay
            in your browser. Accept or reject each suggestion, or add a word to your local custom dictionary.
          </p>
          <p>
            Optionally, click <strong>Get deeper AI suggestions</strong>. That control sends the current text
            to TextHelper&apos;s API, which forwards it to Groq for that request. A short notice appears above
            the button before you click. Text is not sent while you type.
          </p>
          <h2>Example</h2>
          <p>
            Local check: <code>Their going to the meeeting.</code> can flag the misspelling of
            &quot;meeting&quot; from the curated list. Deeper AI suggestions may also comment on
            &quot;Their&quot; versus &quot;They&apos;re&quot; when you ask for that pass. Always read the
            suggestion before accepting it.
          </p>
          <h2>What is sent and stored</h2>
          <ul>
            <li>Local checks do not call TextHelper&apos;s API or Groq.</li>
            <li>
              The optional AI request sends the text in the box at the moment you click to TextHelper&apos;s
              API, which forwards it to Groq for that request.
            </li>
            <li>Your custom dictionary stays in this browser&apos;s IndexedDB on your device.</li>
          </ul>
          <h2>Limitations</h2>
          <ul>
            <li>This is not a full professional proofreader. The local lists are curated, not exhaustive.</li>
            <li>
              If you edit the text after a suggestion is generated, accepting a now-stale suggestion is
              refused rather than applied to the wrong place - run the check again.
            </li>
            <li>No automated pass catches every error. Proofread important writing yourself.</li>
          </ul>
        </>
      }
    >
      <GrammarCheckerWorkspace />
    </ToolPageLayout>
  );
}
