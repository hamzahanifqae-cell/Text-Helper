"use client";
import * as TabsPrimitive from "@radix-ui/react-tabs";
import { cn } from "@/lib/utils/cn";

export const Tabs = TabsPrimitive.Root;

export function TabsList({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.List>) {
  return (
    <TabsPrimitive.List
      className={cn("inline-flex items-center gap-1 rounded-md bg-muted p-1", className)}
      {...props}
    />
  );
}

export function TabsTrigger({ className, ...props }: React.ComponentProps<typeof TabsPrimitive.Trigger>) {
  return (
    <TabsPrimitive.Trigger
      className={cn(
        "inline-flex items-center rounded-sm px-3 py-1.5 text-sm font-medium transition-colors data-[state=active]:bg-card data-[state=active]:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className
      )}
      {...props}
    />
  );
}

export const TabsContent = TabsPrimitive.Content;
