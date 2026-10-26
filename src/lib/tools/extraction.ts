// Extraction and privacy-redaction helpers. Detection is regex-based and
// heuristic: it will miss unusual formats and can occasionally flag text
// that isn't actually personal information. This is explicitly surfaced to
// users - these tools do not claim complete, guaranteed detection or
// anonymization.

export const EMAIL_RE = /[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+/g;

export const URL_RE = /\bhttps?:\/\/[^\s<>"'\]\)]+|\bwww\.[^\s<>"'\]\)]+/gi;

export const HASHTAG_RE = /#[a-zA-Z0-9_]+/g;

export const NUMBER_RE = /-?\d{1,3}(?:,\d{3})+(?:\.\d+)?%?|-?\d+(?:\.\d+)?%?/g;

// Deliberately broad: matches common separators (space, dash, dot, parens)
// across 7-15 digit sequences. Will over-match things like ID numbers and
// under-match unusual international formats - documented as a known limit.
export const PHONE_RE = /(?:\+?\d{1,3}[\s.-]?)?(?:\(\d{2,4}\)[\s.-]?)?\d{3,4}[\s.-]?\d{3,4}(?:[\s.-]?\d{2,4})?/g;

export function extractEmails(text: string): string[] {
  return dedupe(text.match(EMAIL_RE) ?? []);
}

export function extractUrls(text: string): string[] {
  return dedupe(text.match(URL_RE) ?? []);
}

export function extractHashtags(text: string): string[] {
  return dedupe(text.match(HASHTAG_RE) ?? []);
}

export function extractNumbers(text: string): string[] {
  return text.match(NUMBER_RE) ?? [];
}

function dedupe(items: string[]): string[] {
  return Array.from(new Set(items));
}

export interface RedactOptions {
  redactEmails?: boolean;
  redactPhones?: boolean;
  maskWith?: string;
}

export interface RedactResult {
  text: string;
  emailsRedacted: number;
  phonesRedacted: number;
}

function looksLikePhoneCandidate(match: string): boolean {
  const digits = match.replace(/\D/g, "");
  return digits.length >= 7 && digits.length <= 15;
}

export function redactPII(text: string, options: RedactOptions = {}): RedactResult {
  const mask = options.maskWith ?? "[redacted]";
  let emailsRedacted = 0;
  let phonesRedacted = 0;
  let result = text;

  if (options.redactEmails !== false) {
    result = result.replace(EMAIL_RE, () => {
      emailsRedacted++;
      return mask;
    });
  }

  if (options.redactPhones !== false) {
    result = result.replace(PHONE_RE, (match) => {
      if (!looksLikePhoneCandidate(match)) return match;
      phonesRedacted++;
      return mask;
    });
  }

  return { text: result, emailsRedacted, phonesRedacted };
}
