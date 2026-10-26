// Next's "standalone" build output traces only the server dependency graph
// - it deliberately does NOT copy public/ or .next/static/, since those are
// plain static files, not code dependencies. This script copies both into
// the standalone output so `node .next/standalone/server.js` can serve a
// complete site on its own. Run after `next build` and before starting the
// standalone server (locally for testing, or on the production host after
// uploading the build - see CPANEL_DEPLOYMENT.md).
import { cp, access } from "fs/promises";
import path from "path";

const root = process.cwd();
const standaloneDir = path.join(root, ".next", "standalone");

async function exists(p) {
  try {
    await access(p);
    return true;
  } catch {
    return false;
  }
}

async function main() {
  if (!(await exists(standaloneDir))) {
    console.error('No .next/standalone directory found - run "npm run build" first.');
    process.exit(1);
  }

  const publicSrc = path.join(root, "public");
  if (await exists(publicSrc)) {
    await cp(publicSrc, path.join(standaloneDir, "public"), { recursive: true });
    console.log("Copied public/ -> .next/standalone/public");
  } else {
    console.log("No public/ directory to copy (none exists yet).");
  }

  const staticSrc = path.join(root, ".next", "static");
  if (await exists(staticSrc)) {
    await cp(staticSrc, path.join(standaloneDir, ".next", "static"), { recursive: true });
    console.log("Copied .next/static/ -> .next/standalone/.next/static");
  }
}

main();
