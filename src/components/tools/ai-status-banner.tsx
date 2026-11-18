import { Info, AlertTriangle } from "lucide-react";
import Link from "next/link";
import { siteConfig } from "@/lib/config/site";

export function AIDisclosureNote() {
  return (
    <p className="flex items-start gap-2 text-xs text-muted-foreground">
      <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" />
      <span>
        Clicking the button below sends your text to {siteConfig.name}&apos;s API for this request, and that
        request is forwarded to Groq. It is not sent while you type.{" "}
        <Link href="/privacy" className="underline hover:text-foreground">
          Learn how we handle this
        </Link>
        .
      </span>
    </p>
  );
}

export function AIUnavailableBanner({ quotaOnly = false }: { quotaOnly?: boolean }) {
  return (
    <div className="flex items-start gap-2 rounded-md border border-warning/30 bg-warning/10 px-3 py-2.5 text-sm text-warning">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>
        {quotaOnly
          ? "AI tools have reached today's usage limit on this server. Please try again later."
          : "AI tools are not configured on this server yet (no API key set), so this tool can't run right now."}
      </span>
    </div>
  );
}
