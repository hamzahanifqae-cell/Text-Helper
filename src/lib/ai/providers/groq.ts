import Groq from "groq-sdk";
import { AIProvider, AIGenerateParams, AIGenerateResult, AIProviderError } from "../provider";

// Groq's chat completions API is OpenAI-compatible; the official groq-sdk
// package mirrors the OpenAI Node SDK's shape (client.chat.completions.create).
// Verify the current model roster at https://console.groq.com/docs/models
// before launch - free-tier model availability changes over time.
export class GroqProvider implements AIProvider {
  readonly name = "groq";
  readonly model: string;
  private client: Groq;

  constructor() {
    const apiKey = process.env.GROQ_API_KEY;
    if (!apiKey) {
      throw new AIProviderError(
        "AI features are not configured on this server (missing GROQ_API_KEY).",
        "config"
      );
    }
    this.model = process.env.GROQ_MODEL ?? "openai/gpt-oss-20b";
    this.client = new Groq({ apiKey });
  }

  async generate(params: AIGenerateParams): Promise<AIGenerateResult> {
    try {
      const completion = await this.client.chat.completions.create(
        {
          model: this.model,
          messages: [
            { role: "system", content: params.systemPrompt },
            { role: "user", content: params.userContent },
          ],
          max_tokens: params.maxOutputTokens,
          temperature: params.temperature ?? 0.4,
        },
        { signal: params.signal }
      );

      const text = completion.choices[0]?.message?.content ?? "";
      return {
        text,
        inputTokens: completion.usage?.prompt_tokens,
        outputTokens: completion.usage?.completion_tokens,
        model: this.model,
      };
    } catch (err) {
      throw translateGroqError(err, params.signal);
    }
  }
}

function translateGroqError(err: unknown, signal?: AbortSignal): AIProviderError {
  if (signal?.aborted) {
    return new AIProviderError("The request was cancelled.", "cancelled");
  }
  if (err instanceof AIProviderError) return err;

  const anyErr = err as {
    status?: number;
    name?: string;
    code?: string;
    message?: string;
    headers?: Record<string, string>;
  };

  if (anyErr?.status === 429) {
    const retryAfterHeader = anyErr.headers?.["retry-after"];
    const retryAfterMs = retryAfterHeader ? Number(retryAfterHeader) * 1000 : undefined;
    return new AIProviderError(
      "The AI provider is rate-limiting requests right now. Please try again shortly.",
      "rate_limited",
      retryAfterMs
    );
  }
  if (anyErr?.status === 401 || anyErr?.status === 403) {
    return new AIProviderError(
      "AI features are misconfigured on this server (the provider rejected the API key).",
      "config"
    );
  }
  if (anyErr?.name === "APIConnectionTimeoutError" || anyErr?.code === "ETIMEDOUT") {
    return new AIProviderError("The AI provider took too long to respond.", "timeout");
  }
  return new AIProviderError(
    anyErr?.message ?? "The AI provider returned an unexpected error.",
    "provider_error"
  );
}
