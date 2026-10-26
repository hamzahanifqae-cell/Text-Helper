import type { Metadata } from "next";
import { siteConfig, operatorConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms of use for TextHelper.",
  alternates: { canonical: "/terms" },
};

export default function TermsPage() {
  return (
    <div className="container-page max-w-2xl py-10 prose-tool">
      <h1 className="text-2xl font-semibold">Terms of Use</h1>

      <h2 className="text-lg font-semibold">The tools are provided &quot;as is&quot;</h2>
      <p>
        {siteConfig.name}&apos;s tools - including word counts, grammar suggestions, readability scores,
        AI-generated rewrites, summaries, and the experimental AI Writing Pattern Analysis tool - are provided
        for convenience and are not guaranteed to be complete, accurate, or suitable for any particular
        purpose. Review any result before relying on it, especially before using it in a professional,
        academic, or legal context.
      </p>

      <h2 className="text-lg font-semibold">No accuracy or authorship guarantees</h2>
      <ul>
        <li>Grammar, spelling, and readability tools use heuristics and AI assistance; they will miss some issues and occasionally flag non-issues.</li>
        <li>AI-generated rewrites, summaries, and other AI tool output may contain mistakes and should be reviewed before use.</li>
        <li>The AI Writing Pattern Analysis tool does not determine, and must not be treated as proof of, whether text was written by a human or an AI.</li>
        <li>The AI Text Humanizer is a writing-quality tool; it is not a guarantee of evading any AI-content detector, and we make no claim that its output will do so.</li>
      </ul>

      <h2 className="text-lg font-semibold">Acceptable use</h2>
      <p>
        Don&apos;t use {siteConfig.name} to process content that is illegal, infringing, or that you don&apos;t
        have the right to process. Don&apos;t attempt to abuse, overload, or circumvent the rate limits of the
        AI tools.
      </p>

      <h2 className="text-lg font-semibold">AdSense and advertising</h2>
      <p>
        We do not guarantee acceptance into, or continued participation in, any advertising program (including
        Google AdSense) for this site.
      </p>

      <h2 className="text-lg font-semibold">Changes</h2>
      <p>These terms may be updated from time to time. Continued use of the site after a change constitutes acceptance of the updated terms.</p>

      <h2 className="text-lg font-semibold">Contact</h2>
      <p>
        {operatorConfig.contactEmail
          ? `Questions about these terms can be sent to ${operatorConfig.contactEmail}.`
          : "Operator contact details for this site have not been published yet."}
      </p>
    </div>
  );
}
