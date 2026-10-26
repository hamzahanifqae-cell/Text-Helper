import * as React from "react";
import { cn } from "@/lib/utils/cn";

export const Textarea = React.forwardRef<HTMLTextAreaElement, React.TextareaHTMLAttributes<HTMLTextAreaElement>>(
  ({ className, ...props }, ref) => (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-md border border-input-border bg-card text-card-foreground px-3 py-2 text-sm leading-relaxed placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:opacity-50 resize-y",
        className
      )}
      {...props}
    />
  )
);
Textarea.displayName = "Textarea";
