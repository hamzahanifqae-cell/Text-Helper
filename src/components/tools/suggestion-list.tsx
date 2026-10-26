import { Check, X, BookPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export interface DisplaySuggestion {
  key: string;
  type: string;
  original: string;
  suggestion: string;
  explanation: string;
}

export function SuggestionList({
  suggestions,
  onAccept,
  onReject,
  onAddToDictionary,
}: {
  suggestions: DisplaySuggestion[];
  onAccept: (key: string) => void;
  onReject: (key: string) => void;
  onAddToDictionary?: (key: string, word: string) => void;
}) {
  if (suggestions.length === 0) {
    return <p className="text-sm text-muted-foreground">No issues found.</p>;
  }
  return (
    <ul className="flex flex-col gap-2">
      {suggestions.map((s) => (
        <li key={s.key} className="flex flex-wrap items-start justify-between gap-3 rounded-md border border-border bg-card p-3">
          <div className="flex-1 text-sm">
            <Badge variant="outline" className="mb-1.5 capitalize">{s.type}</Badge>
            <p>
              <span className="text-destructive line-through">{s.original}</span>
              {" -> "}
              <span className="font-medium text-success">{s.suggestion}</span>
            </p>
            <p className="mt-1 text-xs text-muted-foreground">{s.explanation}</p>
          </div>
          <div className="flex shrink-0 gap-1.5">
            <Button size="sm" variant="secondary" onClick={() => onAccept(s.key)} aria-label="Accept suggestion">
              <Check className="h-3.5 w-3.5" />
            </Button>
            <Button size="sm" variant="ghost" onClick={() => onReject(s.key)} aria-label="Reject suggestion">
              <X className="h-3.5 w-3.5" />
            </Button>
            {onAddToDictionary && (s.type === "spelling" || s.type === "variant") && (
              <Button
                size="sm"
                variant="ghost"
                onClick={() => onAddToDictionary(s.key, s.original)}
                aria-label="Add to custom dictionary"
                title="Add to custom dictionary"
              >
                <BookPlus className="h-3.5 w-3.5" />
              </Button>
            )}
          </div>
        </li>
      ))}
    </ul>
  );
}
