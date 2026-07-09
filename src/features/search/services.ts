import type { SearchItem, SearchOptions, SearchResult, SearchType } from "./types";
import { SEARCH_TYPE_LABEL, SEARCH_TYPE_ORDER, SEARCH_TYPE_BOOST } from "./types";
import { tokenize } from "./tokenizer";
import { rankItems } from "./ranking";
import { applyFilters } from "./filters";

function sortByScore(a: { score: number }, b: { score: number }): number {
  return b.score - a.score;
}

const queryCache = new Map<string, SearchResult>();

export function search(
  items: SearchItem[],
  query: string,
  options?: SearchOptions,
): SearchResult {
  const tokens = tokenize(query);

  if (tokens.length === 0) {
    return { query, matches: [], total: 0, groups: [] };
  }

  const filters = options?.filters;
  const filterKey = filters?.type ?? "all";
  const cacheKey = `${query}:${filterKey}:${options?.limit ?? "all"}`;
  const cached = queryCache.get(cacheKey);
  if (cached) return cached;

  const filtered = applyFilters(items, options?.filters);

  const uniqueTypes = new Set(filtered.map((it) => it.type));
  const allMatches = [];

  for (const type of uniqueTypes) {
    const typeItems = filtered.filter((it) => it.type === type);
    const ranked = rankItems(typeItems, tokens, type as SearchType);
    allMatches.push(...ranked);
  }

  allMatches.sort(sortByScore);

  const limit = options?.limit ?? allMatches.length;
  const top = allMatches.slice(0, limit);

  const groups = SEARCH_TYPE_ORDER
    .map((type) => ({
      type,
      items: top.filter((m) => m.item.type === type),
      label: SEARCH_TYPE_LABEL[type],
    }))
    .filter((g) => g.items.length > 0);

  const result: SearchResult = { query, matches: top, total: allMatches.length, groups };
  queryCache.set(cacheKey, result);
  if (queryCache.size > 100) {
    const firstKey = queryCache.keys().next().value;
    if (firstKey) queryCache.delete(firstKey);
  }
  return result;
}
