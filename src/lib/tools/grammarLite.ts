// Deterministic grammar/spelling/punctuation checks. This is NOT a full
// spellchecker or grammar engine (it does not ship a Hunspell-size
// dictionary, by design, to keep server memory low on constrained hosting).
// It catches a curated set of common mistakes; the AI-backed "deeper
// suggestions" pass (see src/lib/ai/tasks/grammar.ts) is where genuinely
// context-dependent grammar issues get caught. This tool is not a
// replacement for LanguageTool or similar, and does not claim to be.

export type SuggestionType = "spelling" | "variant" | "punctuation" | "repetition";

export interface GrammarSuggestion {
  id: string;
  type: SuggestionType;
  start: number;
  end: number;
  original: string;
  suggestion: string;
  explanation: string;
}

export type EnglishVariant = "US" | "UK";

// A curated set of frequently-mistyped words. Not exhaustive.
export const COMMON_MISSPELLINGS: Record<string, string> = {
  teh: "the", recieve: "receive", recieved: "received", seperate: "separate",
  definately: "definitely", occured: "occurred", occuring: "occurring",
  untill: "until", wich: "which", becuase: "because", beleive: "believe",
  acheive: "achieve", adress: "address", agressive: "aggressive",
  arguement: "argument", calender: "calendar", collegue: "colleague",
  comming: "coming", commitee: "committee", concious: "conscious",
  definatly: "definitely", desicion: "decision", enviroment: "environment",
  existance: "existence", goverment: "government", gaurd: "guard",
  grammer: "grammar", happend: "happened", hieght: "height",
  immediatly: "immediately", independant: "independent", knowlege: "knowledge",
  liasion: "liaison", maintainance: "maintenance", mispell: "misspell",
  neccessary: "necessary", noticable: "noticeable", ocassion: "occasion",
  payed: "paid", posession: "possession", prefered: "preferred",
  publically: "publicly", recomend: "recommend", refered: "referred",
  relevent: "relevant", rythm: "rhythm", sucess: "success",
  suprise: "surprise", tommorow: "tomorrow", truely: "truly",
  unfortunatly: "unfortunately", wierd: "weird",
  writen: "written", youre: "you're", thier: "their", alot: "a lot",
  cant: "can't", dont: "don't", wont: "won't", im: "I'm",
};

// US -> UK spelling variant pairs. Not exhaustive; covers the common
// -ize/-ise, -or/-our, -er/-re, -og/-ogue style patterns plus frequent
// one-off pairs.
export const US_TO_UK: Record<string, string> = {
  color: "colour", colors: "colours", colored: "coloured", coloring: "colouring",
  favorite: "favourite", favorites: "favourites", flavor: "flavour",
  flavors: "flavours", honor: "honour", honors: "honours", humor: "humour",
  labor: "labour", neighbor: "neighbour", neighbors: "neighbours",
  organize: "organise", organized: "organised", organizing: "organising",
  organization: "organisation", organizations: "organisations",
  realize: "realise", realized: "realised", realizing: "realising",
  recognize: "recognise", recognized: "recognised", apologize: "apologise",
  apologized: "apologised", analyze: "analyse", analyzed: "analysed",
  analyzing: "analysing", center: "centre", centers: "centres",
  centered: "centred", theater: "theatre", theaters: "theatres",
  liter: "litre", liters: "litres", meter: "metre", meters: "metres",
  fiber: "fibre", defense: "defence", offense: "offence", license: "licence",
  catalog: "catalogue", catalogs: "catalogues", dialog: "dialogue",
  dialogs: "dialogues", gray: "grey", travelling: "travelling",
  traveled: "travelled", canceled: "cancelled", canceling: "cancelling",
  modeling: "modelling", jewelry: "jewellery", airplane: "aeroplane",
  math: "maths", program: "programme",
};

export const UK_TO_US: Record<string, string> = Object.fromEntries(
  Object.entries(US_TO_UK).map(([us, uk]) => [uk, us])
);

let idCounter = 0;
function nextId(): string {
  idCounter += 1;
  return `sg-${idCounter}-${Date.now().toString(36)}`;
}

export function detectRepeatedWords(text: string): GrammarSuggestion[] {
  const suggestions: GrammarSuggestion[] = [];
  const re = /\b([A-Za-z']+)([ \t]+)\1\b/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    suggestions.push({
      id: nextId(),
      type: "repetition",
      start: m.index,
      end: m.index + m[0].length,
      original: m[0],
      suggestion: m[1] ?? "",
      explanation: `"${m[1]}" is repeated. Did you mean to type it once?`,
    });
  }
  return suggestions;
}

export function detectMisspellings(
  text: string,
  customDictionary: ReadonlySet<string> = new Set()
): GrammarSuggestion[] {
  const suggestions: GrammarSuggestion[] = [];
  const re = /\b[A-Za-z']+\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const word = m[0];
    const lower = word.toLowerCase();
    if (customDictionary.has(lower)) continue;
    const fix = COMMON_MISSPELLINGS[lower];
    if (fix) {
      suggestions.push({
        id: nextId(),
        type: "spelling",
        start: m.index,
        end: m.index + word.length,
        original: word,
        suggestion: matchCase(word, fix),
        explanation: `"${word}" is a common misspelling of "${fix}".`,
      });
    }
  }
  return suggestions;
}

