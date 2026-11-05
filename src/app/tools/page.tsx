import Link from "next/link";
import { AllToolsBrowser } from "@/components/tools/all-tools-browser";
import { pageMetadata } from "@/lib/seo/metadata";

export const metadata = pageMetadata({
  title: "All Tools",
  description: "Browse every TextHelper tool: counters, grammar, cleanup, formatting, and AI-assisted writing tools.",
  path: "/tools",
});

export default function AllToolsPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="section-heading">All Tools</h1>
      <p className="mt-2 max-w-2xl text-muted-foreground">Every tool on TextHelper. Filtering happens in the browser and does not create a separate page.</p>
      <p className="mt-3 max-w-2xl text-sm text-muted-foreground">
        Start with the <Link href="/tools/word-counter" className="font-medium text-primary hover:underline">word counter</Link>,{" "}
        <Link href="/tools/character-counter" className="font-medium text-primary hover:underline">character counter</Link>,{" "}
        <Link href="/tools/case-converter" className="font-medium text-primary hover:underline">case converter</Link>, or{" "}
        <Link href="/tools/text-cleaner" className="font-medium text-primary hover:underline">text cleaner</Link>.
      </p>
      <div className="mt-8">
        <AllToolsBrowser />
      </div>
    </div>
  );
}
