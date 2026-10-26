"use client";
import { createContext, useCallback, useContext, useRef, useState } from "react";
import { cn } from "@/lib/utils/cn";

interface ToastItem {
  id: number;
  message: string;
  variant: "default" | "destructive";
}

interface ToastContextValue {
  toast: (message: string, variant?: ToastItem["variant"]) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const idRef = useRef(0);

  const toast = useCallback((message: string, variant: ToastItem["variant"] = "default") => {
    const id = ++idRef.current;
    setItems((prev) => [...prev, { id, message, variant }]);
    setTimeout(() => {
      setItems((prev) => prev.filter((i) => i.id !== id));
    }, 3200);
  }, []);

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        aria-live="polite"
        role="status"
        className="fixed bottom-4 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className={cn(
              "rounded-md border px-4 py-2 text-sm shadow-lg",
              item.variant === "destructive"
                ? "border-destructive/30 bg-destructive text-destructive-foreground"
                : "border-border bg-card text-card-foreground"
            )}
          >
            {item.message}
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
