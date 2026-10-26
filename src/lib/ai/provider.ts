export interface AIGenerateParams {
  systemPrompt: string;
  userContent: string;
  maxOutputTokens?: number;
  temperature?: number;
  signal?: AbortSignal;
}

export interface AIGenerateResult {
  text: string;
  inputTokens?: number;
  outputTokens?: number;
  model: string;
}

export type AIErrorCode =
  | "config"
  | "timeout"
  | "rate_limited"
  | "provider_error"
  | "cancelled";

export class AIProviderError extends Error {
  code: AIErrorCode;
  retryAfterMs?: number;

  constructor(message: string, code: AIErrorCode, retryAfterMs?: number) {
    super(message);
    this.name = "AIProviderError";
    this.code = code;
    this.retryAfterMs = retryAfterMs;
  }
}

export interface AIProvider {
  readonly name: string;
  readonly model: string;
  generate(params: AIGenerateParams): Promise<AIGenerateResult>;
}

let cachedProvider: AIProvider | null = null;

// Lazily constructed and cached so a missing API key fails on first real
// use with a clear configuration error, not at module import time (which
// would crash routes that don't even need AI, e.g. during build).
export async function getAIProvider(): Promise<AIProvider> {
  if (cachedProvider) return cachedProvider;
  const providerName = (process.env.AI_PROVIDER ?? "groq").toLowerCase();
  switch (providerName) {
    case "groq": {
      const { GroqProvider } = await import("./providers/groq");
      cachedProvider = new GroqProvider();
      return cachedProvider;
    }
    default:
      throw new AIProviderError(
        `Unknown AI_PROVIDER "${providerName}". Supported providers: groq.`,
        "config"
      );
  }
}

export function resetProviderCacheForTests() {
  cachedProvider = null;
}
