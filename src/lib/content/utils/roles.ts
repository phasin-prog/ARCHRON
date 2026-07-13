// ARCHRON — โมเดลบทบาท (role) เก็บใน Clerk publicMetadata.role
// admin = ผู้ดูแล (ทำได้ทุกอย่าง) · writer = นักเขียน (เขียน/แก้/เผยแพร่งานตัวเอง) · user = ผู้ใช้ (อ่านอย่างเดียว)

import { colors } from "@/lib/content/utils/colors";

export type Role = "admin" | "writer" | "user";

export const ROLE_LABEL: Record<Role, string> = {
  admin: "ผู้ดูแล",
  writer: "นักเขียน",
  user: "ผู้ใช้",
};

export const ROLE_META: Record<Role, { icon: string; accent: string }> = {
  admin: { icon: "shield_person", accent: colors.ochreGold }, // Sapientia
  writer: { icon: "edit_note", accent: colors.steelBlue }, // Psyche
  user: { icon: "person", accent: colors.ashGray }, // ash
};

// อ่าน role จากอ็อบเจกต์ผู้ใช้ Clerk (รองรับทั้ง user.publicMetadata และ sessionClaims)
export function roleFromMetadata(meta: unknown): Role {
  const r = (meta as { role?: string } | null | undefined)?.role;
  return r === "admin" || r === "writer" ? r : "user";
}

export const canWrite = (role: Role): boolean => role === "admin" || role === "writer";
export const isAdmin = (role: Role): boolean => role === "admin";
