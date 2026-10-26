// Persistent, file-based quota accounting for AI usage. Deliberately avoids
// Redis or any other persistent service (hosting constraint): the ledger is
// one small JSON file under QUOTA_DATA_DIR, updated with a cross-process
// file lock (proper-lockfile) so reads-modify-writes stay atomic even under
// concurrent requests, and a value survives process restarts.
//
// Single-instance assumption: this lock is filesystem-based and correct for
// one Node process (or several processes on the SAME machine sharing the
// same QUOTA_DATA_DIR path and filesystem). It is NOT correct across
// multiple machines/containers with independent filesystems - if this app
// is ever run behind a multi-host load balancer, replace this module with
// a shared store (e.g. a managed Redis) rather than assuming the file lock
// coordinates across hosts. See CPANEL_DEPLOYMENT.md.

import { promises as fs } from "fs";
import path from "path";
import lockfile from "proper-lockfile";

interface IpWindow {
  windowStartMs: number;
  count: number;
}

interface QuotaState {
  dateKey: string;
  totalRequests: number;
  totalTokens: number;
  perIp: Record<string, IpWindow>;
}

const HOUR_MS = 60 * 60 * 1000;

function getDataDir(): string {
  return process.env.QUOTA_DATA_DIR ?? path.join(process.cwd(), "data", "quota");
}

function getFilePath(): string {
  return path.join(getDataDir(), "quota.json");
}

function todayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function emptyState(): QuotaState {
  return { dateKey: todayKey(), totalRequests: 0, totalTokens: 0, perIp: {} };
}

async function ensureFile(): Promise<string> {
  const dir = getDataDir();
  await fs.mkdir(dir, { recursive: true, mode: 0o700 });
  const file = getFilePath();
  try {
    await fs.access(file);
  } catch {
    await fs.writeFile(file, JSON.stringify(emptyState()), "utf8");
  }
  return file;
}

async function readState(file: string): Promise<QuotaState> {
  try {
    const raw = await fs.readFile(file, "utf8");
    const parsed = JSON.parse(raw) as QuotaState;
    if (parsed.dateKey !== todayKey()) return emptyState();
    return parsed;
  } catch {
    return emptyState();
  }
}

async function writeState(file: string, state: QuotaState): Promise<void> {
  const tmp = `${file}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(tmp, JSON.stringify(state), "utf8");
  await fs.rename(tmp, file);
}

function pruneStaleIps(perIp: Record<string, IpWindow>, now: number): Record<string, IpWindow> {
  const pruned: Record<string, IpWindow> = {};
  for (const [ip, window] of Object.entries(perIp)) {
    if (now - window.windowStartMs < 2 * HOUR_MS) pruned[ip] = window;
  }
  return pruned;
}

async function withLock<T>(
  fn: (state: QuotaState) => { state: QuotaState; result: T }
): Promise<T> {
  const file = await ensureFile();
  const release = await lockfile.lock(file, {
    retries: { retries: 15, factor: 1.4, minTimeout: 20, maxTimeout: 250 },
  });
  try {
    const state = await readState(file);
    const { state: nextState, result } = fn(state);
    await writeState(file, nextState);
    return result;
  } finally {
    await release();
  }
}

export interface ReservationCheck {
  allowed: boolean;
  reason?: "daily_request_limit" | "daily_token_limit" | "per_ip_limit";
  retryAfterSeconds?: number;
}

export async function reserveQuota(clientIp: string, estimatedTokens: number): Promise<ReservationCheck> {
  const dailyRequestLimit = Number(process.env.AI_DAILY_REQUEST_LIMIT ?? 1500);
  const dailyTokenLimit = Number(process.env.AI_DAILY_TOKEN_LIMIT ?? 400000);
  const perIpHourlyLimit = Number(process.env.AI_PER_IP_HOURLY_LIMIT ?? 20);

  return withLock((state): { state: QuotaState; result: ReservationCheck } => {
    const now = Date.now();
    const perIp = pruneStaleIps(state.perIp, now);
    const ipEntry = perIp[clientIp];
    const ipWindowActive = Boolean(ipEntry && now - ipEntry.windowStartMs < HOUR_MS);
    const ipCount = ipWindowActive && ipEntry ? ipEntry.count : 0;

    if (state.totalRequests + 1 > dailyRequestLimit) {
      return { state: { ...state, perIp }, result: { allowed: false, reason: "daily_request_limit" } };
    }
    if (state.totalTokens + estimatedTokens > dailyTokenLimit) {
      return { state: { ...state, perIp }, result: { allowed: false, reason: "daily_token_limit" } };
    }
    if (ipCount + 1 > perIpHourlyLimit) {
      const retryAfterSeconds = ipEntry ? Math.ceil((ipEntry.windowStartMs + HOUR_MS - now) / 1000) : 3600;
      return {
        state: { ...state, perIp },
        result: { allowed: false, reason: "per_ip_limit", retryAfterSeconds },
      };
    }

    const nextState: QuotaState = {
      ...state,
      totalRequests: state.totalRequests + 1,
      totalTokens: state.totalTokens + estimatedTokens,
      perIp: {
        ...perIp,
        [clientIp]: {
          windowStartMs: ipWindowActive && ipEntry ? ipEntry.windowStartMs : now,
          count: ipCount + 1,
        },
      },
    };
    return { state: nextState, result: { allowed: true } };
  });
}

// Reconciles the token estimate used at reservation time with what actually
// happened. Pass actualTokens = null when the request failed before any
// tokens were produced (the estimate is refunded); the request count is
// never decremented, since an attempt against the provider was still made.
export async function settleQuota(estimatedTokens: number, actualTokens: number | null): Promise<void> {
  const delta = actualTokens === null ? -estimatedTokens : actualTokens - estimatedTokens;
  if (delta === 0) return;
  await withLock((state) => ({
    state: { ...state, totalTokens: Math.max(0, state.totalTokens + delta) },
    result: undefined,
  }));
}

export async function getQuotaSnapshot(): Promise<Omit<QuotaState, "perIp">> {
  const file = await ensureFile();
  const full = await readState(file);
  return { dateKey: full.dateKey, totalRequests: full.totalRequests, totalTokens: full.totalTokens };
}

export function estimateTokens(inputChars: number, maxOutputTokens: number): number {
  // Rough heuristic (~4 chars/token for English) plus the full output
  // ceiling, so the reservation errs toward overestimating rather than
  // under-protecting the daily budget.
  return Math.ceil(inputChars / 4) + maxOutputTokens;
}
