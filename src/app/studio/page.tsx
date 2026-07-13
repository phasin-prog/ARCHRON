"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ClerkLoading, SignIn, SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { ArchronLogomark } from "@/components/icons";
import { roleFromMetadata, canWrite, isAdmin } from "@/lib/content/utils/roles";
import { EditorIcon } from "@/components/studio/editor-icon";

// หน้า Studio landing/login เฉพาะนักเขียน — ปรับโฉมเป็น 2 คอลัมน์พรีเมียมตามจิตวิทยาสีและการเล่าเรื่อง
export default function StudioLandingPage() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const router = useRouter();
  const role = roleFromMetadata(user?.publicMetadata);
  const admin = isAdmin(role);
  const writer = canWrite(role);

  useEffect(() => {
    if (user && writer) {
      router.replace("/studio/dashboard");
    }
  }, [user, writer, router]);

  if (!isLoaded) {
    return (
      <main className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-16">
        <div className="mx-auto w-full max-w-5xl grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          <div className="md:col-span-7 flex flex-col justify-center text-left opacity-30 animate-pulse">
            <div className="h-8 w-48 bg-surface-3 rounded mb-6" />
            <div className="h-4 w-28 bg-surface-3 rounded mb-4" />
            <div className="h-12 w-96 bg-surface-3 rounded mb-4" />
            <div className="h-20 w-full bg-surface-3 rounded" />
          </div>
          <div className="md:col-span-5 flex flex-col justify-center md:items-end">
            <div className="w-full max-w-lg overflow-hidden rounded-2xl border border-border/20 bg-bg/40">
              <div className="h-1 w-full bg-surface-3" />
              <div className="px-8 pt-8 pb-6 space-y-4">
                <div className="flex items-start gap-5">
                  <div className="h-20 w-20 shrink-0 animate-pulse rounded-xl bg-surface-3" />
                  <div className="flex-1 space-y-3 pt-1">
                    <div className="h-6 w-40 animate-pulse rounded bg-surface-3" />
                    <div className="h-3 w-52 animate-pulse rounded bg-surface-3" />
                    <div className="h-5 w-24 animate-pulse rounded-full bg-surface-3" />
                  </div>
                </div>
              </div>
              <div className="mx-8 h-px bg-surface-3/40" />
              <div className="px-8 py-6 space-y-3">
                <div className="h-12 w-full animate-pulse rounded-xl bg-surface-3" />
                <div className="h-14 w-full animate-pulse rounded-xl bg-surface-3" />
                <div className="flex gap-2.5">
                  <div className="h-10 flex-1 animate-pulse rounded-xl bg-surface-3" />
                  <div className="h-10 flex-1 animate-pulse rounded-xl bg-surface-3" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (user && writer) return null;

  return (
    <main className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* แสงเรืองออร่าแบบ Cosmic (ทอง + น้ำลึก) ปรับปรุงตามจิตวิทยาสี */}
      <div 
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] rounded-full bg-concept/8 blur-[130px] animate-pulse" 
        style={{ animationDuration: "12s" }} 
      />
      <div 
        className="pointer-events-none absolute right-1/4 bottom-1/3 -z-10 h-[300px] w-[300px] sm:h-[450px] sm:w-[450px] rounded-full bg-accent/6 blur-[130px]" 
      />

      {/* กัน flash จอเปล่าระหว่าง Clerk โหลด — SignedIn/SignedOut ยังไม่เรนเดอร์จนกว่า SDK พร้อม */}
      <ClerkLoading>
        <div className="w-full max-w-md" role="status" aria-label="กำลังเตรียมห้องเขียน">
          <div className="rounded-md border border-accent/20 bg-bg-elevated/80 p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-surface-3" />
            <div className="mx-auto mt-4 h-6 w-44 animate-pulse rounded bg-surface-3" />
            <div className="mx-auto mt-3 h-4 w-56 animate-pulse rounded bg-surface-3" />
            <div className="mx-auto mt-8 h-11 w-full animate-pulse rounded bg-surface-3" />
            <p className="mt-4 text-xs text-text-secondary">กำลังเตรียมห้องเขียน…</p>
          </div>
        </div>
      </ClerkLoading>

      <SignedOut>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* คอลัมน์ซ้าย: เล่าเรื่องราวและอุดมการณ์ของห้องเขียน (Storytelling Column) */}
          <div className="md:col-span-7 flex flex-col justify-center text-left">
            <div className="mb-6 flex items-center gap-3 text-accent">
              <ArchronLogomark className="h-9 w-9" />
              <span className="font-wordmark text-2xl font-semibold tracking-[0.25em]">ARCHRON</span>
            </div>
            
            <span className="text-sm font-medium text-text-secondary/80">
              Studio · ห้องเขียนของนักเขียน
            </span>
            
            <h1 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-text-heading leading-tight font-medium">
              พื้นที่เรียบเรียง <br className="hidden md:inline" />
              <span className="relative inline-block">
                เจตจำนงและการค้นพบ
                <span className="absolute bottom-1 left-0 h-1.5 w-full bg-accent/20 -z-10 rounded-sm" />
              </span>
            </h1>
            
            <p className="mt-6 max-w-xl text-base leading-[1.8] text-text-body/80">
              เบื้องหลังความรู้คือความเข้าใจในมิติต่างๆ ของจิตใจมนุษย์ 
              ที่นี่คือห้องปฏิบัติการของผู้ดูแลระบบและเพื่อนผู้ร่วมเขียนความรู้ 
              เพื่อร่วมกันบันทึก วิเคราะห์ และจัดเก็บข้อเท็จจริงทางวิชาการอย่างเป็นระบบ 
              มีระเบียบอ้างอิง และแยกแยะการตีความออกจากความเป็นจริงเพื่อความเที่ยงธรรมสูงสุด
            </p>
            
            <div className="mt-8 flex flex-col gap-4 border-l border-accent/30 pl-5 text-sm italic text-text-secondary">
              <p>“ตัวอักษรคือความทรงจำ วัสดุคืออารยธรรม”</p>
              <p className="text-sm font-medium text-text-secondary/80">— กฎข้อปฏิบัติของคลังความรู้ Archron</p>
            </div>
          </div>

          {/* คอลัมน์ขวา: การ์ดล็อกอินแบบกระจกฝ้า (Premium Card Layout) */}
          <div className="md:col-span-5 flex flex-col justify-center md:items-end">
            <div className="w-full max-w-sm rounded-lg border border-accent/45 bg-bg-elevated p-1.5 shadow-xl ring-1 ring-accent/10 backdrop-blur-md">
              <SignIn
                routing="hash"
                signUpUrl="/th/register"
                fallbackRedirectUrl="/studio/editor"
                appearance={{
                  // ⚠️ Clerk คำนวณเฉดสีต่อยอดจากค่า hex → ใช้ var() ไม่ได้ อ้างอิงจาก colors.ts
                  variables: {
                    colorPrimary: "#C49B55", // --color-gold (Archron Gold)
                    colorBackground: "#1C2335", // --color-paper-raised
                    colorInputBackground: "rgba(255, 255, 255, 0.06)",
                    colorInputText: "#F4F1EA", // --color-ivory
                    colorText: "#DEDAD2", // --color-text-body
                    colorTextSecondary: "#8A8F98", // --color-muted
                    fontFamily: "var(--font-body), sans-serif", // ฟอนต์ใช้ var() ได้ (ไม่มีการคำนวณ)
                  },
                  elements: {
                    cardBox: "shadow-none border-0",
                    card: "bg-transparent p-5 border-0 shadow-none",
                    formButtonPrimary:
                      "bg-gradient-to-br from-accent to-accent hover:brightness-105 text-text-inverse font-semibold transition-all duration-300 py-2.5 rounded-sm border-0",
                    footerActionLink: "text-accent-hover hover:text-concept transition-colors",
                    headerTitle: "font-serif text-lg text-text-heading tracking-tight font-medium",
                    headerSubtitle: "text-text-secondary/60 text-xs",
                    formFieldLabel: "text-sm font-medium text-text-secondary/80",
                    formFieldInput:
                      "border-border/60 bg-text-heading/5 text-text-heading outline-none focus:border-accent/60 rounded-sm py-2 px-3",
                    socialButtonsBlockButton:
                      "border border-border/60 bg-text-heading/5 text-text-heading hover:bg-text-heading/10 hover:border-accent/40 rounded-sm",
                    socialButtonsBlockButtonText: "text-text-heading font-medium",
                    dividerLine: "bg-border/40",
                    dividerText: "text-sm font-medium text-text-secondary/80",
                    formFieldWarningText: "text-error text-xs",
                    formFieldErrorText: "text-error text-xs",
                    alert: "bg-error/10 border border-error/30 text-error rounded-sm text-xs",
                  },
                }}
              />
            </div>
            <p className="mt-6 text-center md:text-right w-full max-w-sm text-xs text-text-secondary/50 px-2">
              สำหรับการอ่านและเก็บบทความ ไปที่{" "}
              <Link href="/th/login" className="text-accent-hover hover:text-concept font-medium">
                บัญชีนักอ่าน
              </Link>
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="w-full max-w-lg">
          {/* การ์ดโปรไฟล์ — Premium Dashboard Card */}
          <div className="group relative overflow-hidden rounded-2xl border border-border/30 bg-bg/60 shadow-2xl backdrop-blur-xl">
            {/* Gradient accent bar ด้านบน */}
            <div className="h-1 w-full bg-gradient-to-r from-accent via-accent to-accent/40" />

            {/* Header section — Avatar + Identity */}
            <div className="relative px-8 pt-8 pb-6">
              {/* Background glow */}
              <div
                className="pointer-events-none absolute -right-20 -top-20 h-60 w-60 rounded-full opacity-30 blur-[80px] transition-opacity duration-700 group-hover:opacity-50"
                style={{ background: "radial-gradient(circle, var(--color-accent), transparent 70%)" }}
                aria-hidden="true"
              />

              <div className="relative z-10 flex items-start gap-5">
                {/* Avatar */}
                {user?.imageUrl ? (
                  <div className="relative shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={user.imageUrl}
                      alt={user.fullName || "รูปภาพโปรไฟล์"}
                      width="80"
                      height="80"
                      className="h-20 w-20 rounded-xl border-2 border-accent/30 object-cover shadow-lg transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                    {/* Online indicator */}
                    <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-bg bg-concept" />
                  </div>
                ) : (
                  <span className="inline-flex items-center justify-center w-[72px] h-[72px] text-[72px] text-text-secondary" aria-hidden="true">👤</span>
                )}

                {/* Name + Email + Role */}
                <div className="min-w-0 flex-1 pt-1">
                  <h2 className="truncate font-serif text-2xl font-medium text-text-heading">
                    {user?.fullName || user?.username || "เพื่อนผู้ร่วมเขียน"}
                  </h2>
                  <p className="mt-1 truncate font-mono text-xs text-text-secondary/60">
                    {user?.primaryEmailAddress?.emailAddress}
                  </p>
                  <span className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-accent/25 bg-accent/8 px-3 py-0.5 text-sm font-medium text-text-secondary/80">
                    <span className={`h-1.5 w-1.5 rounded-full ${admin ? "bg-concept" : "bg-accent"}`} />
                    {admin ? "ผู้ดูแลระบบ" : "นักเขียน"}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="mx-8 h-px bg-gradient-to-r from-transparent via-border/40 to-transparent" />

            {/* Actions */}
            <div className="px-8 py-6 space-y-3">
              {/* Primary CTA — เข้าสู่ห้องเขียน */}
              <Link
                href="/studio/editor"
                className="group/btn relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-xl bg-gradient-to-br from-accent to-accent px-6 py-3.5 text-sm font-semibold text-text-inverse shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-accent/20 focus-visible:ring-2 focus-visible:ring-accent focus-visible:outline-none"
              >
                  <EditorIcon name="edit_note" className="h-5 w-5" />
                เข้าสู่ห้องเขียน
                <EditorIcon name="arrow_right" className="h-[18px] w-[18px] transition-transform duration-300 group-hover/btn:translate-x-1" />
              </Link>

              {/* Admin grid — จัดการผู้ใช้ / ดูแลความเห็น */}
              {admin ? (
                <div className="grid grid-cols-2 gap-2.5">
                  <Link
                    href="/studio/users"
                    className="group/admin flex items-center gap-2.5 rounded-xl border border-border/30 bg-text-heading/[0.02] px-4 py-3 text-left text-xs font-medium text-text-heading transition-all duration-300 hover:-translate-y-0.5 hover:border-concept/40 hover:bg-concept/5 hover:shadow-lg hover:shadow-concept/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-concept/20 bg-concept/10 text-concept transition-transform duration-300 group-hover/admin:scale-110">
                      <EditorIcon name="edit_note" className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="block text-[11px] text-text-heading">จัดการผู้ใช้</span>
                      <span className="block text-[10px] text-text-secondary/50">User Management</span>
                    </div>
                  </Link>
                  <Link
                    href="/studio/comments"
                    className="group/admin flex items-center gap-2.5 rounded-xl border border-border/30 bg-text-heading/[0.02] px-4 py-3 text-left text-xs font-medium text-text-heading transition-all duration-300 hover:-translate-y-0.5 hover:border-thinker/40 hover:bg-thinker/5 hover:shadow-lg hover:shadow-thinker/5"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-thinker/20 bg-thinker/10 text-thinker transition-transform duration-300 group-hover/admin:scale-110">
                      <EditorIcon name="format_quote" className="h-4 w-4" />
                    </span>
                    <div>
                      <span className="block text-[11px] text-text-heading">ดูแลความเห็น</span>
                      <span className="block text-[10px] text-text-secondary/50">Comments</span>
                    </div>
                  </Link>
                </div>
              ) : null}

              {/* Secondary actions — จัดการบัญชี / ออกจากระบบ */}
              <div className="flex gap-2.5 pt-1">
                <button
                  onClick={() => clerk.openUserProfile()}
                  className="group/sec flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/30 bg-text-heading/[0.015] px-4 py-2.5 text-[11px] font-medium text-text-secondary/70 transition-all duration-300 hover:border-accent/30 hover:text-text-heading hover:bg-text-heading/[0.04]"
                >
                  <EditorIcon name="edit_note" className="h-[15px] w-[15px] transition-transform duration-300 group-hover/sec:rotate-45" />
                  จัดการบัญชี
                </button>
                <button
                  onClick={() => clerk.signOut({ redirectUrl: "/studio" })}
                  className="group/sec flex flex-1 items-center justify-center gap-2 rounded-xl border border-border/30 bg-text-heading/[0.015] px-4 py-2.5 text-[11px] font-medium text-text-secondary/70 transition-all duration-300 hover:border-error/30 hover:text-error hover:bg-error/5"
                >
                  <EditorIcon name="logout" className="h-[15px] w-[15px] transition-transform duration-300 group-hover/sec:-translate-x-0.5" />
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>

          {/* Byline */}
          <p className="mt-6 text-center text-[11px] text-text-secondary/40">
            สำหรับการอ่านและเก็บบทความ ไปที่{" "}
            <Link href="/th/login" className="text-accent/70 hover:text-accent font-medium transition-colors">
              บัญชีนักอ่าน
            </Link>
          </p>
        </div>
      </SignedIn>
    </main>
  );
}
