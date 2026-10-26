"use client";
import { useEffect, useRef, useState } from "react";
import { draftsStore } from "@/lib/storage/db";
import { useDebouncedCallback } from "./use-debounced-callback";

// Optional local autosave for a tool's input text, kept entirely in
// IndexedDB on this device. Disabled unless the visitor opts in, since
// autosave is explicitly an "optional" feature per the product spec.
export function useLocalDraft(toolSlug: string, enabled: boolean) {
  const [restored, setRestored] = useState(false);
  const loadedRef = useRef(false);

  const save = useDebouncedCallback((text: string) => {
    if (!enabled) return;
    void draftsStore.save(toolSlug, text);
  }, 800);

  useEffect(() => {
    loadedRef.current = false;
    setRestored(false);
  }, [toolSlug]);

  async function loadDraft(): Promise<string | null> {
    if (loadedRef.current) return null;
    loadedRef.current = true;
    const text = await draftsStore.load(toolSlug);
    setRestored(true);
    return text;
  }

  async function clearDraft() {
    await draftsStore.clear(toolSlug);
  }

  return { saveDraft: save, loadDraft, clearDraft, restored };
}