export function detectVariantMismatches(
  text: string,
  targetVariant: EnglishVariant,
  customDictionary: ReadonlySet<string> = new Set()
): GrammarSuggestion[] {
  const map = targetVariant === "US" ? UK_TO_US : US_TO_UK;
  const suggestions: GrammarSuggestion[] = [];
  const re = /\b[A-Za-z']+\b/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(text)) !== null) {
    const word = m[0];
    const lower = word.toLowerCase();
    if (customDictionary.has(lower)) continue;
    const fix = map[lower];
    if (fix) {
      suggestions.push({
        id: nextId(),
        type: "variant",
        start: m.index,
        end: m.index + word.length,
        original: word,
        suggestion: matchCase(word, fix),
        explanation: `"${word}" is ${targetVariant === "US" ? "British" : "American"} spelling. You're checking for ${targetVariant} English, so consider "${fix}".`,
      });
    }
  }
  return suggestions;
}

export function detectPunctuation(text: string): GrammarSuggestion[] {
  const suggestions: GrammarSuggestion[] = [];

  const doubleSpace = /[^\S\n]{2,}/g;
  let m: RegExpExecArray | null;
  while ((m = doubleSpace.exec(text)) !== null) {
    suggestions.push({
      id: nextId(),
      type: "punctuation",
      start: m.index,
      end: m.index + m[0].length,
      original: m[0],
      suggestion: " ",
      explanation: "Multiple consecutive spaces found. Consider using a single space.",
    });
  }

  const missingSpaceAfterPunct = /([,.;:!?])([A-Za-z])/g;
  while ((m = missingSpaceAfterPunct.exec(text)) !== null) {
    const mm = m;
    suggestions.push({
      id: nextId(),
      type: "punctuation",
      start: mm.index,
      end: mm.index + mm[0].length,
      original: mm[0],
      suggestion: `${mm[1]} ${mm[2]}`,
      explanation: `Add a space after "${mm[1]}".`,
    });
  }

  const excessivePunct = /([!?]){2,}|\.{4,}/g;
  while ((m = excessivePunct.exec(text)) !== null) {
    const mm = m;
    const normalized = mm[1] ? mm[1] : "...";
    suggestions.push({
      id: nextId(),
      type: "punctuation",
      start: mm.index,
      end: mm.index + mm[0].length,
      original: mm[0],
      suggestion: normalized,
      explanation: "Repeated punctuation marks found. Consider using a single mark for a more formal tone.",
    });
  }

  const spaceBeforePunct = / +([,.;:!?])/g;
  while ((m = spaceBeforePunct.exec(text)) !== null) {
    const mm = m;
    suggestions.push({
      id: nextId(),
      type: "punctuation",
      start: mm.index,
      end: mm.index + mm[0].length,
      original: mm[0],
      suggestion: mm[1] ?? "",
      explanation: `Remove the space before "${mm[1]}".`,
    });
  }

  return suggestions.sort((a, b) => a.start - b.start);
}

function matchCase(source: string, target: string): string {
  if (source === source.toUpperCase()) return target.toUpperCase();
  if (source[0] === source[0]?.toUpperCase()) {
    return target.charAt(0).toUpperCase() + target.slice(1);
  }
  return target;
}

export interface DetectOptions {
  variant: EnglishVariant;
  customDictionary?: ReadonlySet<string>;
  checkRepetition?: boolean;
  checkSpelling?: boolean;
  checkVariant?: boolean;
  checkPunctuation?: boolean;
}

export function detectAll(text: string, options: DetectOptions): GrammarSuggestion[] {
  const dict = options.customDictionary ?? new Set();
  const all: GrammarSuggestion[] = [];
  if (options.checkRepetition !== false) all.push(...detectRepeatedWords(text));
  if (options.checkSpelling !== false) all.push(...detectMisspellings(text, dict));
  if (options.checkVariant !== false) all.push(...detectVariantMismatches(text, options.variant, dict));
  if (options.checkPunctuation !== false) all.push(...detectPunctuation(text));
  return all
    .filter((s, idx, arr) => arr.findIndex((o) => o.start === s.start && o.end === s.end) === idx)
    .sort((a, b) => a.start - b.start);
}

export interface ApplyResult {
  ok: boolean;
  text?: string;
  reason?: string;
}

// Re-validates that the suggestion's range still matches the original text
// it was computed against before applying it. If the user edited the text
// in between, the range may now point at different content - in that case
// this refuses to apply rather than silently corrupting the wrong passage.
export function applySuggestion(currentText: string, suggestion: GrammarSuggestion): ApplyResult {
  const { start, end, original, suggestion: replacement } = suggestion;
  if (start < 0 || end > currentText.length || start > end) {
    return { ok: false, reason: "This suggestion's position is no longer valid for the current text." };
  }
  const slice = currentText.slice(start, end);
  if (slice !== original) {
    return {
      ok: false,
      reason: "The text at this location has changed since the suggestion was generated. Please re-run the check.",
    };
  }
  return { ok: true, text: currentText.slice(0, start) + replacement + currentText.slice(end) };
}
