import type { SearchItem, SearchMatch, SearchType } from "./types";
import { SEARCH_TYPE_BOOST } from "./types";
import { normalizeText, tokenize, matchesToken, prefixMatches } from "./tokenizer";

type ScoredField = {
  field: string;
  base: number;
  value: string | undefined | null;
};

function scoreItem(item: SearchItem, token: string): ScoredField | null {
  const norm = normalizeText(token);
  if (!norm) return null;

  const fields: ScoredField[] = [
    { field: "title", base: 100, value: item.title },
    { field: "thaiTitle", base: 70, value: item.thaiTitle },
    { field: "description", base: 30, value: item.description },
    { field: "badge", base: 10, value: item.badge },
  ];

  let best: ScoredField | null = null;

  if (prefixMatches(item.title, norm)) {
    best = { field: "title", base: 80, value: item.title };
  }

  for (const f of fields) {
    if (f.value && matchesToken(f.value, norm)) {
      if (!best || f.base > best.base) {
        best = f;
      }
    }
  }

  if (matchesToken(item.keywords, norm)) {
    const keywordScore: ScoredField = { field: "keywords", base: 40, value: item.keywords };
    if (!best || keywordScore.base > best.base) {
      best = keywordScore;
    }
  }

  return best;
}

export function rankItem(item: SearchItem, tokens: string[], typeBoost: number): SearchMatch | null {
  let totalScore = 0;
  let matchField: string | undefined;

  for (const token of tokens) {
    const scored = scoreItem(item, token);
    if (!scored) return null;
    totalScore += scored.base;
    if (!matchField) matchField = scored.field;
  }

  // Average score across tokens so multi-token queries don't dominate
  const avgScore = Math.round(totalScore / tokens.length) + typeBoost;

  return {
    item,
    score: avgScore,
    matchField,
  };
}

export function rankItems(items: SearchItem[], tokens: string[], type: SearchType): SearchMatch[] {
  if (tokens.length === 0) return [];
  const boost = SEARCH_TYPE_BOOST[type];

  const results: SearchMatch[] = [];
  for (const item of items) {
    const match = rankItem(item, tokens, boost);
    if (match) results.push(match);
  }

  return results;
}
