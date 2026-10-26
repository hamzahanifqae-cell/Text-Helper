"use client";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils/cn";
import { Menu, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { CATEGORIES } from "@/lib/registry/categories";
import { getToolsByCategory } from "@/lib/registry/tools";
import { Button } from "@/components/ui/button";

export function MobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <DialogPrimitive.Root open={open} onOpenChange={setOpen}>
      <DialogPrimitive.Trigger asChild>
        <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open menu">
          <Menu className="h-5 w-5" />
        </Button>
      </DialogPrimitive.Trigger>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40 lg:hidden" />
        <DialogPrimitive.Content
          className="fixed inset-y-0 right-0 z-50 flex w-full max-w-sm flex-col overflow-y-auto bg-card p-5 shadow-xl lg:hidden"
          aria-describedby={undefined}
        >
          <div className="mb-4 flex items-center justify-between">
            <DialogPrimitive.Title className="text-base font-semibold">Browse tools</DialogPrimitive.Title>
            <DialogPrimitive.Close asChild>
              <Button variant="ghost" size="icon" aria-label="Close menu">
                <X className="h-5 w-5" />
              </Button>
            </DialogPrimitive.Close>
          </div>
          <nav className="flex flex-col gap-5">
            <Link href="/tools" onClick={() => setOpen(false)} aria-current={pathname === "/tools" ? "page" : undefined} className={cn("rounded-lg px-3 py-2 text-sm font-semibold text-primary", pathname === "/tools" && "bg-accent")}>
              All Tools
            </Link>
            {CATEGORIES.map((category) => (
              <div key={category.id}>
                <Link
                  href={`/categories/${category.id}`}
                  onClick={() => setOpen(false)}
                  aria-current={pathname === `/categories/${category.id}` ? "page" : undefined}
                  className={cn("rounded-md px-2 py-1 text-sm font-semibold", pathname === `/categories/${category.id}` && "bg-accent text-primary")}
                >
                  {category.title}
                </Link>
                <ul className="mt-2 flex flex-col gap-2 border-l border-border pl-3">
                  {getToolsByCategory(category.id).map((tool) => (
                    <li key={tool.slug}>
                      <Link
                        href={`/tools/${tool.slug}`}
                        onClick={() => setOpen(false)}
                        aria-current={pathname === `/tools/${tool.slug}` ? "page" : undefined}
                        className={cn("block rounded-md px-2 py-1 text-sm hover:bg-accent hover:text-primary", pathname === `/tools/${tool.slug}` ? "bg-accent font-semibold text-primary" : "text-muted-foreground")}
                      >
                        {tool.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </nav>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
