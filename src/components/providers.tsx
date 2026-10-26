"use client";
import { ThemeProvider } from "@/components/theme/theme-provider";
import { ToastProvider } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <TooltipProvider delayDuration={200}>
        <ToastProvider>{children}</ToastProvider>
      </TooltipProvider>
    </ThemeProvider>
  );
}
