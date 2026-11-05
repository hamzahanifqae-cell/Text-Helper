# TextHelper SEO notes

Date of this pass: 5 November 2026. Production domain: `https://texthelper.online`.

These notes describe the local repository after this pass. The live site was not redeployed. A live check on 5 November 2026 still showed the previous word-counter description (“Count words, characters, sentences, and estimate reading/speaking time.”) and still returned HTTP 200 for `http://` and `www` hosts.

Query phrases below are hypotheses about what a page can satisfy. They are not search volumes, and they are not a ranking promise.

## What was verified

Local production build (`SITE_URL=https://texthelper.online npm run build`), then `next start` on port 3456:

- `eslint`, `tsc --noEmit`, and the existing Vitest suite passed: 21 files, 136 tests.
- Prerendered HTML for `/`, `/tools`, `/tools/word-counter`, `/tools/character-counter`, `/tools/case-converter`, `/tools/text-cleaner`, `/tools/reading-time-calculator`, `/categories/counters`, and `/privacy` includes a unique title, meta description, canonical URL on `https://texthelper.online`, matching `og:title`, `og:description`, `og:url`, and Twitter title/description.
- Those tool pages include one `h1`, the worked examples, related-tool links, and JSON-LD `BreadcrumbList` plus `WebApplication`. Category pages include a visible breadcrumb and JSON-LD `BreadcrumbList` plus `CollectionPage`. The homepage includes `WebSite`. No review or rating markup was added.
- Sitemap has 51 URLs, all on `https://texthelper.online`, with no query strings and no `/api/` URLs. `lastmod` is `2026-11-05` on the homepage, `/tools`, 13 category URLs, and 32 tool URLs. `/about`, `/contact`, `/privacy`, and `/terms` omit `lastmod` because their body copy was not changed.
- `robots.txt` allows `/` and points at the sitemap. It does not block `/api/`.
- `/api/ai/status` returned 200 with `X-Robots-Tag: noindex`.
- `/no-such-page` returned 404. Its HTML has `noindex, follow` and no canonical.
- `/tools/word-counter/` returned 308 to `/tools/word-counter`.
- No indexable HTML title is shared by two pages. The category that shared a title with its only tool is now titled “Browse List & Line Tools”; the tool page remains “List & Line Tools”.
- Counting, case, and cleanup examples in the copy were checked against `src/lib/tools/counters.ts`, `caseConversion.ts`, and `cleanup.ts`.

Not verified, because this environment cannot see them:

- Google Search Console coverage, indexing, or performance after the 2 November 2026 sitemap submission.
- CrUX or lab Core Web Vitals scores. No score is claimed here.
- Whether Google has already chosen the apex host as canonical for the `www` and `http` copies.

## Highest-priority findings

Confirmed in code and in the local build:

- Tool pages already had distinct titles and canonicals, but the five task pages people are most likely to search for used one-line descriptions and did not show a worked example.
- The homepage title was a normal string, so the root template could render it as “TextHelper - Your everyday text toolkit | TextHelper”. It is now an absolute title.
- Open Graph and Twitter title, description, and URL were not set per page. They now follow each page’s own title and description.
- The visible breadcrumb stopped before the current page, while the breadcrumb structured data included it. The current page is now visible text.
- The category “List & Line Tools” and the tool “List & Line Tools” had the same title.
- `/api/*` is not a document. Blocking it in `robots.txt` would stop Google from seeing `noindex`. The block was removed. API responses send `X-Robots-Tag: noindex`.
- The tool directory filter does not put the query in the URL, and tool text is not put in the URL or in the analytics snippet. The analytics snippet is a standard page-view config only.

Confirmed on the live host on 5 November 2026, and not fixable safely inside the app:

- `http://texthelper.online/`, `https://www.texthelper.online/`, and `http://www.texthelper.online/` all return 200 with the same canonical, `https://texthelper.online`. A redirect is the strong signal. Doing it in Next.js behind Passenger can loop if the proxy always reports HTTP. Do this in cPanel or the web server. See the host steps below.

Left as-is on purpose:

- Word count, character count, and reading time stay on three pages. They share a calculator, but each page leads with a different result and a different explanation.
- Uppercase, lowercase, sentence case, and title case stay on `/tools/case-converter`.
- Removing extra spaces, empty lines, and HTML tags stays on `/tools/text-cleaner`.
- Existing URLs were not changed, so no new redirects were required.
- AI writing tools are still described as AI. Counters, case conversion, and cleanup are not.

## Changes in this pass

