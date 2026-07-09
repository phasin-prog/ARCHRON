import { SignIn } from "@clerk/nextjs";
import { ArchronLogomark } from "@/components/icons";

// หน้าล็อกอินบัญชีนักอ่าน — ปรับโฉมเป็น 2 คอลัมน์พรีเมียมตามจิตวิทยาสีและการเล่าเรื่องเช่นกัน
export default function LoginPage() {
  return (
    <main className="relative flex min-h-[85vh] flex-col items-center justify-center overflow-hidden px-4 py-16 bg-bg">
      {/* แสงเรืองออร่าแบบ Cosmic (ทอง + น้ำลึก) ปรับปรุงตามจิตวิทยาสี */}
      <div 
        className="pointer-events-none absolute left-1/4 top-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-concept/8 blur-[130px] animate-pulse" 
        style={{ animationDuration: "12s" }} 
      />
      <div 
        className="pointer-events-none absolute right-1/4 bottom-1/3 -z-10 h-[450px] w-[450px] rounded-full bg-accent/6 blur-[130px]" 
      />

      <div className="mx-auto grid w-full max-w-5xl grid-cols-1 md:grid-cols-12 gap-8 lg:gap-16 items-center animate-fade-in">
        {/* คอลัมน์ซ้าย: เล่าเรื่องราวและอุดมการณ์ของนักอ่าน (Reader's Storytelling Column) */}
        <div className="md:col-span-7 flex flex-col justify-center text-left">
          <div className="mb-6 flex items-center gap-3 text-accent">
            <ArchronLogomark className="h-9 w-9" />
            <span className="font-wordmark text-2xl font-semibold tracking-[0.25em]">ARCHRON</span>
          </div>
          
          <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-accent/80">
            คลังความรู้สะสมส่วนบุคคล · สำหรับผู้อ่าน
          </span>
          
          <h1 className="mt-4 font-serif text-3xl md:text-4xl lg:text-5xl text-text-heading leading-tight font-medium">
            กลับสู่ห้องอ่าน <br className="hidden md:inline" />
            <span className="relative inline-block">
              และพื้นที่ความรู้ของคุณ
              <span className="absolute bottom-1 left-0 h-1.5 w-full bg-accent/20 -z-10 rounded-sm" />
            </span>
          </h1>
          
          <p className="mt-6 max-w-xl text-base leading-[1.8] text-text-body/80">
            เมื่อมีบัญชีนักอ่าน คุณจะสามารถบันทึกประเด็นที่ชื่นชอบ เก็บความคืบหน้าการศึกษา 
            และสร้างการเชื่อมโยงแนวคิดต่างๆ ระหว่างบทความเชิงลึกได้ด้วยตัวคุณเอง 
            โดยที่ข้อมูลและแก่นแท้ของคลังความรู้ทั้งหมดใน ARCHRON 
            จะยังคงเปิดกว้างให้ทุกคนเข้าถึงได้โดยไม่มีเงื่อนไขและไม่ต้องล็อกอิน
          </p>
          
          <div className="mt-8 flex flex-col gap-4 border-l border-accent/30 pl-5 text-sm italic text-text-secondary">
            <p>“ความรู้มีไว้เพื่อจดจำ ความเข้าใจมีไว้เพื่อดำเนินชีวิต”</p>
            <p className="text-xs font-semibold uppercase tracking-wider text-accent/70">— คณะผู้ดูแลคลังความรู้ Archron</p>
          </div>
        </div>

        {/* คอลัมน์ขวา: การ์ดล็อกอินนักอ่าน (Premium Card Layout) */}
        <div className="md:col-span-5 flex flex-col justify-center md:items-end">
          <div className="w-full max-w-sm rounded-lg border border-accent/45 bg-bg-elevated p-1.5 shadow-xl ring-1 ring-accent/10 backdrop-blur-md">
            <SignIn
              path="/th/login"
              routing="path"
              signUpUrl="/th/register"
              fallbackRedirectUrl="/studio/editor"
              appearance={{
                variables: {
                  colorPrimary: "#C49B55",
                  colorBackground: "#2E3349",
                  colorInputBackground: "rgba(255, 255, 255, 0.06)",
                  colorInputText: "#F3EEE5",
                  colorText: "#E7E2D8",
                  colorTextSecondary: "#858992",
                  fontFamily: "var(--font-ibm-plex-thai), sans-serif",
                },
                elements: {
                  cardBox: "shadow-none border-0",
                  card: "bg-transparent p-5 border-0 shadow-none",
                  formButtonPrimary:
                    "bg-gradient-to-br from-accent to-accent hover:brightness-105 text-text-inverse font-semibold transition-all duration-300 py-2.5 rounded-sm border-0",
                  footerActionLink: "text-accent-hover hover:text-concept transition-colors",
                  headerTitle: "font-serif text-lg text-text-heading tracking-tight font-medium",
                  headerSubtitle: "text-text-secondary/60 text-xs",
                  formFieldLabel: "text-text-body/80 text-[11px] font-semibold uppercase tracking-wider",
                  formFieldInput:
                    "border-border/60 bg-text-heading/5 text-text-heading outline-none focus:border-accent/60 rounded-sm py-2 px-3",
                  identityPreviewText: "text-text-heading",
                  identityPreviewEditButtonIcon: "text-accent",
                  socialButtonsBlockButton:
                    "border border-border/60 bg-text-heading/5 text-text-heading hover:bg-text-heading/10 hover:border-accent/40 rounded-sm",
                  socialButtonsBlockButtonText: "text-text-heading font-medium",
                  dividerLine: "bg-border/40",
                  dividerText: "text-text-secondary/55 text-[10px] uppercase tracking-widest",
                  formFieldWarningText: "text-error text-xs",
                  formFieldErrorText: "text-error text-xs",
                  alert: "bg-error/10 border border-error/30 text-error rounded-sm text-xs",
                },
              }}
            />
          </div>
        </div>
      </div>
    </main>
  );
}
