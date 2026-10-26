// Client-side display hint only - the real limit is always enforced
// server-side in /api/ai (see src/lib/ai/sanitizeInput.ts), which reads
// AI_MAX_INPUT_CHARS directly from the server environment. This constant
// just needs to roughly match the .env.example default so the on-page
// character counter is a useful hint rather than a hard rule; a mismatch
// here cannot bypass the server-side check.
export function getMaxInputCharsClientHint(): number {
  return 12000;
}
