"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useAuth, useUser } from "@clerk/nextjs";
import { roleFromMetadata, ROLE_LABEL, ROLE_META, canWrite } from "@/lib/content/roles";
import {
  getMyProfileAction,
  upsertMyProfileAction,
  requestWriterAction,
} from "./actions";
import type { Profile } from "@/lib/content/profile-db";

export default function StudioProfilePage() {
  const { userId } = useAuth();
  const { user } = useUser();

  const role = roleFromMetadata(user?.publicMetadata);
  const roleMeta = ROLE_META[role];

  const [username, setUsername] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [title, setTitle] = useState("");
  const [writerRequested, setWriterRequested] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userId) return;
    let active = true;
    (async () => {
      const p: Profile | null = await getMyProfileAction();
      if (active && p) {
        setUsername(p.username ?? "");
        setDisplayName(p.display_name ?? "");
        setTitle(p.title ?? "");
        setWriterRequested(p.writer_request);
      }
    })();
    return () => {
      active = false;
    };
  }, [userId]);

  async function handleSave() {
    if (!userId) {
      setMessage("ยังไม่ได้เข้าสู่ระบบ");
      return;
    }
    setSaving(true);
    const { error } = await upsertMyProfileAction({
      username,
      display_name: displayName,
      title,
    });
    setSaving(false);
    setMessage(error ? `บันทึกไม่สำเร็จ: ${error}` : "บันทึกโปรไฟล์แล้ว ✓");
  }

  async function handleRequestWriter() {
    if (!userId) return;
    const { error } = await requestWriterAction();
    if (!error) {
      setWriterRequested(true);
      setMessage("ส่งคำขอเป็นนักเขียนแล้ว — รอแอดมินอนุมัติ");
    } else {
      setMessage(`ส่งคำขอไม่สำเร็จ: ${error}`);
    }
  }

  // โทนเดียวกับระบบฟอร์มหลัก — surface tokens (เดิมใช้ charcoal/ink ซึ่งเป็น alias ยุคเก่า)
  const inputClass =
    "w-full rounded-md border border-slate-boundary/50 bg-surface-container-low px-3 py-2 text-ivory outline-none transition-colors focus:border-burnished-gold/50";

  return (
    <main className="mx-auto max-w-2xl px-6 py-20">
      <header className="mb-10">
        <span className="text-[11px] uppercase tracking-[0.2em] text-burnished-gold/70">
          Studio · โปรไฟล์
        </span>
        <h1 className="mt-2 font-serif text-3xl text-ivory">โปรไฟล์ของฉัน</h1>
        <p className="mt-2 text-sm text-on-surface-variant/70">
          ตั้งชื่อผู้ใช้ ชื่อที่แสดง และยศของคุณบน ARCHRON
        </p>
      </header>

      <div className="archron-panel mb-8 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <span
            className="flex h-10 w-10 items-center justify-center rounded-md"
            style={{ backgroundColor: `${roleMeta.accent}1f`, color: roleMeta.accent }}
          >
            <span className="material-symbols-outlined text-[22px]">{roleMeta.icon}</span>
          </span>
          <div>
            <p className="text-xs text-on-surface-variant/60">บทบาท</p>
            <p className="font-serif text-lg" style={{ color: roleMeta.accent }}>
              {ROLE_LABEL[role]}
            </p>
          </div>
        </div>
        {canWrite(role) ? (
          <Link
            href="/studio/editor"
            className="inline-flex items-center gap-1.5 border border-burnished-gold/30 bg-burnished-gold/10 px-4 py-2 text-xs font-semibold tracking-[0.05em] text-burnished-gold transition-colors hover:bg-burnished-gold hover:text-prima"
          >
            <span className="material-symbols-outlined text-[16px]">edit_note</span>
            เข้าห้องเขียน
          </Link>
        ) : null}
      </div>

      {message ? (
        <p className="mb-6 text-sm text-soft-gold">{message}</p>
      ) : null}

      <div className="space-y-5">
        <div>
          <label className="mb-1 block text-sm text-soft-ivory">ชื่อผู้ใช้ (Username)</label>
          <input className={inputClass} value={username} onChange={(e) => setUsername(e.target.value)} placeholder="เช่น phasin" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-soft-ivory">ชื่อที่แสดง</label>
          <input className={inputClass} value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="ชื่อที่ปรากฏบนงานเขียน" />
        </div>
        <div>
          <label className="mb-1 block text-sm text-soft-ivory">ยศ / ตำแหน่ง</label>
          <input className={inputClass} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="เช่น ผู้สนับสนุน, นักเขียนกิตติมศักดิ์" />
        </div>
        <button onClick={handleSave} disabled={saving} className="inline-flex items-center gap-2 bg-gradient-to-br from-antique-gold to-burnished-gold px-6 py-2.5 text-sm font-semibold text-prima transition-transform hover:-translate-y-0.5 disabled:opacity-50">
          <span className="material-symbols-outlined text-[18px]">save</span>
          {saving ? "กำลังบันทึก..." : "บันทึกโปรไฟล์"}
        </button>
      </div>

      {role === "user" ? (
        <div className="archron-panel mt-10 p-5">
          <h2 className="font-serif text-lg text-ivory">อยากร่วมเป็นนักเขียน?</h2>
          <p className="mt-2 text-sm leading-relaxed text-on-surface-variant/70">
            ผู้ใช้ทั่วไปอ่านได้ทุกอย่าง หากต้องการเขียนและเรียบเรียงเนื้อหา ส่งคำขอเป็นนักเขียนเพื่อให้แอดมินพิจารณา
          </p>
          <button onClick={handleRequestWriter} disabled={writerRequested} className="mt-4 inline-flex items-center gap-2 rounded border border-burnished-gold/40 px-4 py-2 text-sm text-burnished-gold transition-colors hover:bg-burnished-gold/10 disabled:opacity-50">
            <span className="material-symbols-outlined text-[18px]">how_to_reg</span>
            {writerRequested ? "ส่งคำขอแล้ว — รออนุมัติ" : "ขอเป็นนักเขียน"}
          </button>
        </div>
      ) : null}

      <div className="mt-10">
        <Link href="/studio" className="text-sm text-soft-gold hover:underline">← กลับห้องเขียน</Link>
      </div>
    </main>
  );
}
