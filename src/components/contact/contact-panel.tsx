"use client";

import { useEffect, useState } from "react";
import { ContactForm } from "@/components/contact/contact-form";

type Availability = "loading" | "form" | "unavailable";

export function ContactPanel({ contactEmail }: { contactEmail: string }) {
  const [availability, setAvailability] = useState<Availability>("loading");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/contact")
      .then(async (response) => {
        if (!response.ok) return "unavailable" as const;
        const body = (await response.json()) as { enabled?: boolean };
        return body.enabled ? ("form" as const) : ("unavailable" as const);
      })
      .catch(() => "unavailable" as const)
      .then((next) => {
        if (!cancelled) setAvailability(next);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (availability === "loading") {
    return <p className="text-sm text-muted-foreground">Checking whether the contact form can send mail…</p>;
  }

  if (availability === "form") {
    return <ContactForm />;
  }

  return (
    <div className="max-w-xl text-sm leading-relaxed">
      <p>The contact form cannot send mail from this server yet, so a message entered here would not be delivered.</p>
      {contactEmail ? (
        <p className="mt-3">
          Email{" "}
          <a href={`mailto:${contactEmail}`} className="text-primary underline">
            {contactEmail}
          </a>
          .
        </p>
      ) : (
        <p className="mt-3">
          A public email address is not listed yet. It will be added here after the publisher confirms the address is monitored.
        </p>
      )}
    </div>
  );
}
