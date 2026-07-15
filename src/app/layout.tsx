import type { Metadata, Viewport } from "next";
import {
  EB_Garamond,
  Crimson_Pro,
  Prompt,
  Figtree,
  Noto_Serif_Thai,
} from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { SkipToContent } from "@/components/skip-to-content";
import { QuickOpen } from "@/components/quick-open-wrapper";
import { ConceptPopup } from "@/components/concept-popup-wrapper";
import { Tabbar } from "@/components/tabbar-wrapper";
import { ClerkProvider } from "@clerk/nextjs";


// ── Classic Garamond Typography (Pairing #5) ─────────────────────────────
// Display/Heading ENG: EB Garamond — pure, bookish, timeless
// Body ENG: Crimson Pro — elegant academic serif
// Body ไทย: Prompt — สะอาด โมเดิร์น อ่านง่าย
// UI: Figtree — friendly modern sans
// Thai Heading: Noto Serif Thai — เข้ากับ Garamond
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-crimson-pro",
  display: "swap",
});

const prompt = Prompt({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-prompt",
  display: "swap",
});

const figtree = Figtree({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-figtree",
  display: "swap",
});

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif-thai",
  display: "swap",
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  title: "ARCHRON — คลังความรู้เพื่อเข้าใจจิตวิญญาณของมนุษย์",
  description:
    "ARCHRON — คลังความรู้เพื่อเข้าใจจิตวิญญาณของมนุษย์ ข้ามผ่านห้วงเวลา และศาสตร์วิชา สำนักศึกษามนุษย์ที่เชื่อมจิตวิทยา จิตวิเคราะห์ ปรัชญา ประวัติศาสตร์ ภาษา และศาสตร์ว่าด้วยมนุษย์เข้าด้วยกัน โดยแยกแหล่งที่มา ข้อเท็จจริง และการตีความออกจากกัน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html
        lang="th"
        className={`${ebGaramond.variable} ${crimsonPro.variable} ${prompt.variable} ${figtree.variable} ${notoSerifThai.variable}`}
      >
        <head>
          <meta charSet="utf-8" />
          <meta name="color-scheme" content="light" />
          <noscript>
            <style>{`.scroll-reveal{opacity:1!important;transform:none!important}`}</style>
          </noscript>
        </head>
        <body className="min-h-screen bg-bg pb-28 text-text-body antialiased lg:pb-0">
          <SkipToContent />
          <SiteHeader />
          {children}
          <SiteFooter />
          <ScrollToTop />
          <Tabbar />
          <QuickOpen />
          <ConceptPopup />
        </body>
      </html>
    </ClerkProvider>
  );
}
