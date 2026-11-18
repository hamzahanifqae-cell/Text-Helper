import { siteConfig } from "@/lib/config/site";
import {
  getAiTools,
  getOptionalAiLocalTools,
  getPureLocalTools,
} from "@/lib/registry/tools";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "About",
  description: "What TextHelper is, how its tools work, and how it handles your text.",
  path: "/about",
});

export default function AboutPage() {
  const pureLocalCount = getPureLocalTools().length;
  const optionalAiCount = getOptionalAiLocalTools().length;
  const aiCount = getAiTools().length;

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
        {pureLocalCount} tools run only in your browser. Counters, cleanup, case conversion, compare,
        list tools, extraction, redaction, and formatting stay on your device.
      </p>
      <p>
        {optionalAiCount} tools are local-first: Grammar Checker and AI Writing Pattern Analysis compute
        their main results in the browser. They contact {siteConfig.name}&apos;s API, which forwards text to
        Groq, only after you click the optional AI control. A short notice appears above that control before
        the request.
      </p>
      <p>
        {aiCount} tools send the text you submit to {siteConfig.name}&apos;s API, which forwards it to Groq,
        when you click generate or rewrite. Text is not sent while you type. Details are on the{" "}
        <a href="/privacy" className="text-primary underline">
          Privacy page
        </a>
        .
      </p>

      <h2 className="text-lg font-semibold">What we don&apos;t claim</h2>
      <ul>
        <li>
          The Grammar Checker is not a replacement for a professional proofreading tool. Local checks catch
          a curated set of common issues; the optional AI pass can suggest more, and neither catches every
          error.
        </li>
        <li>
          The AI Writing Pattern Analysis tool is experimental. It reports writing-style signals, not a
          calibrated probability that text is AI-generated or human-written.
        </li>
        <li>
          The Natural Tone Rewriter changes wording and tone. It is not a tool for evading AI-content
          detectors or misrepresenting authorship.
        </li>
        <li>
          Readability scores and keyword density are informational, not a guarantee of search ranking or
          audience comprehension.
        </li>
      </ul>

      <h2 className="text-lg font-semibold">Who publishes this site</h2>
      <p>
        {siteConfig.name} is published by {siteConfig.publisherName}. Email{" "}
        <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary underline">
          {siteConfig.contactEmail}
        </a>
        .{" "}
        <a href="/contact" className="text-primary underline">
          Contact
        </a>
        .
      </p>
    </div>
  );
}
