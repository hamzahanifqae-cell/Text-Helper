import { cn } from "@/lib/utils/cn";

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: "default" | "outline" | "warning" | "success" }) {
  const variants: Record<string, string> = {
    default: "bg-accent text-accent-foreground",
    outline: "border border-border text-muted-foreground",
    warning: "bg-warning/15 text-warning",
    success: "bg-success/15 text-success",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
