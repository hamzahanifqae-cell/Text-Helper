# Launch checklist

Concise list of what's left before texthelper.online is fully launch-ready.
The site is deployed and live (see Status below) - this tracks the
remaining items, not a pre-deploy plan anymore.

## Required before any real traffic

- [x] Groq API key obtained and set as a server env var.
- [x] Environment variables set on the host via cPanel's Setup Node.js App
      UI (see `.env.example` for the full list).
- [x] Real AI smoke test done against production (Paraphrasing Tool and
      the grammar checker's deep-suggestions path both confirmed working
      against the live Groq API).
- [x] Quota data directory created outside the web root
      (`~/texthelper-data/quota`) with `700` permissions.
- [ ] **Confirm HTTPS/AutoSSL is active** for the real domain - pending on
      DNS propagation finishing (nameservers were changed; not yet fully
      propagated as of the last check).
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
- [x] AdSense: `ADSENSE_ENABLED=true` and `ADSENSE_CLIENT_ID` are set (as
      **build-time** env vars - see CPANEL_DEPLOYMENT.md 2a). `/ads.txt` is
      generated automatically from `ADSENSE_CLIENT_ID` at runtime, no
      manual file needed.
- [ ] **Set up "Privacy & messaging" (Funding Choices) in the AdSense
      dashboard** before serving ads to EEA/UK/Switzerland visitors - this
      project does not implement a custom consent banner; Google's own
      dashboard-configured consent prompt is the supported path, and it
      must be turned on deliberately, not assumed.
- [ ] After the AdSense verification method you chose finishes review,
      confirm live: visit `https://texthelper.online/ads.txt` (should show
      `google.com, pub-XXXX, DIRECT, f08c47fec0942fa0`, not a 404), and
      view-source the homepage for the `adsbygoogle.js` script tag.
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

## Status

- [x] Deployed: `texthelper.online` is live on cPanel (Node 22, Passenger).
- [x] Real AI traffic confirmed working against Groq in production.
- [x] AdSense verification in progress (code snippet method).
- No billing of any kind has been enabled.

See TOOL_CHECKLIST.md for per-tool status and README.md's "Testing" section
for exactly what was run and what passed.
