// MCP Streamable HTTP transport endpoint
// Auth: Clerk session required (getMcpSupabase returns null without it → 401)

import { NextResponse } from "next/server";
import { WebStandardStreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/webStandardStreamableHttp.js";
import { getMcpSupabase } from "@/lib/rtk/mcp/auth";
import { createRtkMcpServer } from "@/lib/rtk/mcp/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  // 1. Auth — Clerk session required
  const authed = await getMcpSupabase();
  if (!authed) {
    return NextResponse.json(
      { error: "Unauthorized — Clerk session required" },
      { status: 401 },
    );
  }

  // 2. Create transport + server for this session (stateless mode)
  try {
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined, // stateless mode
      enableJsonResponse: true, // Use JSON responses instead of SSE for simplicity
    });

    const server = createRtkMcpServer(authed.supabase);
    await server.connect(transport);

    // Handle the request using Web Standard Request/Response
    const response = await transport.handleRequest(request);

    await server.close();

    return response;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32603, message }, id: null },
      { status: 500 },
    );
  }
}

export async function GET(request: Request) {
  // Support GET for SSE streams if needed
  const authed = await getMcpSupabase();
  if (!authed) {
    return NextResponse.json(
      { error: "Unauthorized — Clerk session required" },
      { status: 401 },
    );
  }

  try {
    const transport = new WebStandardStreamableHTTPServerTransport({
      sessionIdGenerator: undefined,
    });

    const server = createRtkMcpServer(authed.supabase);
    await server.connect(transport);

    const response = await transport.handleRequest(request);

    // Note: Don't close server immediately for GET/SSE streams
    // The transport will manage the connection lifecycle

    return response;
  } catch (e) {
    const message = e instanceof Error ? e.message : "Internal error";
    return NextResponse.json(
      { jsonrpc: "2.0", error: { code: -32603, message }, id: null },
      { status: 500 },
    );
  }
}