- Distinct descriptions, social metadata, and self-canonicals for every public page, including the 32 tool pages.
- Longer, example-backed copy on the word counter, character counter, case converter, text cleaner, and reading-time calculator. The tool stays above that copy.
- Homepage and `/tools` links to those four tasks, plus footer links.
- Related-tool links on every tool page, using the tool name as the anchor.
- Breadcrumbs on tool and category pages, aligned with the structured data.
- Category titles prefixed with “Browse” so a one-tool category is not titled the same as its tool. The visible category heading is unchanged.
- Sitemap `lastmod` of `2026-11-05` only where the indexed content changed. Update `src/lib/seo/content-updated.ts` when the public copy changes again. Do not set it to the build time.
- 404 title and description, with `noindex`.
- API `X-Robots-Tag: noindex` in `next.config.ts`.

## Page-to-query map

Primary intent is the job the page actually does. Related phrases should land on that same URL.

| URL | Primary intent | Keep on this page |
| --- | --- | --- |
| `/tools/word-counter` | Count words in pasted text | Sentences, paragraphs, lines, and the reading-time estimate |
| `/tools/character-counter` | Count characters with spaces and without spaces | Emoji and accented letters as one character; line breaks |
| `/tools/case-converter` | Change the case of text | Uppercase to lowercase, sentence case, title case, toggle case |
| `/tools/text-cleaner` | Remove extra spaces | Empty lines, duplicate lines, HTML tags, line-break cleanup |
| `/tools/reading-time-calculator` | Estimate reading and speaking time | 200 wpm reading, 130 wpm speaking |
| `/tools/grammar-checker` | Check spelling and simple grammar | Optional AI suggestions, which the page already discloses |
| `/tools/text-summarizer` | Summarize text | Paragraph, bullets, or key points |
| `/tools/paraphrasing-tool` | Reword text | Nearby rewriting tools, linked from the page |
| `/tools/ai-text-humanizer` | Rewrite stiff or AI-sounding text | This one does call the AI provider |
| `/tools/ai-writing-pattern-analysis` | Show experimental style signals | Not an authorship verdict |
| `/` | Find the right text tool | Links onward; it should not replace a tool page |
| `/tools` and `/categories/*` | Browse the set | Hubs, not extra copies of a tool |

The other tool pages keep their existing task: find and replace, compare, lists, extraction, redaction, readability, keyword density, and formatting. Their descriptions still come from each tool’s short description.

## Counting and privacy, as implemented

- Words use Unicode word segmentation. `Hello, world!` is 2 words. `café 👍🏽` is 1 word. `你好世界` is 2 word-like segments and 4 characters in this counter, which can differ from a reader’s own division of Chinese, Japanese, or Thai.
- Characters are graphemes. `Hello, world!` is 13 with spaces and 12 without. Spaces, tabs, and line breaks count only in the with-spaces total. A skin-tone emoji counts as one character here; some platforms count it as more.
- Sentences split on `.`, `!`, and `?`, so abbreviations and decimals can be over-counted. Paragraphs are separated by a blank line. A blank line also counts as a line.
- Reading time is `words / 200` minutes. Speaking time is `words / 130` minutes, rounded up to the next second. 400 words is 2 minutes reading and 3 minutes 5 seconds speaking.
- Sentence case of `HELLO. this is a TEST.` is `Hello. This is a test.` Title case of `the lord of the rings` is `The Lord of the Rings`.
- Remove extra spaces collapses repeated spaces and tabs and trims each line. It does not delete a blank line.
- Local tools (`kind: "local"`) run in the browser. AI tools (`kind: "ai"`) send the submitted text to `/api/ai` when the user runs them. That split is already stated on the homepage and the privacy page.
- Tool text is not written into URLs, and the analytics snippet does not receive it.

## Host redirect to add in cPanel

Keep these as permanent redirects. Do not point every URL at the homepage.

- `http://texthelper.online/*` → `https://texthelper.online/*`
- `http://www.texthelper.online/*` → `https://texthelper.online/*`
- `https://www.texthelper.online/*` → `https://texthelper.online/*`

In cPanel: Domains → Redirects. Type: Permanent (301). Leave the path in place. After it is saved, `https://www.texthelper.online/tools/word-counter` should return 301 to `https://texthelper.online/tools/word-counter`, not to `/`.

## Search Console, after the next deploy

The property `https://texthelper.online` is already verified, and `/sitemap.xml` was submitted on 2 November 2026. Do this only after the new build is actually deployed:

