import { Loader2, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { AITaskError, AITaskStatus } from "@/hooks/use-ai-task";

export function GenerateControls({
  status,
  error,
  disabled,
  onGenerate,
  onCancel,
  onRegenerate,
  label = "Generate",
}: {
  status: AITaskStatus;
  error: AITaskError | null;
  disabled?: boolean;
  onGenerate: () => void;
  onCancel: () => void;
  onRegenerate: () => void;
  label?: string;
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2">
        {status === "processing" ? (
          <Button onClick={onCancel} variant="secondary">
            <Loader2 className="h-4 w-4 animate-spin" />
            Cancel
          </Button>
        ) : (
          <Button onClick={onGenerate} disabled={disabled}>
            {label}
          </Button>
        )}
        {status === "success" && (
          <Button onClick={onRegenerate} variant="outline" size="sm">
            <RotateCcw className="h-3.5 w-3.5" />
            Regenerate
          </Button>
        )}
      </div>
      {status === "error" && error && (
        <p className="flex items-start gap-1.5 text-sm text-destructive">
          <X className="mt-0.5 h-4 w-4 shrink-0" />
          {error.message}
        </p>
      )}
    </div>
  );
}
