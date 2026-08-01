/** Stable undirected edge endpoints for NoteLink uniqueness. */
export function canonicalLinkPair(a: string, b: string): [string, string] {
  return a < b ? [a, b] : [b, a];
}

export function normalizeNoteTitle(title: string): string {
  const trimmed = title.trim();
  return trimmed.length > 0 ? trimmed : "Untitled";
}
