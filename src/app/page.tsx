import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight, Check, FileText, Sparkles, WandSparkles, ShieldCheck, ArrowUpRight } from "lucide-react";
import { getPopularTools, TOOLS, getToolsByCategory } from "@/lib/registry/tools";
import { CATEGORIES } from "@/lib/registry/categories";
import { categoryColor } from "@/lib/registry/tool-colors";
import { ToolCard } from "@/components/tools/tool-card";
import { ToolIcon } from "@/components/tools/tool-icon";
import { AdSlot } from "@/components/ads/ad-slot";
import { buttonVariants } from "@/components/ui/button";
import { siteConfig } from "@/lib/config/site";

export const metadata: Metadata = {
  title: `${siteConfig.name} - ${siteConfig.tagline}`,
  description: siteConfig.description,
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const popular = getPopularTools();
  return (
    <div>
      <section className="hero-section">
        <div className="container-page hero-grid">
          <div>
            <p className="eyebrow"><span className="h-2 w-2 rounded-full bg-primary" /> Writing & editing, made practical</p>
            <h1 className="hero-heading mt-5">Your everyday <br /><em>text toolkit.</em></h1>
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">Find the right words. Clean up the details. From a quick word count to a thoughtful rewrite, make every draft a little better.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/tools" className={buttonVariants({ size: "lg" })}>Browse all tools <ArrowRight className="h-4 w-4" /></Link>
              <Link href="/tools/word-counter" className={buttonVariants({ variant: "outline", size: "lg" })}>Try the word counter</Link>
            </div>
            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-xs text-muted-foreground">
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> No account needed</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> {TOOLS.length} focused tools</span>
              <span className="flex items-center gap-1.5"><Check className="h-3.5 w-3.5 text-primary" /> Your words, your control</span>
            </div>
          </div>
          <div className="hero-preview">
            <div className="mb-5 flex items-center justify-between gap-3 px-1">
              <span className="flex items-center gap-2 text-sm font-semibold"><FileText className="h-4 w-4 text-primary" /> A better first impression</span>
              <span className="rounded-full bg-accent px-2.5 py-1 text-[10px] font-semibold text-primary">EXAMPLE</span>
            </div>
            <div className="preview-paper">
              <div className="mb-5 flex gap-1.5" aria-hidden="true"><span className="h-2 w-2 rounded-full bg-border" /><span className="h-2 w-2 rounded-full bg-border" /><span className="h-2 w-2 rounded-full bg-border" /></div>
              <p>Good writing starts with an idea.<br />A little clarity makes it <span className="preview-highlight">worth sharing.</span></p>
              <div className="mt-7 flex items-center gap-2 border-t border-border pt-4 text-xs text-muted-foreground"><Sparkles className="h-4 w-4 text-primary" /> Less friction. More room for your ideas.</div>
            </div>
            <div className="preview-tools">
              <Link href="/tools/grammar-checker">Check grammar <ArrowUpRight className="ml-1 inline h-3 w-3" /></Link>
              <Link href="/tools/paraphrasing-tool">Refine wording <ArrowUpRight className="ml-1 inline h-3 w-3" /></Link>
              <Link href="/tools/text-cleaner">Clean up text <ArrowUpRight className="ml-1 inline h-3 w-3" /></Link>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-12 sm:py-16">
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div><p className="eyebrow mb-2">Frequently used</p><h2 className="section-heading">Tools for the work in front of you.</h2><p className="mt-2 text-sm text-muted-foreground">A good place to start, whatever you’re working on.</p></div>
          <Link href="/tools" className="flex items-center gap-2 text-sm font-semibold text-primary">View all tools <ArrowRight className="h-4 w-4" /></Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{popular.map(tool => <ToolCard key={tool.slug} tool={tool} />)}</div>
      </section>
      <div className="container-page"><AdSlot slot="home-mid" className="py-6" /></div>

      <section className="border-y border-border bg-muted/40">
        <div className="container-page py-12 sm:py-16">
          <div className="mb-7"><p className="eyebrow mb-2">Browse the toolkit</p><h2 className="section-heading">What are you working on?</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">{CATEGORIES.map(category => {
            const tools = getToolsByCategory(category.id);
            return <Link key={category.id} href={`/categories/${category.id}`} className="category-tile" data-color={categoryColor(category.id)}>
              <span className="tool-card-icon shrink-0"><ToolIcon name={tools[0]?.icon ?? "FileText"} className="h-5 w-5" /></span>
              <div className="min-w-0 flex-1"><h3 className="text-sm font-semibold">{category.title}</h3><p className="mt-1 text-xs text-muted-foreground">{`${tools.length} ${tools.length === 1 ? "tool" : "tools"} to explore`}</p></div><ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
            </Link>;
          })}</div>
        </div>
      </section>
      <section className="container-page py-12 sm:py-16">
        <div className="grid gap-8 rounded-2xl border border-border bg-card p-6 sm:p-9 md:grid-cols-[1fr_1.5fr]">
          <div><p className="eyebrow mb-3"><ShieldCheck className="h-4 w-4" /> Clear by design</p><h2 className="section-heading">Know where<br />your text goes.</h2><Link href="/privacy" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-primary">How we handle your text <ArrowRight className="h-4 w-4" /></Link></div>
          <div className="grid gap-6 sm:grid-cols-2">
            <div><span className="tool-card-icon mb-4"><FileText className="h-5 w-5" /></span><h3 className="font-semibold">Instant tools stay local</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Counters, cleanup, and formatting run in your browser. Your text stays on your device.</p></div>
            <div><span className="tool-card-icon mb-4"><WandSparkles className="h-5 w-5" /></span><h3 className="font-semibold">AI works when you ask</h3><p className="mt-2 text-sm leading-relaxed text-muted-foreground">Writing tools send submitted text to our AI provider. You’ll see a disclosure before you generate.</p></div>
          </div>
        </div>
      </section>
    </div>
  );
}
