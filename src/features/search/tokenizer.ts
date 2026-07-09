export function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\u0E00-\u0E7F\s-]/g, "")
    .trim();
}

export function tokenize(text: string): string[] {
  const cleaned = normalizeText(text);
  if (!cleaned) return [];
  return cleaned.split(/\s+/).filter(Boolean);
}

export function matchesToken(haystack: string, token: string): boolean {
  const normalized = normalizeText(haystack);
  return normalized.includes(token);
}

export function prefixMatches(haystack: string, token: string): boolean {
  const normalized = normalizeText(haystack);
  return normalized.startsWith(token);
}

export function tokenMatchesAny(fields: (string | undefined | null)[], token: string): boolean {
  for (const field of fields) {
    if (field && matchesToken(field, token)) return true;
  }
  return false;
}
