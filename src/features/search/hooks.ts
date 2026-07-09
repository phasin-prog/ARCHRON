"use client";

import { useMemo, useState, useCallback } from "react";
import type { SearchItem, SearchOptions, SearchResult } from "./types";
import { search } from "./services";
import { useDebounce } from "@/lib/hooks/use-debounce";

export function useSearch(
  items: SearchItem[],
  initialQuery: string = "",
) {
  const [query, setQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<string>("all");

  const debouncedQuery = useDebounce(query, 200);

  const result = useMemo<SearchResult>(
    () =>
      search(items, debouncedQuery, {
        filters: { type: activeType as any },
      }),
    [items, debouncedQuery, activeType],
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
