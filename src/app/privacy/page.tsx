import Link from "next/link";
import { siteConfig, adsenseConfig, analyticsConfig } from "@/lib/config/site";
import { TOOLS } from "@/lib/registry/tools";
import { pageMetadata } from "@/lib/seo/metadata";
import { AdPrivacyChoices } from "@/components/privacy/ad-privacy-choices";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How TextHelper handles your text and data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="container-page max-w-2xl py-10 prose-tool">
      <h1 className="text-2xl font-semibold">Privacy</h1>
      <p className="text-sm text-muted-foreground">Last updated: 9 November 2026.</p>

      <h2 className="text-lg font-semibold">Tools that run locally in your browser</h2>
      <p>
        These tools process the text in your browser. They do not send that text to {siteConfig.name} or to Groq:
      </p>
      <ul>
        {TOOLS.filter((tool) => tool.kind === "local").map((tool) => (
          <li key={tool.slug}>
            <Link href={`/tools/${tool.slug}`} className="text-primary underline">{tool.title}</Link>
          </li>
        ))}
      </ul>
      <p>
        Grammar Checker and AI Writing Pattern Analysis are in that list. Each can also send the text you
        submit to Groq, and only after you click the control that asks for the AI suggestion or explanation.
        The counts and style statistics themselves stay in the browser.
      </p>

      <h2 className="text-lg font-semibold">Tools that send text to Groq</h2>
      <p>
        These tools send the text you submit to{" "}
        <a href="https://groq.com/privacy-policy" target="_blank" rel="noreferrer" className="text-primary underline">
          Groq
        </a>{" "}
        when you click the generate button. Text is not sent as you type:
      </p>
      <ul>
        {TOOLS.filter((tool) => tool.kind === "ai").map((tool) => (
          <li key={tool.slug}>
            <Link href={`/tools/${tool.slug}`} className="text-primary underline">{tool.title}</Link>
          </li>
        ))}
      </ul>
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

      <h2 className="text-lg font-semibold">Advertising</h2>
      {adsenseConfig.enabled ? (
        <>
          <p>
            Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits
            to this website or other websites. Google&apos;s use of advertising cookies enables it and its
            partners to serve ads based on visits to this site and other sites on the Internet. You can
            control ad personalization in{" "}
            <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-primary underline">
              Google Ad Center
            </a>
            . No other ad vendor is used on this site.
          </p>
          <p>
            For visitors in the EEA, the UK, and Switzerland, ad consent is Google&apos;s European regulations
            message when that message is published in AdSense. This site does not run a second consent tool.
            Use Ad privacy choices below to reopen that message when Google has made it available in your browser.
          </p>
          <AdPrivacyChoices />
        </>
      ) : (
        <p>This site does not currently display advertising.</p>
      )}

      <h2 className="text-lg font-semibold">Analytics</h2>
      {analyticsConfig.measurementId ? (
        <p>
          This site uses{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            Google Analytics
          </a>{" "}
          to understand which pages are visited. Google receives the page address, browser information, and a
          client identifier stored in a cookie. The text you type into a tool is not sent to Google Analytics.
        </p>
      ) : (
        <p>This site does not currently use an analytics service.</p>
      )}

      <h2 className="text-lg font-semibold">Contact</h2>
      <p>
        {siteConfig.name} is published by {siteConfig.publisherName}. Questions about this policy can be
        sent by email to{" "}
        <a href={`mailto:${siteConfig.contactEmail}`} className="text-primary underline">
          {siteConfig.contactEmail}
        </a>
        .
      </p>
    </div>
  );
}
