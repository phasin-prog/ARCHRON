"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSession, useUser } from "@clerk/nextjs";
import { createClerkSupabaseClient } from "@/lib/supabase/client";
import {
  roleFromMetadata,
  ROLE_LABEL,
  ROLE_META,
  type Role,
} from "@/lib/content/roles";
import { listUsersAction, setRoleAction, type AdminUser } from "@/features/studio/actions/users-actions";

const ROLES: Role[] = ["admin", "writer", "user"];

type ProfileLite = {
  clerk_user_id: string;
  username: string | null;
  title: string | null;
  writer_request: boolean;
};

export default function StudioUsersPage() {
  const { user, isLoaded } = useUser();
  const { session } = useSession();
  const role = roleFromMetadata(user?.publicMetadata);

  const supabase = useMemo(
    () => createClerkSupabaseClient(async () => (await session?.getToken()) ?? null),
    [session],
  );

  const [users, setUsers] = useState<AdminUser[]>([]);
  const [profiles, setProfiles] = useState<Record<string, ProfileLite>>({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [list, prof] = await Promise.all([
        listUsersAction(),
        supabase
          .from("profiles")
          .select("clerk_user_id, username, title, writer_request"),
      ]);
      setUsers(list);
      const map: Record<string, ProfileLite> = {};
      for (const p of (prof.data as ProfileLite[] | null) ?? []) {
        map[p.clerk_user_id] = p;
      }
      setProfiles(map);
      setMessage(null);
    } catch (e) {
      setMessage(e instanceof Error ? e.message : "โหลดรายชื่อไม่สำเร็จ");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    if (role === "admin") load();
  }, [role, load]);

  async function changeRole(id: string, newRole: Role) {
    const res = await setRoleAction(id, newRole);
    if (res.ok) {
      setUsers((us) => us.map((u) => (u.id === id ? { ...u, role: newRole } : u)));
      setMessage("อัปเดตบทบาทแล้ว ✓");
    } else {
      setMessage(res.error ?? "เปลี่ยนบทบาทไม่สำเร็จ");
    }
  }

  // กั้นสิทธิ: เฉพาะแอดมิน
  if (isLoaded && role !== "admin") {
    return (
      <main className="mx-auto flex min-h-[70vh] max-w-lg flex-col items-center justify-center px-6 text-center">
        <span className="flex h-14 w-14 items-center justify-center rounded-full border border-accent/30 text-accent">
          <span className="inline-flex items-center justify-center w-6.5 w-6.5 text-[26px]" aria-hidden="true">🛡</span>
        </span>
        <h1 className="mt-6 font-serif text-2xl text-text-heading">เฉพาะผู้ดูแล</h1>
        <p className="mt-3 text-sm text-text-secondary/70">
          หน้านี้สำหรับแอดมินเท่านั้น
        </p>
        <Link href="/studio" className="mt-6 text-sm text-accent hover:underline">
          ← กลับห้องเขียน
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-6 py-20">
      <header className="mb-10">
        <span className="text-[11px] uppercase tracking-[0.2em] text-accent/70">
          Studio · ผู้ดูแล
        </span>
        <h1 className="mt-2 font-serif text-3xl text-text-heading">จัดการผู้ใช้</h1>
        <p className="mt-2 text-sm text-text-secondary/70">
          กำหนดบทบาทผู้ใช้ และอนุมัติคำขอเป็นนักเขียน
        </p>
      </header>

      {message ? <p className="mb-6 text-sm text-accent">{message}</p> : null}

      {loading ? (
        <p className="text-sm text-text-secondary">กำลังโหลด...</p>
      ) : (
        <div className="overflow-hidden rounded-md border border-border/50">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border/50 bg-surface-1/60 text-left text-text-secondary/70">
                <th className="px-4 py-3 font-medium">ผู้ใช้</th>
                <th className="px-4 py-3 font-medium">บทบาท</th>
                <th className="px-4 py-3 font-medium">เปลี่ยนบทบาท</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const p = profiles[u.id];
                const meta = ROLE_META[u.role];
                const requested = p?.writer_request && u.role === "user";
                return (
                  <tr key={u.id} className="border-b border-border/30 last:border-0">
                    <td className="px-4 py-3">
                      <div className="flex flex-col">
                        <span className="text-text-heading">
                          {p?.username ? `@${p.username}` : u.name || "—"}
                          {p?.title ? (
                            <span className="ml-2 text-xs text-accent/80">· {p.title}</span>
                          ) : null}
                        </span>
                        <span className="text-xs text-text-secondary/50">{u.email}</span>
                        {requested ? (
                          <span className="mt-1 inline-flex w-fit items-center gap-1 rounded-full bg-warning/15 px-2 py-0.5 text-[10px] text-warning">
                            <span className="inline-flex items-center justify-center w-3 h-3 text-[12px]" aria-hidden="true">✍</span>
                            ขอเป็นนักเขียน
                          </span>
                        ) : null}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium"
                        style={{ backgroundColor: `${meta.accent}1f`, color: meta.accent }}
                      >
                        <span className="inline-flex items-center justify-center w-[1em] h-[1em] text-[14px]" aria-hidden="true">{meta.icon === "admin_panel_settings" ? "🛡" : meta.icon === "person" ? "👤" : meta.icon === "edit_note" ? "✍" : "◆"}</span>
                        {ROLE_LABEL[u.role]}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <select
                        value={u.role}
                        onChange={(e) => changeRole(u.id, e.target.value as Role)}
                        className="rounded-md border border-text-heading/15 bg-text-heading/50 px-2 py-1.5 text-sm text-text-heading outline-none focus:border-accent/50"
                      >
                        {ROLES.map((r) => (
                          <option key={r} value={r}>
                            {ROLE_LABEL[r]}
                          </option>
                        ))}
                      </select>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="mt-10">
        <Link href="/studio" className="text-sm text-accent hover:underline">
          ← กลับห้องเขียน
        </Link>
      </div>
    </main>
  );
}
