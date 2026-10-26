import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CATEGORIES } from "@/lib/registry/categories";

export function SiteFooter() {
  return (
    <footer className="site-footer border-t border-border">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link href="/" className="flex shrink-0 items-center gap-2.5 font-semibold">
            <Logo compact />
          </Link>
          <p className="mt-3 max-w-xs text-sm text-muted-foreground">
            Your everyday text toolkit - counters, grammar help, cleanup, and AI-assisted writing tools.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Categories</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {CATEGORIES.slice(0, 6).map((c) => (
              <li key={c.id}>
                <Link href={`/categories/${c.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">More</h3>
          <ul className="mt-3 flex flex-col gap-2">
            {CATEGORIES.slice(6).map((c) => (
              <li key={c.id}>
                <Link href={`/categories/${c.id}`} className="text-sm text-muted-foreground hover:text-foreground">
                  {c.title}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Company</h3>
          <ul className="mt-3 flex flex-col gap-2">
            <li><Link href="/tools" className="text-sm text-muted-foreground hover:text-foreground">All Tools</Link></li>
            <li><Link href="/about" className="text-sm text-muted-foreground hover:text-foreground">About</Link></li>
            <li><Link href="/contact" className="text-sm text-muted-foreground hover:text-foreground">Contact</Link></li>
            <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground">Privacy</Link></li>
            <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground">Terms</Link></li>
          </ul>
        </div>
      </div>
      <div className="container-page border-t border-border py-5 text-xs text-muted-foreground">
        &copy; {new Date().getFullYear()} TextHelper. All tools on this site are provided &quot;as is&quot; without warranty of accuracy; see our{" "}
        <Link href="/terms" className="underline hover:text-foreground">Terms</Link>.
      </div>
    </footer>
  );
}
