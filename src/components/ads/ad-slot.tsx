"use client";
import { useEffect, useRef } from "react";
import { adsenseConfig } from "@/lib/config/site";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// Renders nothing at all unless ADSENSE_ENABLED=true and a real
// ADSENSE_CLIENT_ID are configured - there is no placeholder or fake ad
// block shown by default. Intentionally only ever placed on informational
// pages (home, category listings), never inside a tool's workspace: never
// beside the editor, the processing/action button, copy/download controls,
// or an error/empty/loading state.
export function AdSlot({ slot, className }: { slot: string; className?: string }) {
  const ref = useRef<HTMLModElement>(null);
  const enabled = adsenseConfig.enabled && Boolean(adsenseConfig.clientId);

  useEffect(() => {
    if (!enabled) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet or blocked - fail silently, no error UI for an ad.
    }
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div className={className} data-ad-container={slot}>
      <ins
        ref={ref}
        className="adsbygoogle"
        style={{ display: "block" }}
        data-ad-client={adsenseConfig.clientId}
        data-ad-slot={slot}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
