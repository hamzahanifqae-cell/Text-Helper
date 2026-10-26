import { marked } from "marked";

marked.setOptions({ gfm: true, breaks: true });

// Renders user-supplied Markdown to sanitized HTML. The sanitize step is not
// optional: Markdown can contain raw HTML (including <script>), so every
// render goes through DOMPurify before it is ever used as innerHTML.
//
// Browser-only by design: DOMPurify's real sanitizer needs a DOM. Using the
// jsdom-backed "isomorphic" build during server rendering pulls in a jsdom
// dependency that fails to bundle cleanly for this page's SSR/prerender
// pass, and there is no need to render Markdown previews on the server
// anyway - callers should only invoke this from a browser-only effect (see
// MarkdownEditorWorkspace), never from render-time code that could run
// during SSR/prerendering.
export async function renderMarkdownSafe(markdownText: string): Promise<string> {
  if (typeof window === "undefined") return "";
  const rawHtml = marked.parse(markdownText, { async: false }) as string;
  const DOMPurify = (await import("dompurify")).default;
  return DOMPurify.sanitize(rawHtml, {
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form"],
    FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover", "style"],
  });
}
