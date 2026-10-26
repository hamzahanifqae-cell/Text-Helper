export function categoryColor(category: string): string {
  if (["counters", "cleanup", "lists", "privacy"].includes(category)) return "cobalt";
  if (["grammar", "readability", "summarization"].includes(category)) return "coral";
  if (["compare", "formatting", "case"].includes(category)) return "blue";
  return "navy";
}
