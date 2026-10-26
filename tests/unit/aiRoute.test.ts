import { describe, it, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

class MockAIProviderError extends Error {
  code: string;
  retryAfterMs?: number;
  constructor(message: string, code: string, retryAfterMs?: number) {
    super(message);
    this.code = code;
    this.retryAfterMs = retryAfterMs;
  }
}

const mockGenerate = vi.fn();

vi.mock("@/lib/ai/provider", () => ({
  AIProviderError: MockAIProviderError,
  getAIProvider: vi.fn(async () => ({
    name: "mock",
    model: "mock-model",
    generate: mockGenerate,
  })),
}));

const mockReserveQuota = vi.fn();
const mockSettleQuota = vi.fn();

vi.mock("@/lib/ai/quota", () => ({
  reserveQuota: mockReserveQuota,
  settleQuota: mockSettleQuota,
  estimateTokens: (chars: number, maxOut: number) => Math.ceil(chars / 4) + maxOut,
  getQuotaSnapshot: vi.fn(async () => ({ dateKey: "2026-01-01", totalRequests: 0, totalTokens: 0 })),
}));

function makeRequest(body: unknown) {
  return new NextRequest("http://localhost/api/ai", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  });
}

describe("/api/ai route", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockReserveQuota.mockResolvedValue({ allowed: true });
    mockSettleQuota.mockResolvedValue(undefined);
  });

  it("rejects an unknown task with 400", async () => {
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "not-a-task", text: "hello" }));
    expect(res.status).toBe(400);
    const json = await res.json();
    expect(json.error).toMatch(/unknown ai task/i);
  });

  it("rejects input over the character limit with 413", async () => {
    process.env.AI_MAX_INPUT_CHARS = "10";
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "paraphrase", text: "this text is way too long" }));
    expect(res.status).toBe(413);
    delete process.env.AI_MAX_INPUT_CHARS;
  });

  it("returns a clear 503 when the AI provider is not configured", async () => {
    const { getAIProvider } = await import("@/lib/ai/provider");
    (getAIProvider as ReturnType<typeof vi.fn>).mockRejectedValueOnce(
      new MockAIProviderError("AI features are not configured on this server.", "config")
    );
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "paraphrase", text: "hello world" }));
    expect(res.status).toBe(503);
    const json = await res.json();
    expect(json.code).toBe("config");
  });

  it("returns 429 with Retry-After when the daily quota is exhausted", async () => {
    mockReserveQuota.mockResolvedValueOnce({ allowed: false, reason: "daily_request_limit" });
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "paraphrase", text: "hello world" }));
    expect(res.status).toBe(429);
  });

  it("returns 429 with Retry-After when the per-IP limit is exhausted", async () => {
    mockReserveQuota.mockResolvedValueOnce({ allowed: false, reason: "per_ip_limit", retryAfterSeconds: 120 });
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "paraphrase", text: "hello world" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("120");
  });

  it("maps a provider timeout to 504", async () => {
    mockGenerate.mockRejectedValueOnce(new MockAIProviderError("timed out", "timeout"));
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "paraphrase", text: "hello world" }));
    expect(res.status).toBe(504);
    expect(mockSettleQuota).toHaveBeenCalledWith(expect.any(Number), null);
  });

  it("maps a provider rate-limit error to 429 with Retry-After", async () => {
    mockGenerate.mockRejectedValueOnce(new MockAIProviderError("rate limited", "rate_limited", 5000));
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "paraphrase", text: "hello world" }));
    expect(res.status).toBe(429);
    expect(res.headers.get("Retry-After")).toBe("5");
  });

  it("returns a successful result and reconciles actual token usage", async () => {
    mockGenerate.mockResolvedValueOnce({ text: "Rewritten text.", inputTokens: 10, outputTokens: 5, model: "mock-model" });
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "paraphrase", text: "hello world" }));
    expect(res.status).toBe(200);
    const json = await res.json();
    expect(json.result.text).toBe("Rewritten text.");
    expect(mockSettleQuota).toHaveBeenCalledWith(expect.any(Number), 15);
  });

  it("validates per-task options and rejects invalid ones with 400", async () => {
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "tone-change", text: "hello", options: { targetTone: "not-a-real-tone" } }));
    expect(res.status).toBe(400);
  });

  it("never leaks the API key or raw error internals in the response", async () => {
    mockGenerate.mockRejectedValueOnce(new Error("secret leak: GROQ_API_KEY=sk-fake-12345"));
    const { POST } = await import("@/app/api/ai/route");
    const res = await POST(makeRequest({ task: "paraphrase", text: "hello world" }));
    const json = await res.json();
    expect(JSON.stringify(json)).not.toContain("sk-fake-12345");
  });
});
