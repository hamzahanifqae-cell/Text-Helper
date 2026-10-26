import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { GrammarCheckerWorkspace } from "@/components/tools/implementations/grammar-checker-workspace";

const tool = getTool("grammar-checker")!;

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
          <p>
            As you type or paste text, this tool runs fast, local checks for repeated words, a curated list
            of common misspellings, basic punctuation issues, and US/UK spelling mismatches (your choice).
            Accept or reject each suggestion individually, or add a word to your local custom dictionary to
            stop it from being flagged again. Optionally, click &quot;Get deeper AI suggestions&quot; to have
            an AI model look for context-dependent grammar and clarity issues the local checks can&apos;t
            catch.
          </p>
          <h2>Honesty note</h2>
          <p>
            This is not LanguageTool and does not claim comparable coverage. The local checks only catch a
            curated set of common issues; the AI pass helps with more, but no automated tool catches
            everything. Always proofread important writing yourself.
          </p>
          <h2>Limitations</h2>
          <ul>
            <li>The built-in misspelling and US/UK word lists are curated, not exhaustive dictionaries.</li>
            <li>If you edit the text after a suggestion is generated, accepting a now-stale suggestion is refused rather than applied to the wrong text - re-run the check instead.</li>
            <li>The custom dictionary and its words are stored only in your browser.</li>
          </ul>
        </>
      }
    >
      <GrammarCheckerWorkspace />
    </ToolPageLayout>
  );
}
