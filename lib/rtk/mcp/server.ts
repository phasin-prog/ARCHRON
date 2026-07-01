// RTK MCP server — assembles all 8 tools into a McpServer instance.

import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { SupabaseClient } from "@supabase/supabase-js";
import { searchLibrarySchema, searchLibraryHandler } from "./tools/search-library";
import { searchChunksSchema, searchChunksHandler } from "./tools/search-chunks";
import { getLibrarySchema, getLibraryHandler } from "./tools/get-library";
import { getChunkSchema, getChunkHandler } from "./tools/get-chunk";
import { getRecentSchema, getRecentHandler } from "./tools/get-recent";
import { getRelatedSchema, getRelatedHandler } from "./tools/get-related";
import { warmCacheSchema, warmCacheHandler } from "./tools/warm-cache";
import { refreshLibrarySchema, refreshLibraryHandler } from "./tools/refresh-library";

export function createRtkMcpServer(sb: SupabaseClient): McpServer {
  const server = new McpServer({
    name: "archron-rtk",
    version: "0.1.0",
  });

  // Register 8 tools using the new registerTool API
  server.registerTool(
    "searchLibrary",
    {
      description: "Search library metadata by FTS (title > slug/tags > summary). Returns up to 8 results.",
      inputSchema: searchLibrarySchema,
    },
    async (args) => {
      const result = await searchLibraryHandler(sb, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "searchChunks",
    {
      description: "Search chunk metadata by FTS (heading > summary). Returns up to 8 results.",
      inputSchema: searchChunksSchema,
    },
    async (args) => {
      const result = await searchChunksHandler(sb, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "getLibrary",
    {
      description: "Get a single library entry by slug (metadata + r2_key for full doc).",
      inputSchema: getLibrarySchema,
    },
    async (args) => {
      const result = await getLibraryHandler(sb, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "getChunk",
    {
      description: "Get a single chunk by ID — metadata + markdown content loaded from R2.",
      inputSchema: getChunkSchema,
    },
    async (args) => {
      const result = await getChunkHandler(sb, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "getRecent",
    {
      description: "Get recently indexed library entries (by indexed_at desc).",
      inputSchema: getRecentSchema,
    },
    async (args) => {
      const result = await getRecentHandler(sb, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "getRelated",
    {
      description: "Get library entries related to a given slug (shared tags or category).",
      inputSchema: getRelatedSchema,
    },
    async (args) => {
      const result = await getRelatedHandler(sb, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "warmCache",
    {
      description: "Pre-populate Redis cache for given slugs (or recent 10 if omitted).",
      inputSchema: warmCacheSchema,
    },
    async (args) => {
      const result = await warmCacheHandler(sb, args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  server.registerTool(
    "refreshLibrary",
    {
      description: "Re-index one entry (by slug) or all published entries into library + chunks.",
      inputSchema: refreshLibrarySchema,
    },
    async (args) => {
      const result = await refreshLibraryHandler(args);
      return {
        content: [{ type: "text" as const, text: JSON.stringify(result, null, 2) }],
      };
    },
  );

  return server;
}
