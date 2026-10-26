import type { Metadata } from "next";
import { siteConfig, operatorConfig, adsenseConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How TextHelper handles your text and data.",
  alternates: { canonical: "/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-2xl py-10 prose-tool">
      <h1 className="text-2xl font-semibold">Privacy</h1>
      <p className="text-sm text-muted-foreground">Last updated: see the date this page was last published.</p>

      <h2 className="text-lg font-semibold">Tools that run locally in your browser</h2>
      <p>
        Most tools on {siteConfig.name} - counters, text cleanup, case conversion, find &amp; replace,
        comparisons, list tools, extraction, and formatting/encoding tools - process your text entirely in
        your browser using JavaScript. That text is never sent to our servers or to any third party by these
        tools.
      </p>

      <h2 className="text-lg font-semibold">Tools that use an AI provider</h2>
      <p>
        Tools labeled &quot;AI&quot; (the humanizer, rewriting assistants, summarizer, and the AI-assisted
        grammar suggestions) send the text you submit to an external AI provider - currently{" "}
        <a href="https://groq.com/privacy-policy" target="_blank" rel="noreferrer" className="text-primary underline">
          Groq
        </a>{" "}
        - in order to generate a result. We only do this when you explicitly click the action button on an
        AI tool; text is not sent automatically as you type.
      </p>
      <p>
        We do not control, and cannot guarantee, how the AI provider itself handles data submitted through
        its API - for that, read the provider&apos;s own policy linked above. If we change which AI provider
        a tool uses, we will update this disclosure before that tool sends text to the new provider.
      </p>

      <h2 className="text-lg font-semibold">What we do on our side</h2>
      <ul>
        <li>We do not log the text you submit to AI tools by default.</li>
        <li>We do not cache or store your submitted text on our servers by default.</li>
        <li>
          We keep a small, non-identifying usage ledger (request and token counts per day, and a per-IP
          request count for abuse prevention) purely to enforce usage limits - it does not contain your
          submitted text.
        </li>
        <li>
          Draft text, local history, and your custom dictionary are optional and stored only in your
          browser&apos;s IndexedDB, on your device. We never see this data, and you can delete it at any time
          from a tool&apos;s settings.
        </li>
        <li>No submitted text is ever placed in a URL, and there are no public pages that expose anyone&apos;s tool input or output.</li>
      </ul>

      <h2 className="text-lg font-semibold">Contact form</h2>
      <p>
        If you use the contact form, we receive the name, email address, and message you provide, solely to
        respond to you.
      </p>

      <h2 className="text-lg font-semibold">Advertising</h2>
      <p>
        {adsenseConfig.enabled
          ? "This site displays advertising, which may use cookies or similar technology to show relevant ads. See your browser or ad settings to control ad personalization."
          : "This site does not currently display advertising."}{" "}
        We do not claim that any cookie banner or consent mechanism on this site automatically satisfies every
        legal requirement that may apply to visitors in your location - if you operate this site for an
        audience subject to specific consent rules (e.g. GDPR/UK GDPR or similar), confirm your consent setup
        meets those rules directly.
      </p>

      <h2 className="text-lg font-semibold">Contact</h2>
      <p>
        {operatorConfig.contactEmail
          ? `Questions about this policy can be sent to ${operatorConfig.contactEmail}.`
          : "Operator contact details for this site have not been published yet."}
      </p>
    </div>
  );
}
