// Case conversion utilities. Operates on Unicode text via standard JS
// case-folding (toLocaleUpperCase/toLocaleLowerCase), which covers accented
// Latin, Cyrillic, Greek, etc. Scripts without a case distinction (CJK,
// Arabic, Devanagari, ...) are left unchanged, which is correct behavior.

const SMALL_WORDS = new Set([
  "a", "an", "and", "as", "at", "but", "by", "for", "from", "if", "in",
  "into", "nor", "of", "on", "onto", "or", "over", "per", "so", "than",
  "the", "to", "up", "via", "vs", "with", "yet",
]);

export function toUpperCase(text: string): string {
  return text.toLocaleUpperCase();
}

export function toLowerCase(text: string): string {
  return text.toLocaleLowerCase();
}

export function toSentenceCase(text: string): string {
  const lower = text.toLocaleLowerCase();
  return lower.replace(/(^\s*[a-zÀ-ɏ])|([.!?]\s+[a-zÀ-ɏ])/g, (m) =>
    m.toLocaleUpperCase()
  );
}

export function toTitleCase(text: string): string {
  return text.replace(/\S+/g, (word, offset: number) => {
    const lower = word.toLocaleLowerCase();
    const isFirst = offset === 0;
    const before = text.slice(0, offset);
    const isAfterTerminal = /[.!?:]\s*$/.test(before);
    const strippedWord = lower.replace(/^[^a-zA-ZÀ-ɏ]+|[^a-zA-ZÀ-ɏ]+$/g, "");
    if (!isFirst && !isAfterTerminal && SMALL_WORDS.has(strippedWord)) {
      return lower;
    }
    return lower.replace(/[a-zA-ZÀ-ɏ]/, (c) => c.toLocaleUpperCase());
  });
}

export function toToggleCase(text: string): string {
  return Array.from(text)
    .map((ch) => {
      const upper = ch.toLocaleUpperCase();
      const lower = ch.toLocaleLowerCase();
      if (ch === upper && ch !== lower) return lower;
      return upper;
    })
    .join("");
}

export type CaseMode = "upper" | "lower" | "sentence" | "title" | "toggle";

export function applyCase(text: string, mode: CaseMode): string {
  switch (mode) {
    case "upper":
      return toUpperCase(text);
    case "lower":
      return toLowerCase(text);
    case "sentence":
      return toSentenceCase(text);
    case "title":
      return toTitleCase(text);
    case "toggle":
      return toToggleCase(text);
  }
}
