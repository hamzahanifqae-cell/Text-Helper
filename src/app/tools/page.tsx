import type { Metadata } from "next";
import { AllToolsBrowser } from "@/components/tools/all-tools-browser";

export const metadata: Metadata = {
  title: "All Tools",
  description: "Browse every TextHelper tool: counters, grammar, cleanup, formatting, and AI-assisted writing tools.",
  alternates: { canonical: "/tools" },
};

export default function AllToolsPage() {
  return (
    <div className="container-page py-10 sm:py-14">
      <h1 className="section-heading">All Tools</h1>
      <p className="mt-2 text-muted-foreground">Every tool on TextHelper, searchable and filterable by category.</p>
      <div className="mt-8">
        <AllToolsBrowser />
      </div>
    </div>
  );
}
