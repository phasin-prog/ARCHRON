export type SearchType = "concept" | "article" | "resource" | "section";

export type SearchItem = {
  id: string;
  type: SearchType;
  title: string;
  thaiTitle?: string;
  description?: string;
  href: string;
  external?: boolean;
  badge?: string;
  keywords: string;
};

export type SearchFilters = {
  type?: SearchType | "all";
};

export type SearchOptions = {
  filters?: SearchFilters;
  limit?: number;
};

export type SearchMatch = {
  item: SearchItem;
  score: number;
  matchField?: string;
};

export type SearchResultGroup = {
  type: SearchType;
  items: SearchMatch[];
  label: string;
};

export type SearchResult = {
  query: string;
  matches: SearchMatch[];
  total: number;
  groups: SearchResultGroup[];
};

export type SearchEngine = {
  search: (query: string, options?: SearchOptions) => SearchResult;
  getIndex: () => SearchItem[];
};

export const SEARCH_TYPE_LABEL: Record<SearchType, string> = {
  concept: "คลังแนวคิด",
  article: "บทความ",
  resource: "ทรัพยากรภายนอก",
  section: "หน้า",
};

export const SEARCH_TYPE_ORDER: SearchType[] = ["concept", "article", "resource", "section"];

export const SEARCH_TYPE_BOOST: Record<SearchType, number> = {
  concept: 15,
  article: 10,
  resource: 5,
  section: 0,
};
