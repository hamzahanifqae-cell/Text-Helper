"use client";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

type Status = "idle" | "submitting" | "sent" | "error";

export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    setStatus("submitting");
    setError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.get("name"),
          email: data.get("email"),
          message: data.get("message"),
          company: data.get("company"),
        }),
      });
      const json = await res.json();
      if (!res.ok) {
        setError(json.error ?? "Something went wrong. Please try again.");
        setStatus("error");
        return;
      }
      setStatus("sent");
      form.reset();
    } catch {
      setError("Could not reach the server. Please check your connection and try again.");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div className="rounded-md border border-success/30 bg-success/10 p-4 text-sm text-success">
        Thanks - your message has been sent.
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4 max-w-lg">
      <div
        aria-hidden="true"
        style={{ position: "absolute", left: "-9999px", width: "1px", height: "1px", overflow: "hidden" }}
      >
        <label htmlFor="company">Company</label>
        <input id="company" name="company" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className="flex flex-col gap-1.5">
        <Label htmlFor="name">Name</Label>
        <Input id="name" name="name" required maxLength={200} autoComplete="name" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="email">Email</Label>
        <Input id="email" name="email" type="email" required maxLength={200} autoComplete="email" />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="message">Message</Label>
        <Textarea id="message" name="message" required maxLength={5000} rows={6} />
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
      <Button type="submit" disabled={status === "submitting"} className="self-start">
        {status === "submitting" ? "Sending…" : "Send message"}
      </Button>
    </form>
  );
}
