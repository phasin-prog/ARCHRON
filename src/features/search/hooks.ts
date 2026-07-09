"use client";

import { useMemo, useState, useCallback } from "react";
import type { SearchItem, SearchOptions, SearchResult } from "./types";
import { search } from "./services";

export function useSearch(
  items: SearchItem[],
  initialQuery: string = "",
) {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<string>("all");

  const result = useMemo<SearchResult>(
    () =>
      search(items, query, {
        filters: { type: activeType as any },
      }),
    [items, query, activeType],
  );

  const clear = useCallback(() => {
    setQuery("");
  }, []);

  return {
    query,
    setQuery,
    activeType,
    setActiveType,
    result,
    clear,
  };
}
