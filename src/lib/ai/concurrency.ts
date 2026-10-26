// In-memory concurrency limiter for outbound AI provider calls on THIS
// process. Intentionally in-memory (not persisted): it bounds how many
// requests this one Node process has in flight at once, which is a
// per-process concern by definition. If the app is ever scaled to multiple
// worker processes, each gets its own slot pool - document real concurrency
// as AI_CONCURRENCY_LIMIT x number of workers (see CPANEL_DEPLOYMENT.md).

let active = 0;
const waiters: Array<() => void> = [];

function getLimit(): number {
  return Math.max(1, Number(process.env.AI_CONCURRENCY_LIMIT ?? 4));
}

async function acquire(): Promise<void> {
  if (active < getLimit()) {
    active++;
    return;
  }
  await new Promise<void>((resolve) => waiters.push(resolve));
  active++;
}

function release(): void {
  active = Math.max(0, active - 1);
  const next = waiters.shift();
  if (next) next();
}

export async function withConcurrencyLimit<T>(fn: () => Promise<T>): Promise<T> {
  await acquire();
  try {
    return await fn();
  } finally {
    release();
  }
}

export function getConcurrencySnapshot() {
  return { active, queued: waiters.length, limit: getLimit() };
}
