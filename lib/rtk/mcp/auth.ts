// MCP auth — resolves the Clerk session and returns a Supabase client.
// Uses the service-role client (same pattern as lib/content/server-auth.ts)
// because MCP tools need to read published library/chunks (public RLS) and
// write during refreshLibrary (service-role bypasses RLS).
//
// Auth requirement: a valid Clerk session must exist (auth() returns userId).
// Without it, the MCP endpoint returns 401 before any tool runs.

import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function getMcpSupabase(): Promise<{
  userId: string;
  supabase: SupabaseClient;
} | null> {
  const { userId } = await auth();
  if (!userId) return null;

  // Service-role client — MCP reads public data + runs refreshLibrary writes
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "",
    process.env.SUPABASE_SERVICE_ROLE_KEY ?? "",
    { auth: { persistSession: false } },
  );

  return { userId, supabase };
}
