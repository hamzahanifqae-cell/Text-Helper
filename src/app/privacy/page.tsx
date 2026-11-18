import Link from "next/link";
import { siteConfig, adsenseConfig, analyticsConfig } from "@/lib/config/site";
import {
  getAiTools,
  getOptionalAiLocalTools,
  getPureLocalTools,
} from "@/lib/registry/tools";
import { pageMetadata } from "@/lib/seo/metadata";
import { AdPrivacyChoices } from "@/components/privacy/ad-privacy-choices";

export const metadata = pageMetadata({
  title: "Privacy",
  description: "How TextHelper handles your text and data.",
  path: "/privacy",
});

export default function PrivacyPage() {
  const pureLocal = getPureLocalTools();
  const optionalAiLocal = getOptionalAiLocalTools();
  const aiTools = getAiTools();

  return (
    <div className="container-page max-w-2xl py-10 prose-tool">
      <h1 className="text-2xl font-semibold">Privacy</h1>
      <p className="text-sm text-muted-foreground">Last updated: 18 November 2026.</p>

      <h2 className="text-lg font-semibold">Tools that stay in your browser</h2>
      <p>
        These tools process the text only in your browser. They do not send that text to {siteConfig.name} or
        to Groq:
      </p>
      <ul>
        {pureLocal.map((tool) => (
          <li key={tool.slug}>
            <Link href={`/tools/${tool.slug}`} className="text-primary underline">
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold">Local tools with an optional AI request</h2>
      <p>
        These tools run their main checks or statistics in your browser. An optional control sends the text
        you submit to {siteConfig.name}&apos;s <code>/api/ai</code> endpoint only when you click it. That
        request is then forwarded to{" "}
        <a href="https://groq.com/privacy-policy" target="_blank" rel="noreferrer" className="text-primary underline">
          Groq
        </a>
        . Text is not sent while you type. A short notice appears above that control before you click:
      </p>
      <ul>
        {optionalAiLocal.map((tool) => (
          <li key={tool.slug}>
            <Link href={`/tools/${tool.slug}`} className="text-primary underline">
              {tool.title}
            </Link>
            {tool.slug === "grammar-checker"
              ? " — local spelling, punctuation, repeated-word, and US/UK checks; optional “Get deeper AI suggestions.”"
              : " — local writing-style statistics; optional “Get AI commentary.”"}
          </li>
        ))}
      </ul>

      <h2 className="text-lg font-semibold">Tools that send text when you generate</h2>
      <p>
        These tools send the text you submit to {siteConfig.name}&apos;s <code>/api/ai</code> endpoint when
        you click generate or rewrite. That request is then forwarded to{" "}
        <a href="https://groq.com/privacy-policy" target="_blank" rel="noreferrer" className="text-primary underline">
          Groq
        </a>
        . Text is not sent as you type:
      </p>
      <ul>
        {aiTools.map((tool) => (
          <li key={tool.slug}>
            <Link href={`/tools/${tool.slug}`} className="text-primary underline">
              {tool.title}
            </Link>
          </li>
        ))}
      </ul>
      <p>
        We do not control how Groq handles data submitted through its API, including whether Groq logs or
        retains request text. For that, read Groq&apos;s own policy linked above. If we change which AI
        provider a tool uses, we will update this disclosure before that tool sends text to the new provider.
      </p>

      <h2 className="text-lg font-semibold">What this application does</h2>
      <ul>
        <li>
          The application code does not write the text from AI requests into the usage ledger, and it does
          not keep an application-level cache of submitted tool text.
        </li>
        <li>
          The usage ledger stores request and token counts per day, and a per-IP request count for abuse
          prevention. That ledger does not contain your submitted text.
        </li>
        <li>
          Draft text, optional local history, and your custom dictionary (where a tool offers them) are
          stored only in your browser&apos;s IndexedDB on your device. Clearing site data in the browser
          removes them.
        </li>
        <li>
          No submitted text is placed in a URL, and there are no public pages that expose anyone&apos;s tool
          input or output.
        </li>
      </ul>
      <p>
        This page describes {siteConfig.name}&apos;s application behavior. It does not claim that the hosting
        provider never writes request bodies to access or error logs, and it does not claim that Groq never
        logs or retains request text. Those systems are outside this application&apos;s code.
      </p>

      <h2 className="text-lg font-semibold">Advertising</h2>
      {adsenseConfig.enabled ? (
        <>
          <p>
            This site loads Google AdSense (<code>adsbygoogle.js</code>) when advertising is enabled, and
            publishes an <code>ads.txt</code> record for Google only. Third-party vendors, including Google,
            use cookies to serve ads based on a user&apos;s prior visits to this website or other websites.
            Google&apos;s use of advertising cookies enables it and its partners to serve ads based on visits
            to this site and other sites on the Internet. You can control ad personalization in{" "}
            <a href="https://myadcenter.google.com/" target="_blank" rel="noreferrer" className="text-primary underline">
              Google Ad Center
            </a>
            . No other ad vendor is configured in this application.
          </p>
          <p>
            For visitors in the EEA, the UK, and Switzerland, ad consent is handled by Google&apos;s European
            regulations message when that message is published for this site in AdSense. This application does
            not embed a second consent manager. The Ad privacy choices control below calls Google&apos;s
            reopen function when Google has loaded it in the browser; otherwise it links to Google Ad Center.
          </p>
          <AdPrivacyChoices />
        </>
      ) : (
        <p>This site does not currently display advertising.</p>
      )}

      <h2 className="text-lg font-semibold">Analytics</h2>
      {analyticsConfig.measurementId ? (
        <p>
          This site loads Google&apos;s gtag.js with measurement ID {analyticsConfig.measurementId} and a
          standard page-view config. That tag is used to understand which pages are visited. Google may
          receive the page address, browser information, and a client identifier stored in a cookie. The text
          you type into a tool is not included in that page-view config. See{" "}
          <a
            href="https://policies.google.com/privacy"
            target="_blank"
            rel="noreferrer"
            className="text-primary underline"
          >
            Google&apos;s privacy policy
          </a>{" "}
          for how Google handles Analytics data.
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
