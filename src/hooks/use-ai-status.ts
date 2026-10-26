"use client";
import { useEffect, useState } from "react";

interface AIStatus {
  configured: boolean;
  quotaAvailable: boolean;
  model: string | null;
}

export function useAIStatus() {
  const [status, setStatus] = useState<AIStatus | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/ai/status")
      .then((res) => res.json())
      .then((json) => {
        if (!cancelled) setStatus(json);
      })
      .catch(() => {
        if (!cancelled) setStatus({ configured: false, quotaAvailable: false, model: null });
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return status;
}
