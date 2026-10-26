export interface Match {
  start: number;
  end: number;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export interface FindOptions {
  caseSensitive?: boolean;
  wholeWord?: boolean;
}

export function findMatches(text: string, query: string, options: FindOptions = {}): Match[] {
  if (!query) return [];
  const flags = options.caseSensitive ? "g" : "gi";
  const pattern = options.wholeWord ? `\\b${escapeRegExp(query)}\\b` : escapeRegExp(query);
  const re = new RegExp(pattern, flags);
  const matches: Match[] = [];
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    matches.push({ start: m.index, end: m.index + m[0].length });
    if (m[0].length === 0) re.lastIndex++;
  }
  return matches;
}

export interface ReplaceResult {
  text: string;
  count: number;
  matches: Match[];
}

export function replaceAll(
  text: string,
  query: string,
  replacement: string,
  options: FindOptions = {}
): ReplaceResult {
  const matches = findMatches(text, query, options);
  if (matches.length === 0) return { text, count: 0, matches: [] };
  let result = "";
  let lastIndex = 0;
  for (const { start, end } of matches) {
    result += text.slice(lastIndex, start) + replacement;
    lastIndex = end;
  }
  result += text.slice(lastIndex);
  return { text: result, count: matches.length, matches };
}
