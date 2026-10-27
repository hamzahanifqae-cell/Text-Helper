# Deploying TextHelper to a cPanel Node.js hosting account

**Nothing in this repository has been deployed anywhere.** This document
describes how to deploy *when you're ready*, and is explicit about what is
confirmed working (tested in this project) versus what depends on your
specific cPanel host's configuration and must be confirmed before you rely
on it.

cPanel's "Node.js Selector" runs Node apps through Phusion Passenger, which
most hosts front with Apache. The exact behavior (does Passenger set `PORT`
for you? does it want you to *not* call `.listen()`? which Node versions
are offered?) varies by host. Where this matters, it's called out below as
something **you must confirm with your host** rather than asserted as fact.

## 1. Required Node.js version

This project was built and tested with **Node.js 20.9+** (the minimum
Next.js 15 supports; this repo was actually tested on a newer local Node,
but 20.9+ LTS is the floor to target for hosting compatibility). Check your
cPanel account's Node.js Selector for the exact versions offered, and pick
the newest 20.x or 22.x LTS available. If your host only offers Node 18 or
earlier, **this app will not run** - Next.js 15 requires >=18.18, and this
project's `package.json` pins `engines.node: ">=20.9.0"`.

**Confirm:** which Node.js versions your cPanel account's Node.js Selector
actually offers, before doing anything else.

## 2. Build locally or in CI - never on the shared host

The target hosting account has 1GB RAM and is shared with other sites.
Running `next build` there is likely to be slow or get OOM-killed, and will
compete with other tenants. Build on your own machine (or in CI) and
upload only the finished artifact.

```bash
npm ci
npm run build          # runs `next build`, then the postbuild hook below
```

The `postbuild` npm script (`scripts/copy-standalone-assets.mjs`) copies
`public/` and `.next/static/` into `.next/standalone/` automatically -
Next's standalone output traces only server *code* dependencies, not
static assets, so without this step the deployed site would 404 on CSS/JS.

### 2a. Some env vars MUST be set correctly at build time, not just on the server

This bit cost real time to discover during the first deploy, so it's worth
its own warning. Most of this site's pages (`/`, `/privacy`, `/about`,
`/terms`, `/sitemap.xml`, `/robots.txt`, every `/tools/*` and
`/categories/*` page) are **statically prerendered** at `next build` time -
that's intentional, it's what makes them fast and SEO-friendly. But it also
means they bake in whatever environment variables were present **on the
machine that ran `next build`**, not whatever you later set in cPanel's
Setup Node.js App "Environment Variables" UI. Setting `SITE_URL` or
`ADSENSE_ENABLED` only on the server has **zero effect** on these pages -
the server-side env vars only matter for the dynamic routes (`/api/ai`,
`/api/ai/status`, `/api/contact`, `/ads.txt`), which really are evaluated
per-request.

Concretely, this means `SITE_URL`, `ADSENSE_ENABLED`, `ADSENSE_CLIENT_ID`,
`OPERATOR_NAME`, `OPERATOR_CONTACT_EMAIL`, and `OPERATOR_ADDRESS` must all
be correct **in the shell that runs the build**, e.g.:

```bash
SITE_URL=https://texthelper.online \
ADSENSE_ENABLED=true \
ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX \
OPERATOR_NAME="Your Name or Business" \
OPERATOR_CONTACT_EMAIL=you@example.com \
npm run build
```

Don't rely on a local `.env.local` with dev-friendly defaults (like
`SITE_URL=http://localhost:3000`) for a deployment build - either override
these specific vars inline on the build command as above, or maintain a
separate `.env.production.local` with the real values and make sure your
build step actually loads it. After any build intended for deployment,
spot-check before uploading:

```bash
grep -o 'https://[^"]*' .next/standalone/.next/server/app/sitemap.xml.body | head -3
```

If that shows `localhost` instead of your real domain, the build used the
wrong env vars - rebuild before uploading, don't just fix it on the server.

## 3. What to upload (the compatible production artifact)

Upload the **entire contents of `.next/standalone/`** - after the build +
postbuild step above, that directory is a complete, self-contained Node
app: it already includes a pruned `node_modules`, your compiled `src`
output under `.next/standalone/.next`, and now also `public/` and
`.next/static/`. You do **not** need to upload your repository's
`node_modules`, `.git`, `tests/`, or source `src/` tree - the standalone
build already contains everything the server needs to run.

