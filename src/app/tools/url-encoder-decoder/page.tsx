import type { Metadata } from "next";
import { getTool } from "@/lib/registry/tools";
import { ToolPageLayout } from "@/components/tools/tool-page-layout";
import { UrlEncodeWorkspace } from "@/components/tools/implementations/url-encode-workspace";

const tool = getTool("url-encoder-decoder")!;

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
          <p>Encode converts text into percent-encoded form safe for use in a URL component (via encodeURIComponent). Decode reverses valid percent-encoded text back to plain text.</p>
          <h2>Limitations</h2>
          <p>Decoding invalid percent-encoded sequences will show a clear error rather than guessing at the intended text.</p>
        </>
      }
    >
      <UrlEncodeWorkspace />
    </ToolPageLayout>
  );
}
