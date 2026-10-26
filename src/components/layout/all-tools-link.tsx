"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils/cn";

export function AllToolsLink() {
  const active = usePathname() === "/tools";
  return <Link href="/tools" aria-current={active ? "page" : undefined}
    className={cn(buttonVariants({ variant: active ? "default" : "secondary", size: "sm" }))}>All Tools</Link>;
}
