"use client";

import { useState } from "react";

type FundingChoices = {
  showRevocationMessage?: () => void;
};

/**
 * Opens Google's European regulations message when that message has been
 * published and its script has defined googlefc. This does not create
 * window.googlefc or load a second consent script.
 */
export function AdPrivacyChoices() {
  const [notice, setNotice] = useState<string | null>(null);

  function openChoices() {
    const fc = (window as Window & { googlefc?: FundingChoices }).googlefc;
    if (typeof fc?.showRevocationMessage === "function") {
      setNotice(null);
      fc.showRevocationMessage();
      return;
    }
    setNotice(
      "Ad privacy choices are not available in this browser yet. You can manage Google ad personalization in Google Ad Center.",
    );
  }

  return (
    <div>
      <button type="button" onClick={openChoices} className="text-left text-sm text-muted-foreground hover:text-foreground">
        Ad privacy choices
      </button>
      {notice ? (
        <p role="status" className="mt-2 max-w-xs text-xs leading-relaxed text-muted-foreground">
          {notice}{" "}
          <a href="https://myadcenter.google.com/" className="underline hover:text-foreground" target="_blank" rel="noreferrer">
            Open Google Ad Center
          </a>
        </p>
      ) : null}
    </div>
  );
}
