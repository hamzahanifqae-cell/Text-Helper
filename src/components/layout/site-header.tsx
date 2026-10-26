"use client";
import Link from "next/link";
import { Logo } from "@/components/brand/logo";
import { CategoryNav } from "./category-nav";
import { SearchTriggerButton, SearchDialog, useSearchShortcut } from "./search-command";
import { ThemeToggle } from "./theme-toggle";
import { MobileNav } from "./mobile-nav";
import { AllToolsLink } from "./all-tools-link";

export function SiteHeader() {
  const [searchOpen, setSearchOpen] = useSearchShortcut();

  return (
    <header className="site-header sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link href="/" className="flex shrink-0 items-center gap-2.5 font-semibold">
          <Logo />
        </Link>

        <div className="hidden lg:flex lg:flex-1 lg:justify-center">
          <CategoryNav />
        </div>

        <div className="flex items-center gap-2">
          <div className="hidden sm:block">
            <SearchTriggerButton onToggle={() => setSearchOpen((v) => !v)} />
          </div>
          <div className="hidden md:block">
            <AllToolsLink />
          </div>
          <ThemeToggle />
          <MobileNav />
        </div>
      </div>
      <div className="border-t border-border px-4 py-2 sm:hidden">
        <SearchTriggerButton onToggle={() => setSearchOpen((v) => !v)} />
      </div>

      <SearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </header>
  );
}