```
.next/standalone/
  server.js          <- the startup entrypoint (see step 6)
  package.json
  node_modules/       (pruned to only what's actually needed)
  public/             (copied by postbuild)
  .next/
    static/           (copied by postbuild)
    server/
    ...
  src/                (compiled server output)
```

Upload this directory's *contents* into your app's application root on
the host (see step 5), e.g. via the cPanel File Manager's upload+extract,
or `scp`/`rsync` if your host allows SSH.

## 4. Production dependencies

None beyond what's already inside `.next/standalone/node_modules` - that's
the point of Next's standalone output. You do not need to run `npm install`
on the server. If your host's Node.js Selector UI insists on an "npm
install" step regardless, running it inside the uploaded directory should
be a harmless no-op (the lockfile-pruned deps are already present), but
prefer skipping it if the UI allows.

## 5. Application root

Create the Node.js app in cPanel's Node.js Selector with:
- **Application root**: the directory you uploaded `.next/standalone`'s
  contents into (e.g. `texthelper` under your account, resolving to
  something like `/home/youruser/texthelper`).
- **Application URL**: your domain or subdomain (e.g. `texthelper.online`).
- **Application startup file**: see step 6.

## 6. Startup entrypoint

The startup file is **`server.js`** (the one inside `.next/standalone/`,
now at the root of what you uploaded). This file is generated by `next
build` with `output: "standalone"` set in `next.config.ts` (already
configured in this repo) - it starts a plain Node HTTP server, no
Passenger-specific code needed.

**Confirm with your host:** some cPanel Node.js Selector setups expect the
app to read the port from a `PORT` environment variable that Passenger
sets for you, and may proxy standard ports 80/443 to it automatically;
others may expect you to never call `.listen()` yourself. Next's generated
`server.js` *does* call `.listen()` and *does* honor `process.env.PORT`
(falling back to 3000), which matches the common cPanel Node.js Selector
model - but confirm this against your specific host's documentation before
assuming it "just works." If your host's Passenger integration conflicts
with this (e.g. it also tries to manage the port), you may need a thin
wrapper entrypoint - ask your host's support for their Next.js-on-Passenger
guidance specifically.

## 7. Environment variables

Set these in the cPanel Node.js Selector's "Environment Variables" UI (not
in a committed `.env` file - see `.env.example` for the full annotated
list). At minimum for a working site:

```
SITE_URL=https://texthelper.online
AI_PROVIDER=groq
GROQ_API_KEY=<your real key>
GROQ_MODEL=openai/gpt-oss-20b   # verify current roster at console.groq.com/docs/models - this one was confirmed live during development, but Groq's lineup changes
QUOTA_DATA_DIR=/home/youruser/texthelper-data/quota   # OUTSIDE the public web root
OPERATOR_NAME=<your real name/business name>
OPERATOR_CONTACT_EMAIL=<your real contact email>
```

Everything else has a documented default in `.env.example`. Never set any
secret with a `NEXT_PUBLIC_` prefix - anything with that prefix ships to
every visitor's browser.

## 8. Persistent quota directory and permissions

The AI usage ledger (`src/lib/ai/quota.ts`) writes one small JSON file,
guarded by a cross-process file lock, to `QUOTA_DATA_DIR`. This must be:

- **Outside the public web root** (so it's never served as a static file).
- **Writable by the Node process's user** - typically your cPanel account
  user, since Passenger apps usually run as that user.

Create it once before first start:

```bash
mkdir -p /home/youruser/texthelper-data/quota
chmod 700 /home/youruser/texthelper-data/quota
```

(Or run `node scripts/ensure-data-dirs.mjs` - it's a zero-dependency script,
safe to run directly with plain `node` even inside the pruned standalone
deployment - with `QUOTA_DATA_DIR` set in its environment first.)

**Single-instance assumption:** the file lock coordinates correctly across
multiple Node *processes on the same machine* sharing the same filesystem
path. It does **not** coordinate across multiple separate hosts/containers
with independent filesystems. A single cPanel Node.js Selector app is a
single-machine deployment, so this is fine as configured. If you ever move
to a multi-host/load-balanced setup, replace `src/lib/ai/quota.ts`'s
storage with a shared service (e.g. a managed Redis) instead of assuming
the file lock still coordinates - it will not.

## 9. Restart procedure

Use the cPanel Node.js Selector's **"Restart"** button after:
- Uploading a new build.
- Changing any environment variable.

If your host also exposes Passenger's `tmp/restart.txt` convention,
touching that file inside the application root should also work, but the
Node.js Selector's own Restart button is the documented, supported path -
prefer it.

## 10. Health verification after deploy

After restarting, check (replace with your real domain):

1. `curl -I https://texthelper.online/` -> expect `HTTP/2 200`.
2. `curl -I https://texthelper.online/tools/word-counter` -> expect `200`.
3. `curl https://texthelper.online/api/ai/status` -> expect
   `{"configured":true,...}` once `GROQ_API_KEY` is set, or
   `{"configured":false,...}` if you haven't set it yet (not an error -
   just means AI tools will correctly tell visitors they're unavailable).
4. `curl -I https://texthelper.online/sitemap.xml` -> expect `200`.
5. `curl -I https://texthelper.online/robots.txt` -> expect `200`, and
   confirm it references your real domain's sitemap URL (driven by
   `SITE_URL`).
