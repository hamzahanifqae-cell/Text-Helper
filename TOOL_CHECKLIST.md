# Tool implementation checklist

Status key: **Done (local)** = fully working now, no server/AI dependency.
**Done (needs API key)** = fully implemented and tested with mocked AI
calls; requires `GROQ_API_KEY` + available Groq quota to actually produce
output at runtime.

## Text Counters (`/categories/counters`)
| Tool | URL | Status |
|---|---|---|
| Word Counter | `/tools/word-counter` | Done (local) |
| Character Counter | `/tools/character-counter` | Done (local) |
| Reading Time Calculator | `/tools/reading-time-calculator` | Done (local) |

Covers: word count, character count with/without spaces, sentence count,
paragraph count, line count, reading time, speaking time, selected-text
stats - all in one shared stats engine, framed three ways for the three
most common search intents.

## Grammar & Spelling (`/categories/grammar`)
| Tool | URL | Status |
|---|---|---|
| Grammar Checker | `/tools/grammar-checker` | Done (local checks); deeper suggestions need API key |

Covers: grammar/spelling/punctuation suggestions, repeated-word detection,
US/UK selection, explanations, accept/reject, local custom dictionary,
range-validated suggestion application.

## AI Text Humanizer (`/categories/humanizer`)
| Tool | URL | Status |
|---|---|---|
| AI Text Humanizer | `/tools/ai-text-humanizer` | Done (needs API key) |

## Rewriting & Writing Assistants (`/categories/rewriting`)
| Tool | URL | Status |
|---|---|---|
| Paraphrasing Tool | `/tools/paraphrasing-tool` | Done (needs API key) |
| Text Simplifier | `/tools/text-simplifier` | Done (needs API key) |
| Text Shortener | `/tools/text-shortener` | Done (needs API key) |
| Text Expander | `/tools/text-expander` | Done (needs API key) |
| Tone Changer | `/tools/tone-changer` | Done (needs API key) |
| Formal/Informal Converter | `/tools/formal-informal-converter` | Done (needs API key) |
| Active Voice Converter | `/tools/active-voice-converter` | Done (needs API key) |
| Flow & Consistency Improver | `/tools/flow-consistency-improver` | Done (needs API key) |
| Inclusive Language Checker | `/tools/inclusive-language-checker` | Done (needs API key) |
| Headline Generator | `/tools/headline-generator` | Done (needs API key) |
| Introduction Generator | `/tools/introduction-generator` | Done (needs API key) |
| Conclusion Generator | `/tools/conclusion-generator` | Done (needs API key) |
| Outline Generator | `/tools/outline-generator` | Done (needs API key) |

All 13 share one generic workspace + a per-task prompt definition
(`src/lib/ai/tasks/rewrite.ts`), so adding a 14th variant is a small,
localized change, not a new subsystem.

## Summarization (`/categories/summarization`)
| Tool | URL | Status |
|---|---|---|
| Text Summarizer | `/tools/text-summarizer` | Done (needs API key) |

Covers: short/bullet/key-point formats, adjustable length.

## AI Writing Analysis (`/categories/ai-detection`) - experimental
| Tool | URL | Status |
|---|---|---|
| AI Writing Pattern Analysis | `/tools/ai-writing-pattern-analysis` | Done (local); optional AI commentary needs API key |

Deliberately does **not** produce an AI-generated-content percentage - see
"Experimental AI-writing assessment" in the main spec and the tool's own
page copy for the reasoning. Core statistics (burstiness, vocabulary
variety, transition-word density, repeated sentence starters) are
computed locally with zero AI dependency and zero cost.

## Readability & Analysis (`/categories/readability`)
| Tool | URL | Status |
|---|---|---|
| Readability Checker | `/tools/readability-checker` | Done (local) |
| Keyword Density Analyzer | `/tools/keyword-density-analyzer` | Done (local) |

Covers: Flesch Reading Ease, Flesch-Kincaid Grade Level, Gunning Fog,
average word/sentence length, long-sentence highlights, difficult-word
suggestions, word frequency, repeated phrases, vocabulary variety, keyword
occurrence/density.

## Text Cleanup (`/categories/cleanup`)
| Tool | URL | Status |
|---|---|---|
| Text Cleaner | `/tools/text-cleaner` | Done (local) |

Covers all 8 listed operations (extra spaces, empty lines, duplicate
lines, line-break normalization, pasted-formatting artifacts, HTML tags,
tabs<->spaces), each undoable.

## Case Conversion (`/categories/case`)
| Tool | URL | Status |
|---|---|---|
| Case Converter | `/tools/case-converter` | Done (local) |

