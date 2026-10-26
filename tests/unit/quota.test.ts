import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { promises as fs } from "fs";
import os from "os";
import path from "path";
import { reserveQuota, settleQuota, getQuotaSnapshot } from "@/lib/ai/quota";

describe("quota", () => {
  let dir: string;
  const originalEnv = { ...process.env };

  beforeEach(async () => {
    dir = await fs.mkdtemp(path.join(os.tmpdir(), "texthelper-quota-test-"));
    process.env.QUOTA_DATA_DIR = dir;
    process.env.AI_DAILY_REQUEST_LIMIT = "3";
    process.env.AI_DAILY_TOKEN_LIMIT = "1000";
    process.env.AI_PER_IP_HOURLY_LIMIT = "2";
  });

  afterEach(async () => {
    process.env = { ...originalEnv };
    await fs.rm(dir, { recursive: true, force: true });
  });

  it("allows requests within the daily and per-IP limits", async () => {
    const result = await reserveQuota("1.2.3.4", 100);
    expect(result.allowed).toBe(true);
  });

  it("blocks requests once the per-IP hourly limit is hit", async () => {
    await reserveQuota("1.2.3.4", 10);
    await reserveQuota("1.2.3.4", 10);
    const third = await reserveQuota("1.2.3.4", 10);
    expect(third.allowed).toBe(false);
    expect(third.reason).toBe("per_ip_limit");
  });

  it("allows a different IP even after one IP is rate-limited", async () => {
    await reserveQuota("1.2.3.4", 10);
    await reserveQuota("1.2.3.4", 10);
    const otherIp = await reserveQuota("5.6.7.8", 10);
    expect(otherIp.allowed).toBe(true);
  });

  it("blocks requests once the site-wide daily request limit is hit", async () => {
    await reserveQuota("1.1.1.1", 10);
    await reserveQuota("2.2.2.2", 10);
    await reserveQuota("3.3.3.3", 10);
    const fourth = await reserveQuota("4.4.4.4", 10);
    expect(fourth.allowed).toBe(false);
    expect(fourth.reason).toBe("daily_request_limit");
  });

  it("blocks requests once the site-wide daily token budget is hit", async () => {
    process.env.AI_DAILY_REQUEST_LIMIT = "100";
    await reserveQuota("1.1.1.1", 900);
    const result = await reserveQuota("2.2.2.2", 200);
    expect(result.allowed).toBe(false);
    expect(result.reason).toBe("daily_token_limit");
  });

  it("refunds the token estimate when a request fails before producing output", async () => {
    await reserveQuota("1.1.1.1", 500);
    await settleQuota(500, null);
    const snapshot = await getQuotaSnapshot();
    expect(snapshot.totalTokens).toBe(0);
    expect(snapshot.totalRequests).toBe(1); // the attempt still counts
  });

  it("reconciles the estimate with actual usage on success", async () => {
    await reserveQuota("1.1.1.1", 500);
    await settleQuota(500, 120);
    const snapshot = await getQuotaSnapshot();
    expect(snapshot.totalTokens).toBe(120);
  });

  it("persists state to disk so it survives a restart", async () => {
    await reserveQuota("9.9.9.9", 50);
    const files = await fs.readdir(dir);
    expect(files.some((f) => f === "quota.json")).toBe(true);
    const raw = await fs.readFile(path.join(dir, "quota.json"), "utf8");
    const parsed = JSON.parse(raw);
    expect(parsed.totalRequests).toBe(1);
  });

  it("handles concurrent reservations without losing updates (atomicity)", async () => {
    process.env.AI_PER_IP_HOURLY_LIMIT = "50";
    process.env.AI_DAILY_REQUEST_LIMIT = "50";
    const ips = Array.from({ length: 10 }, (_, i) => `10.0.0.${i}`);
    await Promise.all(ips.map((ip) => reserveQuota(ip, 1)));
    const snapshot = await getQuotaSnapshot();
    expect(snapshot.totalRequests).toBe(10);
  });
});
