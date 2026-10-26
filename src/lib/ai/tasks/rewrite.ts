import { z } from "zod";
import { AITaskDefinition, definePlainTextTask } from "./types";
import { buildSystemPrompt, buildUserContent } from "./shared";

const baseOptionsSchema = z.object({
  protectedPhrases: z.array(z.string().max(200)).max(25).default([]),
});

function makeTask(
  id: string,
  label: string,
  roleInstruction: string
): AITaskDefinition<z.infer<typeof baseOptionsSchema>> {
  return definePlainTextTask({
    id,
    label,
    optionsSchema: baseOptionsSchema,
    buildPrompt(text, options) {
      return {
        systemPrompt: buildSystemPrompt({ roleInstruction, protectedPhrases: options.protectedPhrases }),
        userContent: buildUserContent(text),
        temperature: 0.5,
      };
    },
  });
}

export const paraphraseTask = makeTask(
  "paraphrase",
  "Paraphrasing Tool",
  "Rewrite the text using substantially different wording and sentence structure while keeping the exact same meaning, points, and order of ideas."
);

export const simplifyTask = makeTask(
  "simplify",
  "Text Simplifier",
  "Rewrite the text in simpler language: shorter sentences, plainer words, and clearer structure, suitable for a general reader. Keep every point."
);

export const shortenTask = makeTask(
  "shorten",
  "Text Shortener",
  "Condense the text to be noticeably shorter while keeping every essential point. Cut redundancy and filler, not substance."
);

export const expandTask = makeTask(
  "expand",
  "Text Expander",
  "Expand the text with additional relevant detail, explanation, and supporting sentences around the existing points. Do not invent new facts - elaborate on what is already there."
);

const toneOptionsSchema = baseOptionsSchema.extend({
  targetTone: z
    .enum(["formal", "casual", "friendly", "confident", "empathetic", "persuasive", "neutral"])
    .default("neutral"),
});

export const toneChangeTask = definePlainTextTask<z.infer<typeof toneOptionsSchema>>({
  id: "tone-change",
  label: "Tone Changer",
  optionsSchema: toneOptionsSchema,
  buildPrompt(text, options) {
    return {
      systemPrompt: buildSystemPrompt({
        roleInstruction: `Rewrite the text so it reads in a ${options.targetTone} tone, keeping the same meaning and information.`,
        protectedPhrases: options.protectedPhrases,
      }),
      userContent: buildUserContent(text),
      temperature: 0.5,
    };
  },
});

const directionOptionsSchema = baseOptionsSchema.extend({
  direction: z.enum(["toFormal", "toInformal"]).default("toFormal"),
});

export const formalInformalTask = definePlainTextTask<z.infer<typeof directionOptionsSchema>>({
  id: "formal-informal",
  label: "Formal / Informal Converter",
  optionsSchema: directionOptionsSchema,
  buildPrompt(text, options) {
    const roleInstruction =
      options.direction === "toFormal"
        ? "Rewrite the text in formal, professional register: no contractions or slang, precise vocabulary, complete sentences."
        : "Rewrite the text in informal, everyday register: contractions are fine, conversational vocabulary, relaxed sentence structure.";
    return {
      systemPrompt: buildSystemPrompt({ roleInstruction, protectedPhrases: options.protectedPhrases }),
      userContent: buildUserContent(text),
      temperature: 0.5,
    };
  },
});

export const activeVoiceTask = makeTask(
  "active-voice",
  "Active Voice Converter",
  "Rewrite passive-voice sentences into active voice wherever it improves clarity, keeping meaning identical. Leave sentences that are already active, or where passive voice is clearly intentional (e.g. the actor is unknown or irrelevant), unchanged."
);

export const flowConsistencyTask = makeTask(
  "flow-consistency",
  "Flow & Consistency Improver",
  "Improve the flow between sentences and paragraphs: smooth transitions, consistent verb tense and point of view, and consistent terminology for the same concept throughout. Keep the same content and order of ideas."
);

export const inclusiveLanguageTask = makeTask(
  "inclusive-language",
  "Inclusive Language Checker",
  "Identify and rewrite language that is unnecessarily gendered, ableist, or otherwise exclusionary, replacing it with inclusive alternatives that keep the same meaning. Leave everything else unchanged."
);

const countOptionsSchema = baseOptionsSchema.extend({
  count: z.number().int().min(1).max(8).default(3),
});

export const headlineGeneratorTask = definePlainTextTask<z.infer<typeof countOptionsSchema>>({
  id: "headline-generator",
  label: "Headline Generator",
  optionsSchema: countOptionsSchema,
  buildPrompt(text, options) {
    return {
      systemPrompt: buildSystemPrompt({
        roleInstruction: `Based on the content below, write ${options.count} distinct, accurate headline options, one per line, with no numbering. Each headline must be supported by the content - do not invent claims not present in the text.`,
        protectedPhrases: options.protectedPhrases,
      }),
      userContent: buildUserContent(text),
      temperature: 0.7,
    };
  },
});

export const introductionGeneratorTask = makeTask(
  "introduction-generator",
  "Introduction Generator",
  "Write an engaging introduction paragraph for the content below (the content is the body the introduction leads into, not something to summarize point-by-point). Ground it only in what the content actually covers."
);

export const conclusionGeneratorTask = makeTask(
  "conclusion-generator",
  "Conclusion Generator",
  "Write a concise concluding paragraph that wraps up the content below, reinforcing its main point without introducing new claims."
);

export const outlineGeneratorTask = makeTask(
  "outline-generator",
  "Outline Generator",
  "Produce a hierarchical outline of the content below using nested bullet points (use '-' for top level and '  -' indented for sub-points). Reflect only the structure and points already present in the content."
);

export const rewriteTasks = [
  paraphraseTask,
  simplifyTask,
  shortenTask,
  expandTask,
  toneChangeTask,
  formalInformalTask,
  activeVoiceTask,
  flowConsistencyTask,
  inclusiveLanguageTask,
  headlineGeneratorTask,
  introductionGeneratorTask,
  conclusionGeneratorTask,
  outlineGeneratorTask,
];
