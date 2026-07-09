import type { SearchItem, SearchFilters } from "./types";

export function applyFilters(items: SearchItem[], filters?: SearchFilters): SearchItem[] {
  if (!filters || filters.type === "all" || !filters.type) return items;
  return items.filter((it) => it.type === filters.type);
}
