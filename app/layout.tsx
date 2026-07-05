import type { Metadata, Viewport } from "next";
import {
  Inter,
  IBM_Plex_Serif,
  IBM_Plex_Sans_Thai,
  Noto_Sans_Thai,
  Noto_Serif_Thai,
  Playfair_Display,
  Cinzel,
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
import { SymbolicBackground } from "@/components/symbolic-background";
import { ClerkProvider } from "@clerk/nextjs";


// ── Dynamic Typography (สองภาษา: อังกฤษขึ้นก่อน → ไทย) ──────────────────────
// สาย Body (Modern Minimal): Inter (อังกฤษ) → Noto Sans Thai (ไทย)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

// สาย Heading (Serif): IBM Plex Serif (อังกฤษ) → Noto Serif Thai (ไทย)
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["500", "600", "700"],
  variable: "--font-noto-serif-thai",
  display: "swap",
});

// IBM Plex Sans Thai — คงไว้สำหรับ UI ฝั่ง Clerk (login / register / studio)
const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600"],
  variable: "--font-ibm-plex-thai",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["500", "600"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// Cinzel — wordmark ARCHRON ตาม brand board (ตระกูลโรมันคลาสสิก ใช้กับชื่อแบรนด์ละตินเท่านั้น)
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600", "700"],
  variable: "--font-cinzel",
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
        className={`${inter.variable} ${notoSansThai.variable} ${ibmPlexSerif.variable} ${notoSerifThai.variable} ${ibmPlexThai.variable} ${playfair.variable} ${cinzel.variable}`}
      >
        <head>
          <meta charSet="utf-8" />
          {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router ไม่มี pages/_document; โหลด Material Symbols ที่นี่ถูกต้องแล้ว */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
          />
          <meta name="color-scheme" content="dark" />
          <noscript>
            <style>{`.scroll-reveal{opacity:1!important;transform:none!important}`}</style>
          </noscript>

        </head>
        <body className="min-h-screen bg-deep-navy pb-16 text-ivory antialiased md:pb-0">
          <SkipToContent />
          <SymbolicBackground />
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
