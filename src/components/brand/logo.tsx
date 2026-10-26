import { cn } from "@/lib/utils/cn";

/** Open folio: two folded pages with a clear central gutter. */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 48 48" fill="none" className={cn("logo-symbol shrink-0", className)} aria-hidden="true" focusable="false">
      <path d="M5 9L22 15V40L5 33V9Z" fill="var(--foreground)" />
      <path d="M26 15L43 9V33L26 40V15Z" fill="currentColor" />
      <path d="M10 18L17 20.5M10 24L17 26.5M31 20.5L38 18M31 26.5L38 24" stroke="var(--background)" strokeWidth="2" strokeLinecap="square" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return <span className="inline-flex items-center gap-2">
    <LogoMark className={compact ? "h-9 w-9" : "h-10 w-10"} />
    <span className="logo-wordmark">Text<span className="logo-wordmark-helper">Helper</span></span>
  </span>;
}
