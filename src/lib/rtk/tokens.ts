// Heuristic token estimation (±15%) — no heavy tokenizer dependency
// Thai: ~1 token per 1.5 characters (no spaces between words)
// English/Latin: ~1 token per 4 characters
// Mixed text: count Thai chars and non-Thai chars separately

export function estimateTokens(text: string): number {
  if (!text) return 0;

  let thaiChars = 0;
  let otherChars = 0;

  for (const ch of text) {
    const code = ch.codePointAt(0) ?? 0;
    // Thai Unicode block: U+0E00–U+0E7F
    if (code >= 0x0e00 && code <= 0x0e7f) {
      thaiChars++;
    } else if (code > 0x20) {
      // Skip whitespace, count everything else as "other"
      otherChars++;
    }
  }

  const thaiTokens = Math.ceil(thaiChars / 1.5);
  const otherTokens = Math.ceil(otherChars / 4);

  return thaiTokens + otherTokens;
}