Covers: uppercase, lowercase, sentence case, title case, toggle case.

## Find, Replace & Comparison (`/categories/compare`)
| Tool | URL | Status |
|---|---|---|
| Find and Replace | `/tools/find-and-replace` | Done (local) |
| Text Compare | `/tools/text-compare` | Done (local) |

Covers: case-sensitive/whole-word matching, replacement preview,
word-level and line-level diff with highlighted additions/deletions.

## List & Line Tools (`/categories/lists`)
| Tool | URL | Status |
|---|---|---|
| List & Line Tools | `/tools/list-line-tools` | Done (local) |

Covers: alphabetical sort (A-Z/Z-A), reverse order, number lines, remove
duplicates, add/remove prefix, add/remove suffix.

## Extraction & Privacy (`/categories/privacy`)
| Tool | URL | Status |
|---|---|---|
| Text Extractor | `/tools/text-extractor` | Done (local) |
| Privacy Redactor | `/tools/privacy-redactor` | Done (local) |

Covers: extract emails/URLs/hashtags/numbers; find & redact recognizable
emails and phone numbers, with an explicit "not a guarantee of complete
anonymization" disclosure on the page.

## Formatting & Encoding (`/categories/formatting`)
| Tool | URL | Status |
|---|---|---|
| Markdown Editor | `/tools/markdown-editor` | Done (local) |
| HTML Escape / Unescape | `/tools/html-escape-tool` | Done (local) |
| URL Encoder / Decoder | `/tools/url-encoder-decoder` | Done (local) |

Markdown preview is sanitized (DOMPurify) before being rendered as HTML -
verified with an automated XSS test (script tags and `onerror` handlers
are stripped, not executed).

## Shared editor features (not a single tool - built into every tool page)
| Feature | Status |
|---|---|
| Undo/redo | Done - `useTextHistory`, used by every workspace |
| Clear input | Done |
| Optional local autosave | Done - toggle per tool, IndexedDB-backed |
| Optional local history | Done (`historyStore` in `src/lib/storage/db.ts`) - not yet wired into every tool's UI as a visible panel; the storage layer and API are ready |
| Delete saved local data | Partially done - `clearAllLocalData()` exists; no dedicated "Privacy settings" page exposes a single button for it yet (see Launch Checklist) |
| Keyboard accessibility | Done - Radix primitives throughout, verified with a Playwright keyboard-nav test |
| Responsive layouts | Done - verified with Playwright mobile-viewport overflow tests |
| Tool search | Done - Cmd/Ctrl+K command palette + `/tools` filter |
| Light/dark mode, no flash | Done - verified with a Playwright reload test |
| Import TXT/DOCX, Export TXT/DOCX/PDF, Copy | Done |

## Backend / cross-cutting
| Item | Status |
|---|---|
| Provider adapter (swap AI provider without rewriting tools) | Done - `src/lib/ai/provider.ts` |
| Groq implementation | Done - `src/lib/ai/providers/groq.ts` |
| Per-task Zod validation | Done |
| Input/output limits, timeouts | Done |
| Cancellation (client + server) | Done |
| Bounded concurrency | Done - `src/lib/ai/concurrency.ts` |
| Site-wide + per-IP quota, file-based, atomic, restart-safe | Done - `src/lib/ai/quota.ts`, tested for atomicity under concurrent writes |
| Clear config/rate-limit/timeout error messages | Done |
| Prompt-injection guard on every AI task | Done |
| Protected-phrase preservation check (best-effort + honest reporting) | Done |
| Contact form (real SMTP) with graceful fallback | Done |
| AdSense scaffolding, off by default, no fake IDs | Done |
| Sitemap, robots.txt, canonical URLs | Done |
| Custom 404 | Done |

## Remaining blockers before a real launch

1. **No `GROQ_API_KEY` has been configured or tested against the live
   Groq API in this environment.** All AI-task logic is implemented and
   unit-tested with mocked calls; a real smoke test with a key is still
   needed (see README "Testing").
2. **Operator identity/contact/address are blank** (`OPERATOR_NAME`,
   `OPERATOR_CONTACT_EMAIL`, `OPERATOR_ADDRESS`) - About/Privacy/Terms
   pages correctly show "not published yet" rather than inventing details,
   but you need to fill these in before launch.
3. **No local-history UI panel** per tool yet, even though the storage
   layer supports it (see "Shared editor features" above) - low effort to
   add if you want it for v1.
4. **cPanel Node runner specifics are unconfirmed** - see
   CPANEL_DEPLOYMENT.md's "What you must confirm before deploying" section.
5. **AdSense has not been applied for** - nothing in this codebase
   guarantees or claims approval.
