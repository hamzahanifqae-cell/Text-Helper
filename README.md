# TextHelper

Your everyday text toolkit. A Next.js (App Router) site with 32 text-processing
tools: counters, grammar/spelling checks, cleanup, case conversion, find/replace,
comparison, list tools, extraction/privacy redaction, formatting/encoding,
readability analysis, and AI-assisted writing tools (humanizer, rewriting
assistants, summarizer, and an experimental writing-pattern analysis tool).

Status: built and tested locally. **Not deployed anywhere.** See
[CPANEL_DEPLOYMENT.md](./CPANEL_DEPLOYMENT.md) for how to deploy when you're
ready, and [LAUNCH_CHECKLIST.md](./LAUNCH_CHECKLIST.md) for what's left before
going live.

## What works right now, and what needs configuration

- **16 tools work with zero configuration**, entirely in the browser, no
  server/AI dependency: word/character/reading-time counters, the grammar
  checker's deterministic checks, text cleaner, case converter, find &
  replace, text compare, list/line tools, text extractor, privacy redactor,
  markdown editor, HTML escape tool, URL encoder/decoder, readability
  checker, keyword density analyzer, and the AI writing-pattern analysis
  tool's core statistics.
- **16 tools require a configured `GROQ_API_KEY`** (and available Groq
  quota) to actually produce output: the AI humanizer, all 13 rewriting
  assistants, the summarizer, the grammar checker's "deeper AI suggestions"
  button, and the writing-pattern tool's optional AI commentary. Without a
  key, these tools render fully and explain clearly that AI features aren't
  configured yet (503, not a crash).
- **The contact form** only sends mail if `CONTACT_SMTP_*` env vars are set;
  otherwise the Contact page shows a plain mailto link or a "not available"
  message - never a broken form.
- **AdSense is off** until `ADSENSE_ENABLED=true` and a real
  `ADSENSE_CLIENT_ID` are set. No placeholder ad units are rendered.

See [TOOL_CHECKLIST.md](./TOOL_CHECKLIST.md) for the full per-tool status.

## Stack

Next.js 15 (App Router, TypeScript, Tailwind CSS v4), Radix UI primitives
(hand-styled, not a vendored shadcn copy, same approach/accessibility
guarantees), `groq-sdk` behind a provider adapter, Zod validation, `idb`
(IndexedDB) for optional local drafts/history/dictionary, `diff` for
comparisons, `marked` + `dompurify` for sanitized Markdown preview, `mammoth`
for `.docx` import, `docx` for `.docx` export, `pdf-lib` for `.pdf` export,
Vitest for unit tests, Playwright for end-to-end tests.

Deliberately NOT used: a database, Redis, any local LLM/Ollama, Java-based
LanguageTool, or any other persistent heavyweight service - the hosting
target is a 1GB shared cPanel account.

## Local setup

```bash
npm install
cp .env.example .env.local   # fill in GROQ_API_KEY to enable AI tools (optional)
npm run dev
```

Open http://localhost:3000. The site works fully for local/instant tools
with no `.env.local` at all.

### Environment variables

