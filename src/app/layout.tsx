import type { Metadata, Viewport } from "next";
import {
  Inter,
  IBM_Plex_Sans_Thai,
  Noto_Sans_Thai,
  Noto_Serif_Thai,
  Cormorant_Garamond,
} from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Tabbar } from "@/components/tabbar";
import { Fab } from "@/components/fab";
import { SkipToContent } from "@/components/skip-to-content";
import { QuickOpen } from "@/components/quick-open";
import { ConceptPopup } from "@/components/concept-popup";
import { ClerkProvider } from "@clerk/nextjs";


// ── Focus First Typography ──────────────────────────────────────────────
// สาย Display/Heading: Cormorant Garamond (อ่านง่าย, สงบ, คลาสสิก)
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "optional",
});

// สาย Body (Sans — อ่านยาวไม่ล้า): Inter (อังกฤษ) → IBM Plex Sans Thai (ไทย, body)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "optional",
});

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-thai",
  display: "optional",
});

// UI (labels, nav, buttons): Inter + Noto Sans Thai
const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans-thai",
  display: "optional",
});

// Serif Thai fallback — สำหรับ headings ไทย
const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif-thai",
  display: "optional",
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
        className={`${cormorant.variable} ${inter.variable} ${ibmPlexThai.variable} ${notoSansThai.variable} ${notoSerifThai.variable}`}
      >
        <head>
          <meta charSet="utf-8" />
          {/* Custom SVG icons ใช้แทน Material Symbols */}
          <meta name="color-scheme" content="light" />
          <noscript>
            <style>{`.scroll-reveal{opacity:1!important;transform:none!important}`}</style>
          </noscript>

        </head>
        <body className="min-h-screen bg-bg pb-16 text-text-body antialiased lg:pb-0">
          <SkipToContent />
          <SiteHeader />
          {children}
          <SiteFooter />
          <ScrollToTop />
          <Tabbar />
          <Fab />
          <QuickOpen />
          <ConceptPopup />
        </body>
      </html>
    </ClerkProvider>
  );
}
