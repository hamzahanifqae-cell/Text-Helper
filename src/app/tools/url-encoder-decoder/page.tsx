import { getTool } from "@/lib/registry/tools";
import { toolPageMetadata } from "@/lib/seo/metadata";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { UrlEncodeWorkspace } from "@/components/tools/implementations/url-encode-workspace";

const tool = getTool("url-encoder-decoder")!;

export const metadata = toolPageMetadata(tool);

export default function Page() {
  return (
    <ToolPageLayout
      tool={tool}
      instructions={
        <>
          <h2>How it works</h2>
          <p>
            Encode converts text into percent-encoded form safe for a URL component (via
            <code>encodeURIComponent</code>). Decode reverses valid percent-encoded text. Everything runs in
            your browser.
          </p>
          <h2>Example</h2>
          <p>
            Encode turns <code>hello world &amp; you</code> into
            <code>hello%20world%20%26%20you</code>. Use this for a query value or path segment, not for an
            entire page URL that already has structure you want to keep.
          </p>
          <h2>Limitations</h2>
          <p>Decoding invalid percent-encoded sequences shows an error instead of guessing.</p>
        </>
      }
    >
      <UrlEncodeWorkspace />
    </ToolPageLayout>
  );
}
