"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const ROUTE_COSMOLOGY: Record<string, string> = {
  "/": "sapientia",
  "/faq": "sapientia",
  "/search": "sapientia",
  "/constellation": "sapientia",
  "/guide": "mercurius",
  "/sources": "psyche",
  "/support": "sapientia",
  "/manifesto": "sapientia",
  "/timeline": "mercurius",
  "/external-links": "mercurius",
  "/reading-sets": "psyche",
  "/reading-sets/[slug]": "psyche",
};

const PREFIX_MAP: [string, string][] = [
  ["/articles", "psyche"],
  ["/concepts", "psyche"],
  ["/schools", "mercurius"],
  ["/thinkers", "sapientia"],
  ["/reading-sets", "psyche"],
  ["/studio", "mercurius"],
];

function pathToCosmology(pathname: string): string {
  if (pathname in ROUTE_COSMOLOGY) return ROUTE_COSMOLOGY[pathname];
  for (const [prefix, cosmology] of PREFIX_MAP) {
    if (pathname.startsWith(prefix)) return cosmology;
  }
  return "sapientia";
}

export function CosmologyProvider() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.dataset.cosmology = pathToCosmology(pathname);
  }, [pathname]);

  return null;
}
