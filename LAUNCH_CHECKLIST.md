# Launch checklist

Concise list of what to do, in order, before pointing texthelper.online at
this build. Everything here is currently **not done** in this environment
(no credentials, no deploy) - this is the punch list, not a status report.

## Required before any real traffic

- [ ] **Get a Groq API key** at https://console.groq.com/keys and verify
      the current free-tier model roster/limits at
      https://console.groq.com/docs/models and
      https://console.groq.com/settings/limits (both can change).
- [ ] **Set environment variables on the host**, not in a committed file:
      `GROQ_API_KEY`, `GROQ_MODEL`, `SITE_URL`, `OPERATOR_NAME`,
      `OPERATOR_CONTACT_EMAIL`. See `.env.example` for the full list.
- [ ] **Run one real, manual AI smoke test** after deploying: submit one
      short sentence to the Paraphrasing Tool and confirm you get a
      sensible rewrite, not an error. (Not done in this environment - no
      key was available.)
- [ ] **Create the quota data directory** outside the public web root with
      correct write permissions (`QUOTA_DATA_DIR`) - see
      CPANEL_DEPLOYMENT.md step 8.
- [ ] **Confirm HTTPS/AutoSSL is active** for the real domain.
- [ ] **Decide on the contact method**: either set `CONTACT_SMTP_*` env
      vars for a working form, or set `OPERATOR_CONTACT_EMAIL` for a
      mailto fallback. Don't leave both unset in production.

## Strongly recommended before launch

- [ ] Fill in real `OPERATOR_NAME` / `OPERATOR_CONTACT_EMAIL` /
      `OPERATOR_ADDRESS` so About/Privacy/Terms stop saying "not published
      yet."
- [ ] Read through `/privacy` and `/terms` yourself and confirm the
      AI-provider disclosure (currently pointing at Groq's published
      privacy policy) still matches whichever provider/model you've
      actually configured.
- [ ] If your audience is subject to GDPR/UK GDPR, CCPA, or similar: this
      project does not claim its cookie/consent handling satisfies those
      requirements automatically (see the Privacy page's own wording) -
      review your actual consent setup against the rules that apply to
      your audience.
- [ ] Decide whether to enable AdSense now or later. If now: apply for
      AdSense separately (this project makes no claim about approval
      odds), then set `ADSENSE_ENABLED=true` and `ADSENSE_CLIENT_ID`, and
      add a real `public/ads.txt` with your actual publisher ID (do not
      invent one).
- [ ] Spot-check a handful of tool pages on an actual phone, not just the
      Playwright mobile-viewport tests.

## Nice to have, not blocking

- [ ] Add a visible "local history" panel per tool (storage layer already
      exists - see TOOL_CHECKLIST.md item 3).
- [ ] Add a dedicated "clear all local data" control somewhere visible
      (the function `clearAllLocalData()` already exists in
      `src/lib/storage/db.ts`; it just isn't wired to a settings UI yet).
- [ ] Consider raising/lowering `AI_DAILY_REQUEST_LIMIT` /
      `AI_DAILY_TOKEN_LIMIT` once you have a sense of real traffic versus
      your actual Groq plan limits.

## Explicitly NOT done by this build, by design (your call, not an oversight)

- No code has been pushed, published, or deployed anywhere.
- No billing of any kind has been enabled.
- No AdSense application has been submitted.
- No real API traffic has been sent to Groq.

See TOOL_CHECKLIST.md for per-tool status and README.md's "Testing" section
for exactly what was run and what passed.
