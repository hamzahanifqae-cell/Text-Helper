const HTML_ESCAPE_MAP: Record<string, string> = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

const HTML_UNESCAPE_MAP: Record<string, string> = {
  "&amp;": "&",
  "&lt;": "<",
  "&gt;": ">",
  "&quot;": '"',
  "&#39;": "'",
  "&apos;": "'",
  "&nbsp;": " ",
};

export function escapeHtml(text: string): string {
  return text.replace(/[&<>"']/g, (c) => HTML_ESCAPE_MAP[c] ?? c);
}

export function unescapeHtml(text: string): string {
  return text
    .replace(/&amp;|&lt;|&gt;|&quot;|&#39;|&apos;|&nbsp;/g, (c) => HTML_UNESCAPE_MAP[c] ?? c)
    .replace(/&#(\d+);/g, (_, code: string) => String.fromCodePoint(Number(code)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, code: string) => String.fromCodePoint(parseInt(code, 16)));
}

export interface UrlEncodeResult {
  ok: boolean;
  value: string;
  error?: string;
}

export function urlEncode(text: string): UrlEncodeResult {
  try {
    return { ok: true, value: encodeURIComponent(text) };
  } catch {
    return { ok: false, value: text, error: "Could not encode this text." };
  }
}

export function urlDecode(text: string): UrlEncodeResult {
  try {
    return { ok: true, value: decodeURIComponent(text) };
  } catch {
    return {
      ok: false,
      value: text,
      error: "Invalid percent-encoding - this doesn't look like a valid URL-encoded string.",
    };
  }
}
