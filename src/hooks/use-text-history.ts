"use client";
import { useCallback, useRef, useState } from "react";

const MAX_HISTORY = 50;

// Lightweight undo/redo stack for a single text value. Pushing a new value
// clears any redo branch, matching standard editor undo semantics.
export function useTextHistory(initial = "") {
  const [value, setValue] = useState(initial);
  const [, forceRender] = useState(0);
  const past = useRef<string[]>([]);
  const future = useRef<string[]>([]);

  const set = useCallback((next: string, { record = true }: { record?: boolean } = {}) => {
    setValue((current) => {
      if (record && next !== current) {
        past.current.push(current);
        if (past.current.length > MAX_HISTORY) past.current.shift();
        future.current = [];
      }
      return next;
    });
    forceRender((n) => n + 1);
  }, []);

  const undo = useCallback(() => {
    setValue((current) => {
      const prev = past.current.pop();
      if (prev === undefined) return current;
      future.current.push(current);
      return prev;
    });
    forceRender((n) => n + 1);
  }, []);

  const redo = useCallback(() => {
    setValue((current) => {
      const next = future.current.pop();
      if (next === undefined) return current;
      past.current.push(current);
      return next;
    });
    forceRender((n) => n + 1);
  }, []);

  const clear = useCallback(() => {
    set("");
  }, [set]);

  const reset = useCallback((next: string) => {
    past.current = [];
    future.current = [];
    setValue(next);
    forceRender((n) => n + 1);
  }, []);

  return {
    value,
    set,
    undo,
    redo,
    clear,
    reset,
    canUndo: past.current.length > 0,
    canRedo: future.current.length > 0,
  };
}
