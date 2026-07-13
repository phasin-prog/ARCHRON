"use server";

import { auth, clerkClient } from "@clerk/nextjs/server";
import { roleFromMetadata, type Role } from "@/lib/content/utils/roles";

export type AdminUser = {
  id: string;
  email: string | null;
  name: string | null;
  role: Role;
};

// ตรวจว่าผู้เรียกเป็นแอดมินจริง (อ่าน role จาก Clerk) — กันการเรียกข้ามสิทธิ
async function requireAdminClient() {
  const { userId } = await auth();
  if (!userId) throw new Error("ยังไม่ได้เข้าสู่ระบบ");
  const client = await clerkClient();
  const me = await client.users.getUser(userId);
  if (roleFromMetadata(me.publicMetadata) !== "admin") {
    throw new Error("ต้องเป็นแอดมินเท่านั้น");
  }
  return client;
}

export async function listUsersAction(): Promise<AdminUser[]> {
  const client = await requireAdminClient();
  const res = await client.users.getUserList({ limit: 100 });
  const list = Array.isArray(res) ? res : res.data;
  return list.map((u) => ({
    id: u.id,
    email: u.emailAddresses?.[0]?.emailAddress ?? null,
    name:
      [u.firstName, u.lastName].filter(Boolean).join(" ") || u.username || null,
    role: roleFromMetadata(u.publicMetadata),
  }));
}

export async function setRoleAction(
  targetUserId: string,
  role: Role,
): Promise<{ ok: boolean; error?: string }> {
  try {
    const client = await requireAdminClient();
    await client.users.updateUser(targetUserId, {
      publicMetadata: { role },
    });
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : "เปลี่ยนบทบาทไม่สำเร็จ" };
  }
}
