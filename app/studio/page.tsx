"use client";

import Link from "next/link";
import { ClerkLoading, SignIn, SignedIn, SignedOut, useUser, useClerk } from "@clerk/nextjs";
import { ArchronLogomark } from "@/components/icons";
import { roleFromMetadata, isAdmin } from "@/lib/content/roles";

// หน้า Studio landing/login เฉพาะนักเขียน — ปรับโฉมเป็น 2 คอลัมน์พรีเมียมตามจิตวิทยาสีและการเล่าเรื่อง
export default function StudioLandingPage() {
  const { user, isLoaded } = useUser();
  const clerk = useClerk();
  const admin = isAdmin(roleFromMetadata(user?.publicMetadata));

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
            <div className="w-full max-w-sm h-[400px] animate-pulse rounded-lg border border-slate-boundary/20 bg-surface-container/20 p-6" />
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-16">
      {/* แสงเรืองออร่าแบบ Cosmic (ทอง + น้ำลึก) ปรับปรุงตามจิตวิทยาสี */}
      <div 
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-psyche/8 blur-[130px] animate-pulse" 
        style={{ animationDuration: "12s" }} 
      />
      <div 
        className="pointer-events-none absolute right-1/4 bottom-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-antique-gold/6 blur-[130px]" 
      />

      {/* กัน flash จอเปล่าระหว่าง Clerk โหลด — SignedIn/SignedOut ยังไม่เรนเดอร์จนกว่า SDK พร้อม */}
      <ClerkLoading>
        <div className="w-full max-w-md" role="status" aria-label="กำลังเตรียมห้องเขียน">
          <div className="rounded-md border border-antique-gold/20 bg-paper-raised/80 p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="mx-auto h-20 w-20 animate-pulse rounded-full bg-surface-3" />
            <div className="mx-auto mt-4 h-6 w-44 animate-pulse rounded bg-surface-3" />
            <div className="mx-auto mt-3 h-4 w-56 animate-pulse rounded bg-surface-3" />
            <div className="mx-auto mt-8 h-11 w-full animate-pulse rounded bg-surface-3" />
            <p className="mt-4 text-xs text-muted">กำลังเตรียมห้องเขียน…</p>
          </div>
        </div>
      </ClerkLoading>

      <SignedOut>
        <div className="mx-auto grid w-full max-w-5xl grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* คอลัมน์ซ้าย: เล่าเรื่องราวและอุดมการณ์ของห้องเขียน (Storytelling Column) */}
          <div className="md:col-span-7 flex flex-col justify-center text-left">
            <div className="mb-6 flex items-center gap-3 text-burnished-gold">
              <ArchronLogomark className="h-9 w-9" />
              <span className="font-wordmark text-2xl font-semibold tracking-[0.25em]">ARCHRON</span>
            </div>
            
            <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-burnished-gold/80">
              Studio · ห้องเขียนของนักเขียน
            </span>
            
            <h1 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-ivory leading-tight font-medium">
              พื้นที่เรียบเรียง <br className="hidden md:inline" />
              <span className="relative inline-block">
                เจตจำนงและการค้นพบ
                <span className="absolute bottom-1 left-0 h-1.5 w-full bg-soft-gold/20 -z-10 rounded-sm" />
              </span>
            </h1>
            
            <p className="mt-6 max-w-xl text-base leading-[1.8] text-soft-ivory/80">
              เบื้องหลังความรู้คือความเข้าใจในมิติต่างๆ ของจิตใจมนุษย์ 
              ที่นี่คือห้องปฏิบัติการของผู้ดูแลระบบและเพื่อนผู้ร่วมเขียนความรู้ 
              เพื่อร่วมกันบันทึก วิเคราะห์ และจัดเก็บข้อเท็จจริงทางวิชาการอย่างเป็นระบบ 
              มีระเบียบอ้างอิง และแยกแยะการตีความออกจากความเป็นจริงเพื่อความเที่ยงธรรมสูงสุด
            </p>
            
            <div className="mt-8 flex flex-col gap-4 border-l border-antique-gold/30 pl-5 text-sm italic text-muted">
              <p>“ตัวอักษรคือความทรงจำ วัสดุคืออารยธรรม”</p>
              <p className="text-xs font-semibold uppercase tracking-wider text-antique-gold/70">— กฎข้อปฏิบัติของคลังความรู้ Archron</p>
            </div>
          </div>

          {/* คอลัมน์ขวา: การ์ดล็อกอินแบบกระจกฝ้า (Premium Card Layout) */}
          <div className="md:col-span-5 flex flex-col justify-center md:items-end">
            <div className="w-full max-w-sm rounded-lg border border-antique-gold/45 bg-paper-raised p-1.5 shadow-xl ring-1 ring-antique-gold/10 backdrop-blur-md">
              <SignIn
                routing="hash"
                signUpUrl="/th/register"
                fallbackRedirectUrl="/studio/editor"
                appearance={{
                  // ⚠️ ข้อยกเว้น design token: Clerk คำนวณเฉดสีต่อยอดจากค่าเหล่านี้ จึงใช้ var() ไม่ได้
                  // ค่า hex ทุกตัวอิง token ปัจจุบันของระบบ (ห้ามใส่ค่านอก palette):
                  // gold #C79A4A · paper-raised #1C2335 · ivory #F4F1EA · soft-ivory #DEDAD2 · muted #8A8F98
                  variables: {
                    colorPrimary: "#C79A4A", // --color-gold (Archron Gold)
                    colorBackground: "#1C2335", // --color-paper-raised
                    colorInputBackground: "rgba(255, 255, 255, 0.06)",
                    colorInputText: "#F4F1EA", // --color-ivory
                    colorText: "#DEDAD2", // --color-soft-ivory
                    colorTextSecondary: "#8A8F98", // --color-muted
                    fontFamily: "var(--font-body), sans-serif", // ฟอนต์ใช้ var() ได้ (ไม่มีการคำนวณ)
                  },
                  elements: {
                    cardBox: "shadow-none border-0",
                    card: "bg-transparent p-5 border-0 shadow-none",
                    formButtonPrimary:
                      "bg-gradient-to-br from-antique-gold to-burnished-gold hover:brightness-105 text-prima font-semibold transition-all duration-300 py-2.5 rounded-sm border-0",
                    footerActionLink: "text-gold-deep hover:text-verdigris transition-colors",
                    headerTitle: "font-serif text-lg text-ivory tracking-tight font-medium",
                    headerSubtitle: "text-on-surface-variant/60 text-xs",
                    formFieldLabel: "text-soft-ivory/80 text-[11px] font-semibold uppercase tracking-wider",
                    formFieldInput:
                      "border-slate-boundary/60 bg-white/5 text-ivory outline-none focus:border-antique-gold/60 rounded-sm py-2 px-3",
                    socialButtonsBlockButton:
                      "border border-slate-boundary/60 bg-white/5 text-ivory hover:bg-white/10 hover:border-antique-gold/40 rounded-sm",
                    socialButtonsBlockButtonText: "text-ivory font-medium",
                    dividerLine: "bg-slate-boundary/40",
                    dividerText: "text-on-surface-variant/55 text-[10px] uppercase tracking-widest",
                    formFieldWarningText: "text-danger text-xs",
                    formFieldErrorText: "text-danger text-xs",
                    alert: "bg-danger/10 border border-danger/30 text-danger rounded-sm text-xs",
                  },
                }}
              />
            </div>
            <p className="mt-6 text-center md:text-right w-full max-w-sm text-xs text-on-surface-variant/50 px-2">
              สำหรับการอ่านและเก็บบทความ ไปที่{" "}
              <Link href="/th/login" className="text-gold-deep hover:text-verdigris font-medium">
                บัญชีนักอ่าน
              </Link>
            </p>
          </div>
        </div>
      </SignedOut>

      <SignedIn>
        <div className="w-full max-w-md">
          {/* การ์ดสรุปโปรไฟล์และปุ่มจัดการบัญชี/ออกจากระบบที่ออกแบบใหม่ */}
          <div className="rounded-md border border-antique-gold/20 bg-paper-raised/80 p-8 text-center shadow-2xl backdrop-blur-md">
            <div className="flex flex-col items-center">
              {user?.imageUrl ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  src={user.imageUrl}
                  alt={user.fullName || "รูปภาพโปรไฟล์"}
                  className="h-20 w-20 rounded-full border-2 border-antique-gold/40 object-cover shadow-lg"
                />
              ) : (
                <span className="material-symbols-outlined text-[72px] text-muted">account_circle</span>
              )}
              <h2 className="mt-4 font-serif text-2xl text-ivory font-medium">
                {user?.fullName || user?.username || "เพื่อนผู้ร่วมเขียน"}
              </h2>
              <p className="mt-1 text-xs text-muted font-mono">{user?.primaryEmailAddress?.emailAddress}</p>
              
              <span className="mt-3 inline-block rounded-full bg-antique-gold/12 border border-antique-gold/30 px-3.5 py-0.5 text-[11px] font-semibold text-antique-gold uppercase tracking-wider">
                {admin ? "ผู้ดูแลระบบ (Admin)" : "นักเขียน (Writer)"}
              </span>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                href="/studio/editor"
                className="inline-flex items-center justify-center gap-2 rounded-sm bg-gradient-to-br from-antique-gold to-burnished-gold px-8 py-3 text-sm font-semibold text-prima transition-transform hover:-translate-y-0.5 shadow-md"
              >
                <span className="material-symbols-outlined text-[20px]">edit_note</span>
                เข้าสู่ห้องเขียน
              </Link>

              {admin ? (
                <div className="grid grid-cols-2 gap-3">
                  <Link
                    href="/studio/users"
                    className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-boundary bg-paper-sunken/40 px-4 py-2.5 text-xs text-ivory transition-colors hover:bg-paper-raised"
                  >
                    <span className="material-symbols-outlined text-[16px]">shield_person</span>
                    จัดการผู้ใช้
                  </Link>
                  <Link
                    href="/studio/comments"
                    className="inline-flex items-center justify-center gap-2 rounded-sm border border-slate-boundary bg-paper-sunken/40 px-4 py-2.5 text-xs text-ivory transition-colors hover:bg-paper-raised"
                  >
                    <span className="material-symbols-outlined text-[16px]">forum</span>
                    ดูแลความเห็น
                  </Link>
                </div>
              ) : null}

              <div className="mt-5 grid grid-cols-2 gap-3 border-t border-slate-boundary/60 pt-5">
                <button
                  onClick={() => clerk.openUserProfile()}
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-antique-gold/30 px-4 py-2 text-xs font-semibold text-antique-gold hover:bg-antique-gold/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">settings</span>
                  จัดการบัญชี
                </button>
                <button
                  onClick={() => clerk.signOut({ redirectUrl: "/studio" })}
                  className="inline-flex items-center justify-center gap-1.5 rounded-sm border border-danger/30 px-4 py-2 text-xs font-semibold text-danger hover:bg-danger/10 transition-colors"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  ออกจากระบบ
                </button>
              </div>
            </div>
          </div>
        </div>
      </SignedIn>
    </main>
  );
}
