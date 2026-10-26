import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container-page flex min-h-[65vh] flex-col items-center justify-center gap-5 py-20 text-center">
      <span className="rounded-2xl bg-accent px-6 py-4 text-5xl font-bold tracking-tight text-primary">404</span>
      <h1 className="section-heading">We couldn&apos;t find that page</h1>
      <p className="max-w-md text-muted-foreground">
        The page you&apos;re looking for may have been moved or no longer exists. Try one of these instead:
      </p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Link href="/" className={buttonVariants()}>
          Go home
        </Link>
        <Link href="/tools" className={buttonVariants({ variant: "secondary" })}>
          Browse all tools
        </Link>
      </div>
    </div>
  );
}
