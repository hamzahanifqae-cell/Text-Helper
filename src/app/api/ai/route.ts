import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { getTaskDefinition } from "@/lib/ai/tasks/registry";
import { getAIProvider, AIProviderError } from "@/lib/ai/provider";
import { assertWithinInputLimit, getMaxInputChars, InputTooLargeError } from "@/lib/ai/sanitizeInput";
import { estimateTokens, reserveQuota, settleQuota } from "@/lib/ai/quota";
import { withConcurrencyLimit } from "@/lib/ai/concurrency";
import { getClientIp } from "@/lib/ai/clientIp";
import { verifyProtectedPhrases } from "@/lib/ai/protectedPhrases";

export const runtime = "nodejs";

const requestSchema = z.object({
  task: z.string().min(1).max(64),
  text: z.string().min(1),
  options: z.unknown().optional(),
});

const MAX_BODY_BYTES = 200_000; // generous ceiling above AI_MAX_INPUT_CHARS to allow JSON overhead/options

function errorResponse(status: number, error: string, extra?: Record<string, unknown>) {
  return NextResponse.json({ error, ...extra }, { status });
}

export async function POST(request: NextRequest) {
  const contentLength = Number(request.headers.get("content-length") ?? "0");
  if (contentLength > MAX_BODY_BYTES) {
    return errorResponse(413, "Request body is too large.");
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return errorResponse(400, "Request body must be valid JSON.");
  }

  const parsedRequest = requestSchema.safeParse(body);
  if (!parsedRequest.success) {
    return errorResponse(400, "Invalid request.", { details: parsedRequest.error.issues });
  }
  const { task: taskId, text, options: rawOptions } = parsedRequest.data;

  const task = getTaskDefinition(taskId);
  if (!task) {
    return errorResponse(400, `Unknown AI task "${taskId}".`);
  }

  try {
    assertWithinInputLimit(text);
  } catch (err) {
    if (err instanceof InputTooLargeError) {
      return errorResponse(413, err.message, { limit: getMaxInputChars() });
    }
    throw err;
  }

  const parsedOptions = task.optionsSchema.safeParse(rawOptions ?? {});
  if (!parsedOptions.success) {
    return errorResponse(400, "Invalid options for this tool.", { details: parsedOptions.error.issues });
  }

  const globalMaxOutputTokens = Number(process.env.AI_MAX_OUTPUT_TOKENS ?? 1024);
  const built = task.buildPrompt(text, parsedOptions.data);
  const maxOutputTokens = Math.min(built.maxOutputTokens ?? globalMaxOutputTokens, globalMaxOutputTokens);

  const clientIp = getClientIp(request);
  const estimated = estimateTokens(text.length, maxOutputTokens);

  const reservation = await reserveQuota(clientIp, estimated);
  if (!reservation.allowed) {
    const messages: Record<string, string> = {
      daily_request_limit: "TextHelper's AI tools have reached today's site-wide request limit. Please try again later.",
      daily_token_limit: "TextHelper's AI tools have reached today's site-wide usage limit. Please try again later.",
      per_ip_limit: "You've reached the hourly limit for AI tool requests from your connection. Please try again later.",
    };
    const res = errorResponse(429, messages[reservation.reason ?? ""] ?? "Rate limit exceeded.", {
      reason: reservation.reason,
    });
    if (reservation.retryAfterSeconds) {
      res.headers.set("Retry-After", String(reservation.retryAfterSeconds));
    }
    return res;
  }

  const timeoutMs = Number(process.env.AI_REQUEST_TIMEOUT_MS ?? 25000);
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
  const onClientAbort = () => controller.abort();
  if (request.signal.aborted) {
    controller.abort();
  } else {
    request.signal.addEventListener("abort", onClientAbort);
  }

  let actualTokens: number | null = null;
  try {
    const result = await withConcurrencyLimit(async () => {
      const provider = await getAIProvider();
      return provider.generate({
        systemPrompt: built.systemPrompt,
        userContent: built.userContent,
        maxOutputTokens,
        temperature: built.temperature,
        signal: controller.signal,
      });
    });

    actualTokens = (result.inputTokens ?? 0) + (result.outputTokens ?? 0) || null;
    const processed = task.postProcess
      ? task.postProcess(result.text, text, parsedOptions.data)
      : { text: result.text };

    const protectedPhrases = (parsedOptions.data as { protectedPhrases?: string[] })?.protectedPhrases;
    const protection = Array.isArray(protectedPhrases) && protectedPhrases.length > 0
      ? verifyProtectedPhrases(result.text, protectedPhrases)
      : undefined;

    return NextResponse.json({
      result: processed,
      protectedPhraseCheck: protection,
      meta: { model: result.model },
    });
  } catch (err) {
    if (err instanceof AIProviderError) {
      const statusByCode: Record<AIProviderError["code"], number> = {
        config: 503,
        timeout: 504,
        rate_limited: 429,
        provider_error: 502,
        cancelled: 400,
      };
      const res = errorResponse(statusByCode[err.code], err.message, { code: err.code });
      if (err.retryAfterMs) res.headers.set("Retry-After", String(Math.ceil(err.retryAfterMs / 1000)));
      return res;
    }
    return errorResponse(500, "An unexpected error occurred while processing this request.");
  } finally {
    clearTimeout(timeoutId);
    request.signal.removeEventListener("abort", onClientAbort);
    await settleQuota(estimated, actualTokens);
  }
}
