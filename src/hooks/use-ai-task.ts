"use client";
import { useCallback, useRef, useState } from "react";

export type AITaskStatus = "idle" | "processing" | "success" | "error";

export interface AITaskError {
  message: string;
  code?: string;
  retryAfterSeconds?: number;
}

export function useAITask<TResult = unknown>(taskId: string) {
  const [status, setStatus] = useState<AITaskStatus>("idle");
  const [result, setResult] = useState<TResult | null>(null);
  const [error, setError] = useState<AITaskError | null>(null);
  const [protectedPhraseCheck, setProtectedPhraseCheck] = useState<
    Array<{ phrase: string; preserved: boolean }> | undefined
  >(undefined);
  const controllerRef = useRef<AbortController | null>(null);
  const lastRequestRef = useRef<{ text: string; options: unknown } | null>(null);

  const run = useCallback(
    async (text: string, options: unknown) => {
      controllerRef.current?.abort();
      const controller = new AbortController();
      controllerRef.current = controller;
      lastRequestRef.current = { text, options };
      setStatus("processing");
      setError(null);
      setProtectedPhraseCheck(undefined);

      try {
        const res = await fetch("/api/ai", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ task: taskId, text, options }),
          signal: controller.signal,
        });
        const json = await res.json();
        if (!res.ok) {
          setError({
            message: json.error ?? "Something went wrong.",
            code: json.code ?? json.reason,
            retryAfterSeconds: json.reason ? undefined : undefined,
          });
          setStatus("error");
          return;
        }
        setResult(json.result as TResult);
        setProtectedPhraseCheck(json.protectedPhraseCheck);
        setStatus("success");
      } catch (err) {
        if (controller.signal.aborted) {
          setStatus("idle");
          return;
        }
        setError({ message: err instanceof Error ? err.message : "Network error." });
        setStatus("error");
      }
    },
    [taskId]
  );

  const cancel = useCallback(() => {
    controllerRef.current?.abort();
    setStatus("idle");
  }, []);

  const regenerate = useCallback(() => {
    if (lastRequestRef.current) {
      void run(lastRequestRef.current.text, lastRequestRef.current.options);
    }
  }, [run]);

  return { status, result, error, protectedPhraseCheck, run, cancel, regenerate };
}
