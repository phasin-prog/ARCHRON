"use client";

import { useMemo, useState, useCallback } from "react";
import type { SearchItem, SearchResult } from "./types";
import { search } from "./services";

export function useSearch(
  items: SearchItem[],
  initialQuery: string = "",
) {
  const [query, setQuery] = useState(initialQuery);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [activeType, setActiveType] = useState<string>("all");

  const submit = useCallback(() => {
    setSearchQuery(query);
  }, [query]);

  const result = useMemo<SearchResult>(
    () =>
      search(items, searchQuery, {
        filters: { type: activeType as any },
      }),
    [items, searchQuery, activeType],
  );

  const clear = useCallback(() => {
    setQuery("");
    setSearchQuery("");
  }, []);

  return {
    query,
    setQuery,
    searchQuery,
    activeType,
    setActiveType,
    result,
    clear,
    submit,
  };
}
