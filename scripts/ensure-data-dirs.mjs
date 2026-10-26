// Creates the persistent, outside-the-public-root data directory used by
// the AI usage quota ledger (see src/lib/ai/quota.ts). Safe to run multiple
// times. Run this once before first starting the app in any environment -
// locally, in CI, or on the production host - so the app never has to
// create it implicitly under unexpected permissions.
import { mkdir } from "fs/promises";
import path from "path";

const root = process.cwd();
const quotaDir = process.env.QUOTA_DATA_DIR
  ? path.resolve(root, process.env.QUOTA_DATA_DIR)
  : path.join(root, "data", "quota");

await mkdir(quotaDir, { recursive: true, mode: 0o700 });
console.log(`Quota data directory ready: ${quotaDir}`);
