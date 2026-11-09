import { siteConfig, operatorConfig } from "@/lib/config/site";
import { TOOLS } from "@/lib/registry/tools";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "What TextHelper is, how its tools work, and how it handles your text.",
  path: "/about",
});

export default function AboutPage() {
  const localCount = TOOLS.filter((t) => t.kind === "local").length;
  const aiCount = TOOLS.filter((t) => t.kind === "ai").length;

  return (
    <div className="container-page max-w-2xl py-10 prose-tool">
      <h1 className="text-2xl font-semibold">About {siteConfig.name}</h1>

      <p>
        {siteConfig.name} is a toolkit for everyday text work: counting, cleaning, formatting, comparing,
        and - for the tools marked &quot;AI&quot; - rewriting and summarizing text with the help of an
        external AI model.
      </p>

      <h2 className="text-lg font-semibold">How the tools work</h2>
      <p>
        {localCount} tools run entirely in your browser using ordinary JavaScript - word counts, case
        conversion, cleanup, comparisons, and similar utilities never leave your device. {aiCount} tools send
        the text you submit to an external AI provider to generate a result; we disclose this before your
        first AI request and explain what we retain on the{" "}
        <a href="/privacy" className="text-primary underline">
          Privacy page
        </a>
        .
      </p>

      <h2 className="text-lg font-semibold">What we don&apos;t claim</h2>
      <ul>
        <li>Our grammar checker is not a replacement for a professional proofreading tool - it catches a curated set of common issues and, optionally, AI-generated suggestions, not every possible error.</li>
        <li>The AI Writing Pattern Analysis tool is experimental. It reports writing-style signals, not a calibrated probability that text is AI-generated or human-written.</li>
        <li>The Natural Tone Rewriter changes wording and tone. It is not a tool for evading AI-content detectors or misrepresenting authorship.</li>
        <li>Readability scores and keyword density are informational, not a guarantee of search ranking or audience comprehension.</li>
      </ul>

      <h2 className="text-lg font-semibold">Who publishes this site</h2>
      <p>
        {siteConfig.name} is published by {siteConfig.publisherName}.
        {operatorConfig.contactEmail ? (
          <>
            {" "}
            Email{" "}
            <a href={`mailto:${operatorConfig.contactEmail}`} className="text-primary underline">
              {operatorConfig.contactEmail}
            </a>
            .
          </>
        ) : null}{" "}
        <a href="/contact" className="text-primary underline">
          Contact
        </a>
        .
      </p>
    </div>
  );
}