See [.env.example](./.env.example) for the full list with explanations.
The only one you need for AI tools is `GROQ_API_KEY` (get a free one at
https://console.groq.com/keys) - everything else has a sane default.

Before relying on the defaults in production, check Groq's current model
roster and free-tier limits at https://console.groq.com/docs/models and
https://console.groq.com/settings/limits - both can change over time, and
this project does not assume they're fixed or unlimited.

### Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Local dev server |
| `npm run build` | Production build (also copies `public/` and `.next/static/` into `.next/standalone/` via the `postbuild` hook) |
| `npm run start` | Runs the ordinary (non-standalone) production server - fine for local testing |
| `npm run start:standalone` | Runs the actual deployment artifact: `node .next/standalone/server.js` |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright end-to-end tests (starts its own server on port 3412) |
| `npm run prepare-quota-dir` | Creates the AI usage quota ledger directory ahead of time |

## Testing - what was actually run, and the results

All of the following were executed in this environment while building the
project (not just written and assumed to pass):

- **`npm run build`**: succeeds, 0 type errors, 0 lint errors, all 59 routes
  (static + dynamic) build and prerender correctly.
- **`npm test` (Vitest)**: **130/130 tests passing** across 20 files,
  covering: empty input, Unicode/emoji, multiline and large (50k-word)
  input, every text transformation, undo/redo, comparison, grammar
  suggestion range validation (including the "stale range after editing"
  rejection path), word/keyword/readability analysis, Markdown/HTML XSS
  sanitization, import file-type/size validation, the AI task prompt
  builders (including the prompt-injection guard and the authorship-
  percentage scrubber), the `/api/ai` route's request validation / missing-
  config / rate-limit / provider-timeout / provider-rate-limit / success /
  secret-non-leakage paths (all against **mocked** AI calls, as required -
  no real API traffic in automated tests), and the file-based quota
  ledger's limits, refund-on-failure accounting, persistence, and
  concurrent-write atomicity.
- **`npm run test:e2e` (Playwright, Chromium desktop + mobile)**:
  **28/28 tests passing**, run against the actual `.next/standalone`
  deployment artifact (not just `next dev`): navigation and search, 404
  handling, keyboard access to the skip-link, the word counter with
  Unicode/emoji input, the text cleaner's apply+undo flow and its HTML/
  script-stripping behavior (confirming no script execution), theme
  toggle + persistence across reload with no flash, the AI humanizer's
  honest "not configured" banner when no API key is present, the grammar
  checker's local checks working fully without any AI configuration, and
  a no-horizontal-overflow check on mobile viewports for the home and a
  tool page.
- **Manual smoke test** (documented here, not hidden): started the
  production server locally and curled `/`, a local tool page, an AI tool
  page, a nonexistent tool (404), `/privacy`, `/sitemap.xml`, `/robots.txt`,
  `GET /api/ai/status`, `POST /api/ai` with no key configured (503, clear
  message), `POST /api/ai` with an unknown task (400), and `GET /api/contact`
  with no SMTP configured (200, `{"enabled":false}`). Also grepped the
  built client bundle for `GROQ_API_KEY` to confirm it never leaks into
  client-shipped code.
- **No real Groq API call has been made.** There is no `GROQ_API_KEY`
  configured in this environment. Once you add one, do a small, explicit,
  manual smoke test yourself (e.g. open the Paraphrasing Tool, submit one
  short sentence, confirm you get a sensible rewrite and a real token count
  back) before considering AI tools launch-ready. This is the one thing
  that could not be verified here and is **not** assumed to work by magic.

Bug fixes found and corrected *because* these tests were written (left here
deliberately, since it's useful provenance): the number-extraction regex was
mis-grouping trailing commas as part of a plain number; the HTML-tag
remover left `<script>` contents behind as visible text instead of removing
them with the tag; and the AI route's client-cancellation handling missed
the case where the request was already aborted before the abort listener
was attached.

## Project structure

```
src/
  app/                   Routes (pages + API route handlers)
  components/
    ui/                  Button, Input, Select, Tabs, Dialog, etc. (Radix-based)
    layout/               Header, footer, nav, search, theme toggle
    tools/                Shared tool-page building blocks + implementations/
  lib/
    tools/                Pure, dependency-free text-processing functions
    ai/                   Provider adapter, Groq implementation, quota, tasks
    registry/             Tool + category metadata (single source of truth)
    storage/              IndexedDB wrapper (drafts/history/dictionary)
    docx/, pdf/            Browser-side import/export helpers
tests/
  unit/                  Vitest
  e2e/                   Playwright
data/                    AI usage quota ledger (gitignored; created at runtime)
```

## Known limitations (stated plainly, not hidden)

- Grammar/spelling checks are curated heuristics, not a full dictionary -
  see the Grammar Checker's own page for specifics.
- Readability formulas use an approximate English syllable counter.
- The AI Writing Pattern Analysis tool does **not** produce an AI-authorship
  percentage, on purpose - see that tool's page for why.
- PDF export only supports basic Latin-script text (a `pdf-lib` + standard-
  font limitation); it clearly errors rather than producing garbled output
  for unsupported scripts, and suggests `.txt`/`.docx` instead.
- The quota ledger assumes a single Node process (or several processes on
  one machine sharing the same filesystem) - see CPANEL_DEPLOYMENT.md.
