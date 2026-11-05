import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { CaseConverterWorkspace } from "@/components/tools/implementations/case-converter-workspace";
import { toolPageMetadata } from "@/lib/seo/metadata";

const tool = getTool("case-converter")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>Paste text and click a case style to apply it immediately. Use undo above the editor to revert. Uppercase, lowercase, and sentence case are all on this page.</p>
          <h2>Examples</h2>
          <ul>
            <li><code>Hello WORLD</code> in lowercase becomes <code>hello world</code>.</li>
            <li><code>HELLO. this is a TEST.</code> in sentence case becomes <code>Hello. This is a test.</code></li>
            <li><code>the lord of the rings</code> in title case becomes <code>The Lord of the Rings</code>. Small words such as &quot;of&quot; and &quot;the&quot; stay lowercase unless they are first or last.</li>
          </ul>
          <h2>What each style does</h2>
          <ul>
            <li><strong>Uppercase</strong> and <strong>lowercase</strong> change every letter the script can change.</li>
            <li><strong>Sentence case</strong> lowercases the text, then capitalizes the first letter and the first letter after a period, exclamation mark, or question mark.</li>
            <li><strong>Title case</strong> capitalizes each word except common small words (a, the, of, and, and similar) unless that word is first, last, or follows sentence punctuation.</li>
            <li><strong>Toggle case</strong> flips the case of every letter.</li>
          </ul>
          <h2>Limitations</h2>
          <p>Case conversion uses standard Unicode case-folding, so it works for accented Latin, Cyrillic, and Greek text; scripts without a case distinction (CJK, Arabic, etc.) are left unchanged, which is correct.</p>
        </>
      }
    >
      <CaseConverterWorkspace />
    </ToolPageLayout>
  );
}
