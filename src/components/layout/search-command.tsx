"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { Search } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { TOOLS } from "@/lib/registry/tools";
import { getCategory } from "@/lib/registry/categories";
import { ToolIcon } from "@/components/tools/tool-icon";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

// The global Ctrl/Cmd+K shortcut and the dialog's open state must exist
// exactly once per page. A caller that needs multiple trigger buttons (e.g.
// one for the desktop header row, one for the mobile row) should mount this
// hook once and pass the returned setter to multiple <SearchTriggerButton>
// instances, then render a single <SearchDialog> - never mount more than
// one <SearchDialog>, or the shortcut fires twice and opens two overlapping
// dialogs.
export function useSearchShortcut() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || e.key === "/") {
        const target = e.target as HTMLElement | null;
        const typing = target && ["INPUT", "TEXTAREA"].includes(target.tagName);
        if (e.key === "/" && typing) return;
        e.preventDefault();
        setOpen((v) => !v);
      }
    }
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, []);

  return [open, setOpen] as const;
}

export function SearchTriggerButton({ onToggle, className }: { onToggle: () => void; className?: string }) {
  return (
    <Button
      variant="outline"
      className={cn("w-full justify-start gap-2 text-muted-foreground sm:w-56", className)}
      onClick={onToggle}
      aria-label="Search tools"
    >
      <Search className="h-4 w-4" />
      <span className="hidden sm:inline">Search tools…</span>
      <span className="sm:hidden">Search</span>
      <kbd className="ml-auto hidden rounded border border-border bg-muted px-1.5 py-0.5 text-[10px] sm:inline">
        Ctrl K
      </kbd>
    </Button>
  );
}

export function SearchDialog({ open, onOpenChange }: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const router = useRouter();

  function go(slug: string) {
    onOpenChange(false);
    router.push(`/tools/${slug}`);
  }

  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/40" />
        <DialogPrimitive.Content
          className="fixed left-1/2 top-24 z-50 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
          aria-describedby={undefined}
        >
          <DialogPrimitive.Title className="sr-only">Search tools</DialogPrimitive.Title>
          <Command className="w-full" shouldFilter>
            <Command.Input
              autoFocus
              placeholder="Search tools (e.g. word counter, summarize, paraphrase)…"
              className="w-full border-b border-border bg-transparent px-4 py-3 text-sm outline-none placeholder:text-muted-foreground"
            />
            <Command.List className="max-h-[min(24rem,60dvh)] overflow-y-auto p-2">
              <Command.Empty className="px-3 py-6 text-center text-sm text-muted-foreground">
                No tools found.
              </Command.Empty>
              {TOOLS.map((tool) => (
                <Command.Item
                  key={tool.slug}
                  value={[tool.title, tool.shortDescription, ...(tool.keywords ?? [])].join(" ")}
                  onSelect={() => go(tool.slug)}
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-md px-3 py-2.5 text-sm",
                    "data-[selected=true]:bg-muted"
                  )}
                >
                  <ToolIcon name={tool.icon} className="h-4 w-4 shrink-0 text-primary" />
                  <span className="flex-1">
                    <span className="block font-medium">{tool.title}</span>
                    <span className="block text-xs text-muted-foreground">{getCategory(tool.category)?.title}</span>
                  </span>
                </Command.Item>
              ))}
            </Command.List>
          </Command>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
