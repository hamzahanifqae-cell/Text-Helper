"use client";
import { useEffect, useState } from "react";

declare global {
  interface Window {
    adsbygoogle?: unknown[];
  }
}

// enabled and clientId come from the server render. Reading them from
// process.env inside this client component made the server emit the ad
// markup while the browser bundle saw an empty value and rendered nothing.
export function AdSlot({
  slot,
  className,
  enabled,
  clientId,
}: {
  slot: string;
  className?: string;
  enabled: boolean;
  clientId: string;
}) {
  const active = enabled && clientId.length > 0;
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !active) return;
    try {
      (window.adsbygoogle = window.adsbygoogle || []).push({});
    } catch {
      // AdSense script not loaded yet or blocked - fail silently, no error UI for an ad.
    }
  }, [mounted, active]);

  if (!active) return null;

  return (
    <div className={className} data-ad-container={slot}>
      {mounted ? (
        <ins
          className="adsbygoogle"
          style={{ display: "block" }}
          data-ad-client={clientId}
          data-ad-slot={slot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      ) : null}
    </div>
  );
}