1. Open [Search Console](https://search.google.com/search-console) and select the `https://texthelper.online` property.
2. Use URL inspection on `/`, `/tools/word-counter`, `/tools/character-counter`, `/tools/case-converter`, and `/tools/text-cleaner`. Confirm the rendered HTML shows the new description and example.
3. Request indexing for those five URLs. Do not submit all 51 one by one.
4. Sitemaps: open `/sitemap.xml`. If the last read is still 2 November 2026, choose it and resubmit so the new `lastmod` can be fetched.
5. Pages: watch “Crawled, currently not indexed” and “Duplicate without user-selected canonical”. The `www` and `http` copies should fall away after the host redirect. Until then, the canonical is only a hint.
6. Do not use the Removals tool on tool URLs. Do not add `noindex` to a page you want in search.

## Measurement

Use Search Console Performance, Search results, with the filter Page or Query. Compare the same length of time: the first 28 days after deploy against the 28 days before it. When a full year exists, also compare the same calendar dates a year earlier. Word-counter demand can move with school terms, so a single week is not enough.

Record, without expecting a specific rank:

- Organic clicks and impressions for the site.
- Clicks, impressions, and CTR for `/tools/word-counter`, `/tools/character-counter`, `/tools/case-converter`, and `/tools/text-cleaner`.
- Indexed pages from the Pages report, next to the 51 sitemap URLs.
- Queries that show a tool page for a different task. Point the internal links at the better page; do not create a near-copy.

There is no purchase or signup. Do not treat ad impressions as the SEO conversion. In GA4, use organic landing page and engaged sessions for those four URLs. A later event can record that a tool button was used, but it must not include the text the person pasted.

## Content and promotion backlog

1. Wait for Search Console query data before writing anything new. Improve the page that already matches the query.
2. Add the host redirects above. This is the strongest remaining technical fix.
3. Publish the real operator name and contact on About, Privacy, and Contact when you have them. Do not invent a person or an address.
4. Add one shared social image later. Do not mark it up as a review.
5. If a query needs a longer explanation than the tool page can hold, add one guide and link it from that tool. Do not split “word counter”, “character counter with spaces”, “sentence case”, or “remove extra spaces” onto extra URLs.
6. From sites you actually operate, link to the specific tool when it helps a reader. A footer link farm and directory blasts do not.
7. Do not buy links, exchange links in bulk, or submit the site to dozens of directories.

## Deploy

The first pass was deployed on 5 November 2026. This second pass is local only until the next upload. The usual cPanel package is a zip of `.next/standalone` after `SITE_URL=https://texthelper.online` is set for the build. Rebuild before packaging so this copy is what gets uploaded. Restart the Node app after replacing the files. Leave `~/texthelper-data` in place.

## Second pass, 5 November 2026

Search Console supplied page totals only. No page-filtered query export was included, so the intent for each URL below is a hypothesis. Position and a lack of clicks were not treated as a reason to change a title. Titles and meta descriptions were left as they were.

Live check the same day, before this copy was deployed:

- `https://texthelper.online/tools/active-voice-converter` returned 200, canonical `https://texthelper.online/tools/active-voice-converter`, title “Active Voice Converter | TextHelper”.
- The same path with a trailing slash returned 308 to the URL without the slash. Conclusion generator and formal/informal converter behaved the same way.
- The sitemap lists the versions without a trailing slash. Internal links are built from those paths.

| URL | Evidence used | Change |
| --- | --- | --- |
| `/tools/active-voice-converter` | 55 impressions, average position 85.42. The task prompt rewrites passive voice into active voice and leaves active sentences unchanged. It has no active-to-passive direction. | A note directly above the input states that one direction. The page shows one passive-to-active pair and one already-active pair that stays unchanged. Title unchanged. |
| `/tools/conclusion-generator` | 34 impressions, average position 83.09. The task writes one closing paragraph and is told not to add new claims. | A note above the input says to paste the content, not only a topic. The page shows a short library-hours paragraph and a closing paragraph that only restates it. Title unchanged. |
| `/tools/formal-informal-converter` | 11 impressions, 1 click. The tool has two controls, Make formal and Make informal, with different prompt instructions. | The note above the input and the line under the buttons name both directions. Each direction has its own before-and-after pair. Title “Formal / Informal Converter” unchanged. |

The example sentences illustrate those instructions. They are not stored model outputs, and the pages say a generated result can be worded differently.

Sitemap `lastmod` for those three URLs is `2026-11-05T14:46:00.000Z`. The other tool URLs stay at `2026-11-05T00:00:00.000Z`.

Checked locally after the edit: lint, typecheck, 139 unit tests, and a production build. The prerendered HTML for the three URLs contains the new notes and examples, the same titles, and canonicals on `https://texthelper.online` without a trailing slash.

After the next deploy, in Search Console inspect those three URLs and request indexing. Then filter Performance by each page and read the queries. Change a title only if a query asks for something the page actually does and the current title hides it. The slash URLs should keep consolidating to the URLs without a slash.
