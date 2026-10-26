import { diffWordsWithSpace, diffLines, type Change } from "diff";

export interface DiffSegment {
  value: string;
  added: boolean;
  removed: boolean;
}

function toSegments(changes: Change[]): DiffSegment[] {
  return changes.map((c) => ({
    value: c.value,
    added: Boolean(c.added),
    removed: Boolean(c.removed),
  }));
}

// jsdiff's word-level diff correctly separates a removed word from the
// added word that replaces it (e.g. "jumps" -> "leaps"), but doesn't
// guarantee a space segment between them - the single space in the source
// text gets attributed to a neighboring unchanged run instead, so a
// renderer that shows both segments (not just the "result" side) ends up
// concatenating them as "jumpsleaps" with no visible boundary. Insert an
// explicit space between any removed/added pair that's missing one.
function restoreSpacingBetweenChanges(segments: DiffSegment[]): DiffSegment[] {
  const result: DiffSegment[] = [];
  for (let i = 0; i < segments.length; i++) {
    const current = segments[i];
    if (!current) continue;
    result.push(current);
    const next = segments[i + 1];
    if (!next) continue;
    const isChangePair =
      (current.removed && next.added) || (current.added && next.removed);
    if (
      isChangePair &&
      current.value.length > 0 &&
      next.value.length > 0 &&
      !/\s$/.test(current.value) &&
      !/^\s/.test(next.value)
    ) {
      result.push({ value: " ", added: false, removed: false });
    }
  }
  return result;
}

export function compareWords(original: string, revised: string): DiffSegment[] {
  return restoreSpacingBetweenChanges(toSegments(diffWordsWithSpace(original, revised)));
}

export function compareLines(original: string, revised: string): DiffSegment[] {
  return toSegments(diffLines(original, revised));
}

export interface DiffStats {
  additions: number;
  deletions: number;
  unchanged: number;
}

export function diffStats(segments: DiffSegment[]): DiffStats {
  let additions = 0;
  let deletions = 0;
  let unchanged = 0;
  for (const seg of segments) {
    const words = seg.value.trim().length > 0 ? seg.value.trim().split(/\s+/).length : 0;
    if (seg.added) additions += words;
    else if (seg.removed) deletions += words;
    else unchanged += words;
  }
  return { additions, deletions, unchanged };
}
