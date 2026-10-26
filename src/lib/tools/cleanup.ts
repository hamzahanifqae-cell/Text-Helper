// Text cleanup transformations. Each function is pure and returns both the
// transformed text and a count of changes made, so the UI can show a
// before/after preview and an undo step (the caller keeps the previous
// version in its own history stack; these functions never mutate in place).

export interface CleanupResult {
  text: string;
  changes: number;
}

export function removeExtraSpaces(text: string): CleanupResult {
  let changes = 0;
  const result = text
    .split("\n")
    .map((line) => {
      const trimmed = line.replace(/[ \t]+/g, (m) => {
        if (m.length > 1) changes++;
        return " ";
      });
      const stripped = trimmed.replace(/^[ \t]+|[ \t]+$/g, (m) => {
        if (m.length > 0) changes++;
        return "";
      });
      return stripped;
    })
    .join("\n");
  return { text: result, changes };
}

export function removeEmptyLines(text: string): CleanupResult {
  const lines = text.split("\n");
  const kept = lines.filter((line) => line.trim().length > 0);
  return { text: kept.join("\n"), changes: lines.length - kept.length };
}

export function removeDuplicateLines(text: string): CleanupResult {
  const lines = text.split("\n");
  const seen = new Set<string>();
  const kept: string[] = [];
  let changes = 0;
  for (const line of lines) {
    const key = line.trim();
    if (key !== "" && seen.has(key)) {
      changes++;
      continue;
    }
    if (key !== "") seen.add(key);
    kept.push(line);
  }
  return { text: kept.join("\n"), changes };
}

export function normalizeLineBreaks(
  text: string,
  options: { collapseBlankLines?: boolean } = {}
): CleanupResult {
  let changes = 0;
  let result = text.replace(/\r\n|\r/g, () => {
    changes++;
    return "\n";
  });
  if (options.collapseBlankLines) {
    result = result.replace(/\n{3,}/g, () => {
      changes++;
      return "\n\n";
    });
  }
  return { text: result, changes };
}

const ZERO_WIDTH_RE = /[​-‍﻿]/g;
const SMART_QUOTES_MAP: Record<string, string> = {
  "‘": "'",
  "’": "'",
  "“": '"',
  "”": '"',
  "–": "-",
  "—": "-",
  "…": "...",
};

export function stripFormattingArtifacts(text: string): CleanupResult {
  let changes = 0;
  let result = text.replace(ZERO_WIDTH_RE, () => {
    changes++;
    return "";
  });
  result = result.replace(/[‘’“”–—…]/g, (m) => {
    changes++;
    return SMART_QUOTES_MAP[m] ?? m;
  });
  return { text: result, changes };
}

export function removeHtmlTags(text: string): CleanupResult {
  let changes = 0;
  // Drop <script> and <style> blocks (tag AND contents) first - leaving
  // their text content behind after stripping only the tags would surface
  // raw JS/CSS source as if it were ordinary text, which is never useful
  // output for a "remove HTML tags" cleanup.
  let result = text.replace(/<(script|style)\b[^>]*>[\s\S]*?<\/\1>/gi, () => {
    changes++;
    return "";
  });
  result = result.replace(/<[^>]*>/g, () => {
    changes++;
    return "";
  });
  result = result
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'");
  return { text: result, changes };
}

export function tabsToSpaces(text: string, tabSize = 4): CleanupResult {
  let changes = 0;
  const spaces = " ".repeat(Math.max(1, tabSize));
  const result = text.replace(/\t/g, () => {
    changes++;
    return spaces;
  });
  return { text: result, changes };
}

export function spacesToTabs(text: string, tabSize = 4): CleanupResult {
  let changes = 0;
  const pattern = new RegExp(` {${Math.max(1, tabSize)}}`, "g");
  const result = text.replace(pattern, () => {
    changes++;
    return "\t";
  });
  return { text: result, changes };
}

export type CleanupOperation =
  | "extraSpaces"
  | "emptyLines"
  | "duplicateLines"
  | "lineBreaks"
  | "formattingArtifacts"
  | "htmlTags"
  | "tabsToSpaces"
  | "spacesToTabs";

export function applyCleanupOperation(text: string, operation: CleanupOperation): CleanupResult {
  switch (operation) {
    case "extraSpaces":
      return removeExtraSpaces(text);
    case "emptyLines":
      return removeEmptyLines(text);
    case "duplicateLines":
      return removeDuplicateLines(text);
    case "lineBreaks":
      return normalizeLineBreaks(text, { collapseBlankLines: true });
    case "formattingArtifacts":
      return stripFormattingArtifacts(text);
    case "htmlTags":
      return removeHtmlTags(text);
    case "tabsToSpaces":
      return tabsToSpaces(text);
    case "spacesToTabs":
      return spacesToTabs(text);
  }
}
