import { SignUp } from "@clerk/nextjs";
import { ArchronLogomark } from "@/components/icons";

export default function RegisterPage() {
  return (
    <main className="flex min-h-[75vh] flex-col items-center justify-center px-4 py-16 bg-bg relative overflow-hidden">
      {/* เอฟเฟกต์แสงพื้นหลังสร้างบรรยากาศ */}
      <div className="absolute top-1/4 left-1/2 -z-10 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/5 blur-[120px]" />
      
      <div className="w-full max-w-md animate-fade-in">
        <div className="mb-8 text-center">
          <div className="mb-6 flex items-center justify-center gap-2 text-accent">
            <ArchronLogomark className="h-7 w-7" />
            <span className="font-wordmark text-xl font-semibold tracking-[0.2em]">ARCHRON</span>
          </div>
          <span className="text-[11px] uppercase tracking-[0.2em] text-accent/70">
            บัญชีนักอ่าน
          </span>
          <h1 className="mt-3 font-serif text-3xl text-text-heading">สร้างบัญชีนักอ่าน</h1>
          <p className="mx-auto mt-3 max-w-sm text-sm leading-relaxed text-text-secondary/70">
            สมัครเพื่อเก็บบทความ แนวคิด และความคืบหน้าการอ่าน
            โดยเนื้อหาหลักของเว็บไซต์ยังคงเปิดให้อ่านได้โดยไม่ต้องมีบัญชี
          </p>
        </div>

        <SignUp
          path="/th/register"
          routing="path"
          signInUrl="/th/login"
          fallbackRedirectUrl="/studio/editor"
          appearance={{
            variables: {
              colorPrimary: "var(--color-premium)",
              colorBackground: "var(--color-text-heading)",
              colorInputBackground: "rgba(255, 255, 255, 0.06)",
              colorInputText: "var(--color-bg)",
              colorText: "var(--color-border)",
              colorTextSecondary: "var(--color-text-secondary)",
              fontFamily: "var(--font-prompt), sans-serif",
            },
            elements: {
              card: "border border-accent/45 shadow-xl rounded-lg bg-bg-elevated backdrop-blur-md p-6 ring-1 ring-accent/10",
              formButtonPrimary: "bg-gradient-to-br from-accent to-accent hover:brightness-105 text-text-inverse font-semibold transition-all duration-300 py-2.5 rounded-sm border-0",
              footerActionLink: "text-accent-hover hover:text-concept transition-colors",
              headerTitle: "font-serif text-xl text-text-heading tracking-tight",
              headerSubtitle: "text-text-secondary/70 text-xs",
              formFieldLabel: "text-sm font-medium text-text-secondary/80",
              formFieldInput: "border-border/60 bg-text-heading/5 text-text-heading outline-none focus:border-accent/60 rounded-sm py-2 px-3",
              identityPreviewText: "text-text-heading",
              identityPreviewEditButtonIcon: "text-accent",
              socialButtonsBlockButton: "border border-border/60 bg-text-heading/5 text-text-heading hover:bg-text-heading/10 hover:border-accent/40 rounded-sm",
              socialButtonsBlockButtonText: "text-text-heading font-medium",
              dividerLine: "bg-border/40",
              dividerText: "text-sm font-medium text-text-secondary/80",
              formFieldWarningText: "text-error text-xs",
              formFieldErrorText: "text-error text-xs",
              alert: "bg-error/10 border border-error/30 text-error rounded-sm text-xs",
            }
          }}
        />
      </div>
    </main>
  );
}