6. Visit a nonexistent path (e.g. `/tools/does-not-exist`) in a browser and
   confirm the custom 404 page renders (not a generic Apache/cPanel error
   page - if you see the latter, your Node app isn't correctly handling
   that route, which usually points to a Passenger/proxy misconfiguration).
7. Confirm HTTPS is actually enforced (cPanel's AutoSSL or your own
   certificate) - this project does not manage TLS itself; that's entirely
   your host's/cPanel's job.
8. Confirm the canonical URL meta tag on a few pages matches your real
   `SITE_URL`, not `localhost` or a staging domain - this is driven
   entirely by the `SITE_URL` environment variable, so a wrong value here
   means that variable wasn't actually picked up (check for a typo or a
   restart that didn't happen).

## 11. Passenger compatibility notes

- Passenger typically runs Node apps **on-demand** (spins up on first
  request after idle, "cold start"). The first request after a period of
  no traffic may be noticeably slower than subsequent ones. This is
  inherent to the hosting model, not a bug in this app.
- This project's Node runtime route handlers (e.g. `/api/ai`) require the
  **Node.js runtime**, not the Edge runtime (`export const runtime =
  "nodejs"` is already set where needed) - this matters because the
  quota ledger and the Groq SDK both need real `fs`/Node APIs that aren't
  available on Edge. A cPanel Node.js Selector app runs everything under
  real Node, so this should be moot, but if your host ever offers an "Edge
  functions" style product instead, this app would not be compatible with
  it as-is.

## 12. Memory constraints and troubleshooting

With a 1GB account shared with other sites:
- Keep `AI_CONCURRENCY_LIMIT` low (default 4) - each concurrent AI request
  holds a moderate amount of memory for the duration of the Groq call.
- If the app crashes or won't start, check cPanel's Node.js Selector logs
  first (it usually shows stdout/stderr from `server.js`). Common causes:
  wrong Node version selected, `QUOTA_DATA_DIR` not writable (the app will
  throw clearly rather than silently failing - check for an `EACCES` or
  `ENOENT` in the log), or a missing environment variable causing a route
  to 503 (check `/api/ai/status` first - a 503/`configured:false` there is
  expected-and-documented behavior, not a crash).
- If memory is tight, consider lowering `AI_MAX_OUTPUT_TOKENS` and
  `AI_CONCURRENCY_LIMIT` further; both are environment variables, no code
  change needed.

## 13. Rollback

Keep your previous `.next/standalone` build as a dated backup directory
(e.g. `texthelper-releases/2026-10-20/`) before uploading a new one. To
roll back: point the Node.js Selector's application root at the previous
release's directory (or swap directory contents back) and hit Restart.
Since the quota ledger lives in a separate `QUOTA_DATA_DIR` outside any
release directory, rolling back the app code does not lose or corrupt
usage-limit state.

## What you must confirm before deploying (summary)

- [ ] Exact Node.js versions available in your account's Node.js Selector.
- [ ] Whether your host's Passenger integration expects `server.js` to
      call `.listen()` itself (the common case, and what this app does) or
      something else.
- [ ] That your account has enough inode/storage headroom for
      `node_modules` inside `.next/standalone` (typically tens of MB, well
      under the stated 25GB, but worth a quick check).
- [ ] That AutoSSL/HTTPS is active for your domain before launch.
- [ ] That `QUOTA_DATA_DIR` is writable by the account the Node process
      runs as, and is outside any publicly-served directory.

If the exact behavior of your specific host's Node.js Selector/Passenger
setup differs from what's described above in a way that breaks any of
this, that's a host-specific detail this document cannot fully anticipate
- contact your host's support with the specifics (Next.js 15, standalone
output, `server.js` entrypoint) if something doesn't match.
