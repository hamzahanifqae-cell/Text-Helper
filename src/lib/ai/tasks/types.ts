import { z } from "zod";

export interface BuiltPrompt {
  systemPrompt: string;
  userContent: string;
  maxOutputTokens?: number;
  temperature?: number;
}

export interface AITaskDefinition<TOptions = unknown> {
  id: string;
  label: string;
  optionsSchema: z.ZodType<TOptions, z.ZodTypeDef, unknown>;
  buildPrompt(text: string, options: TOptions): BuiltPrompt;
  /** Transform the raw model output string into the JSON-serializable result returned to the client. */
  postProcess?: (rawOutput: string, text: string, options: TOptions) => unknown;
}

export function definePlainTextTask<TOptions>(
  def: Omit<AITaskDefinition<TOptions>, "postProcess">
): AITaskDefinition<TOptions> {
  return {
    ...def,
    postProcess: (rawOutput: string) => ({ text: rawOutput.trim() }),
  };
}
