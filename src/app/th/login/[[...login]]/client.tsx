"use client";

import { SignIn } from "@clerk/nextjs";

export function LoginForm() {
  return (
    <SignIn
      path="/th/login"
      routing="path"
      signUpUrl="/th/register"
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
          identityPreviewText: "text-text-heading",
          identityPreviewEditButtonIcon: "text-accent",
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
  );
}