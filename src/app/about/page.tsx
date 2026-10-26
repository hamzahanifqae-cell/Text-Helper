import type { Metadata } from "next";
import { siteConfig, operatorConfig } from "@/lib/config/site";
import { TOOLS } from "@/lib/registry/tools";

export const metadata: Metadata = {
  title: "About",
  description: "What TextHelper is, how its tools work, and how it handles your text.",
  alternates: { canonical: "/about" },
};

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
        <li>The AI Text Humanizer improves writing quality; it is not a tool for evading AI-content detectors, and we don&apos;t present it as one.</li>
        <li>Readability scores and keyword density are informational, not a guarantee of search ranking or audience comprehension.</li>
      </ul>

      <h2 className="text-lg font-semibold">Who runs this site</h2>
      {operatorConfig.name ? (
        <p>
          {siteConfig.name} is operated by {operatorConfig.name}. See the{" "}
          <a href="/contact" className="text-primary underline">
            Contact page
          </a>{" "}
          to get in touch.
        </p>
      ) : (
        <p className="text-muted-foreground">
          Operator details for this site have not been published yet.
        </p>
      )}
    </div>
  );
}
