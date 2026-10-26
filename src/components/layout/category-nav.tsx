"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import * as DropdownPrimitive from "@radix-ui/react-dropdown-menu";
import { ChevronDown } from "lucide-react";
import { CATEGORIES } from "@/lib/registry/categories";
import { getToolsByCategory } from "@/lib/registry/tools";
import { ToolIcon } from "@/components/tools/tool-icon";
import { cn } from "@/lib/utils/cn";

export function CategoryNav() {
  const pathname = usePathname();
  const toolsActive = pathname === "/tools" || pathname.startsWith("/tools/") || pathname.startsWith("/categories/");
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearCloseTimer() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = null;
  }

  function changeOpen(next: boolean) {
    clearCloseTimer();
    setOpen(next);
  }

  useEffect(() => () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  function navClass(active: boolean) {
    return cn("flex min-h-10 items-center gap-1 rounded-xl px-3 text-sm font-semibold transition-colors",
      active ? "bg-accent text-primary" : "text-muted-foreground hover:bg-muted hover:text-foreground");
  }

  function openNow() {
    clearCloseTimer();
    setOpen(true);
  }
  function closeSoon() {
    clearCloseTimer();
    closeTimer.current = setTimeout(() => { closeTimer.current = null; setOpen(false); }, 220);
  }

  return (
    <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
      <Link href="/" aria-current={pathname === "/" ? "page" : undefined} className={navClass(pathname === "/")}>
        Home
      </Link>

      {/* A hover menu must be non-modal: modal mode disables outside pointer events,
          causing the trigger to lose hover and repeatedly open/close. */}
      <DropdownPrimitive.Root modal={false} open={open} onOpenChange={changeOpen}>
        <div onMouseEnter={openNow} onMouseLeave={closeSoon}>
          <DropdownPrimitive.Trigger
            aria-current={toolsActive ? "location" : undefined}
            className={navClass(open || toolsActive)}
          >
            Tools
            <ChevronDown className={cn("h-3.5 w-3.5 transition-transform", open && "rotate-180")} />
          </DropdownPrimitive.Trigger>
          <DropdownPrimitive.Portal>
            <DropdownPrimitive.Content
              onMouseEnter={openNow}
              onMouseLeave={closeSoon}
              sideOffset={8}
              align="center"
              className="z-50 max-h-[calc(100dvh-7rem)] overflow-y-auto w-[min(90vw,66rem)] rounded-2xl border border-border bg-card p-6 shadow-xl"
            >
              <div className="grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-4">
                {CATEGORIES.map((category) => (
                  <div key={category.id}>
                    <Link
                      href={`/categories/${category.id}`}
                      onClick={() => changeOpen(false)}
                      aria-current={pathname === `/categories/${category.id}` ? "page" : undefined}
                      className={cn("inline-block rounded-md px-1.5 py-1 text-xs font-semibold uppercase tracking-wide text-primary hover:bg-accent", pathname === `/categories/${category.id}` && "bg-accent ring-1 ring-primary/30")}
                    >
                      {category.title}
                    </Link>
                    <ul className="mt-2 flex flex-col gap-1.5">
                      {getToolsByCategory(category.id).slice(0, 5).map((tool) => (
                        <li key={tool.slug}>
                          <DropdownPrimitive.Item asChild>
                            <Link
                              href={`/tools/${tool.slug}`}
                              onClick={() => changeOpen(false)}
                              aria-current={pathname === `/tools/${tool.slug}` ? "page" : undefined}
                              className={cn("flex items-center gap-2 rounded-md px-2 py-1 text-sm outline-none hover:bg-accent hover:text-primary data-[highlighted]:bg-accent data-[highlighted]:text-primary", pathname === `/tools/${tool.slug}` ? "bg-accent font-semibold text-primary" : "text-foreground/90")}
                            >
                              <ToolIcon name={tool.icon} className="h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                              {tool.title}
                            </Link>
                          </DropdownPrimitive.Item>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <div className="mt-5 border-t border-border pt-4 text-right">
                <Link href="/tools" onClick={() => changeOpen(false)} aria-current={pathname === "/tools" ? "page" : undefined} className="text-sm font-medium text-primary hover:underline">
                  View all tools &rarr;
                </Link>
              </div>
            </DropdownPrimitive.Content>
          </DropdownPrimitive.Portal>
        </div>
      </DropdownPrimitive.Root>

      <Link href="/about" aria-current={pathname === "/about" ? "page" : undefined} className={navClass(pathname === "/about")}>
        About
      </Link>
    </nav>
  );
}
