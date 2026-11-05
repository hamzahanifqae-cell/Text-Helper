import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { TextStatsWorkspace } from "@/components/tools/implementations/text-stats-workspace";
import { toolPageMetadata } from "@/lib/seo/metadata";

const tool = getTool("character-counter")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>Example</h2>
          <p>
            <code>Hello, world!</code> is 13 characters with spaces and 12 without spaces.
            <code>Hello   world</code> is also 13 with spaces, because the three spaces between the words
            all count, and 10 without spaces. <code>café 👍🏽</code> is 6 characters with the space and 5
            without it: é is one character, and the emoji is one character.
          </p>
          <h2>With spaces and without spaces</h2>
          <p>
            Characters are user-perceived characters (graphemes), not raw UTF-16 code units. A line break
            counts in the with-spaces total and is removed from the without-spaces total, along with spaces
            and tabs. For a limit that ignores spaces, use the without-spaces number. For a social post or
            form field that counts every character you can see, use the with-spaces number. Some platforms
            still count emoji as more than one character; this page does not try to copy those rules.
          </p>
          <h2>Selected text</h2>
          <p>Select any portion of your text in the box above to see a character count for just that selection.</p>
        </>
      }
    >
      <TextStatsWorkspace toolSlug={tool.slug} emphasis="characters" />
    </ToolPageLayout>
  );
}
