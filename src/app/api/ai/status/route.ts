import { NextResponse } from "next/server";
import { getQuotaSnapshot } from "@/lib/ai/quota";

export const runtime = "nodejs";

// Public, non-secret status check so the UI can show "AI tools are
// currently unavailable" instead of letting every tool page attempt a
// request and fail. Never returns the API key, model internals beyond the
// public model name, or any per-IP data.
export async function GET() {
  const configured = Boolean(process.env.GROQ_API_KEY) && (process.env.AI_PROVIDER ?? "groq") === "groq";
  let quotaAvailable = true;
  try {
    const snapshot = await getQuotaSnapshot();
    const dailyRequestLimit = Number(process.env.AI_DAILY_REQUEST_LIMIT ?? 1500);
    const dailyTokenLimit = Number(process.env.AI_DAILY_TOKEN_LIMIT ?? 400000);
    quotaAvailable = snapshot.totalRequests < dailyRequestLimit && snapshot.totalTokens < dailyTokenLimit;
  } catch {
    // If the quota store can't be read, fail open on the "configured" check
    // but let the actual AI request surface a concrete error - this status
    // endpoint is only a hint for the UI, never the enforcement point.
  }
  return NextResponse.json({
    configured,
    quotaAvailable,
    model: configured ? process.env.GROQ_MODEL ?? "openai/gpt-oss-20b" : null,
  });
}
