import type { SearchItem, SearchMatch, SearchType } from "./types";
import { SEARCH_TYPE_BOOST } from "./types";
import { normalizeText } from "./tokenizer";

function fieldScore(item: SearchItem, norm: string): number {
  const title = normalizeText(item.title);

  if (title === norm) return 500;
  if (title.startsWith(norm)) return 250;
  const titleWords = title.split(/\s+/);
  if (titleWords.includes(norm)) return 200;
  if (title.includes(norm)) return 100;

  if (item.thaiTitle) {
    const thai = normalizeText(item.thaiTitle);
    if (thai === norm) return 400;
    if (thai.startsWith(norm)) return 200;
    const thaiWords = thai.split(/\s+/);
    if (thaiWords.includes(norm)) return 160;
    if (thai.includes(norm)) return 80;
  }

  if (item.description) {
    const desc = normalizeText(item.description);
    const descWords = desc.split(/\s+/);
    if (descWords.includes(norm)) return 50;
    if (desc.includes(norm)) return 30;
  }

  const kw = normalizeText(item.keywords);
  const kwWords = kw.split(/\s+/);
  if (kwWords.includes(norm)) return 20;
  if (kw.includes(norm)) return 10;

  if (item.badge && normalizeText(item.badge).includes(norm)) return 5;

  return 0;
}

export function rankItem(item: SearchItem, tokens: string[], typeMultiplier: number): SearchMatch | null {
  let total = 0;

  for (const token of tokens) {
    const s = fieldScore(item, normalizeText(token));
    if (s === 0) return null;
    total += s;
  }

  const avg = Math.round(total / tokens.length);
  const score = Math.round(avg * typeMultiplier * 100) / 100;

  return { item, score };
}

export function rankItems(items: SearchItem[], tokens: string[], type: SearchType): SearchMatch[] {
  if (tokens.length === 0) return [];
  const multiplier = SEARCH_TYPE_BOOST[type];

  const results: SearchMatch[] = [];
  for (const item of items) {
    const match = rankItem(item, tokens, multiplier);
    if (match) results.push(match);
  }

  return results;
}
