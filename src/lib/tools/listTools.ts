export function sortLines(text: string, direction: "asc" | "desc" = "asc", caseSensitive = false): string {
  const lines = text.split("\n");
  const sorted = [...lines].sort((a, b) => {
    const left = caseSensitive ? a : a.toLocaleLowerCase();
    const right = caseSensitive ? b : b.toLocaleLowerCase();
    return left.localeCompare(right);
  });
  if (direction === "desc") sorted.reverse();
  return sorted.join("\n");
}

export function reverseLineOrder(text: string): string {
  return text.split("\n").reverse().join("\n");
}

export function numberLines(text: string, start = 1, separator = ". "): string {
  const lines = text.split("\n");
  return lines.map((line, i) => `${start + i}${separator}${line}`).join("\n");
}

export function removeDuplicateLineEntries(text: string, caseSensitive = false): string {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const kept: string[] = [];
  for (const line of lines) {
    const key = caseSensitive ? line : line.toLocaleLowerCase();
    if (seen.has(key)) continue;
    seen.add(key);
    kept.push(line);
  }
  return kept.join("\n");
}

export function addPrefix(text: string, prefix: string, skipEmpty = true): string {
  return text
    .split("\n")
    .map((line) => (skipEmpty && line.trim() === "" ? line : prefix + line))
    .join("\n");
}

export function removePrefix(text: string, prefix: string): string {
  if (!prefix) return text;
  return text
    .split("\n")
    .map((line) => (line.startsWith(prefix) ? line.slice(prefix.length) : line))
    .join("\n");
}

export function addSuffix(text: string, suffix: string, skipEmpty = true): string {
  return text
    .split("\n")
    .map((line) => (skipEmpty && line.trim() === "" ? line : line + suffix))
    .join("\n");
}

export function removeSuffix(text: string, suffix: string): string {
  if (!suffix) return text;
  return text
    .split("\n")
    .map((line) => (line.endsWith(suffix) ? line.slice(0, line.length - suffix.length) : line))
    .join("\n");
}
