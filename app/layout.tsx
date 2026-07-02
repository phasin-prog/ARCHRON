import type { Metadata, Viewport } from "next";
import {
  Inter,
  IBM_Plex_Serif,
  IBM_Plex_Sans_Thai,
  Noto_Sans_Thai,
  Noto_Serif_Thai,
  Cinzel,
  EB_Garamond,
} from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AccentController } from "@/components/accent-controller";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Tabbar } from "@/components/tabbar";
import { Fab } from "@/components/fab";
import { SkipToContent } from "@/components/skip-to-content";
import { QuickOpen } from "@/components/quick-open";
import { IntroPreloader } from "@/components/hero/intro-preloader";
import { ClerkProvider } from "@clerk/nextjs";


// ── Dynamic Typography (สองภาษา: อังกฤษขึ้นก่อน → ไทย) ──────────────────────
// สาย Body (Modern Minimal): Inter (อังกฤษ) → Noto Sans Thai (ไทย)
const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-inter",
  display: "swap",
});

const notoSansThai = Noto_Sans_Thai({
  // เฉพาะ subset "thai" — อักษรละตินใช้ Inter ที่นำหน้าใน stack อยู่แล้ว (ลดไฟล์ preload ลงครึ่งหนึ่ง)
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-sans-thai",
  display: "swap",
});

// สาย Heading (Serif): IBM Plex Serif (อังกฤษ) → Noto Serif Thai (ไทย)
const ibmPlexSerif = IBM_Plex_Serif({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-ibm-plex-serif",
  display: "swap",
});

const notoSerifThai = Noto_Serif_Thai({
  // เฉพาะ subset "thai" — อักษรละตินใช้ IBM Plex Serif ที่นำหน้าใน stack อยู่แล้ว
  subsets: ["thai"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-thai",
  display: "swap",
});

// IBM Plex Sans Thai — คงไว้สำหรับ UI ฝั่ง Clerk (login / register / studio)
// preload: false — ใช้เฉพาะหน้า auth/studio ไม่ต้อง preload ทุกหน้า (โหลดเองเมื่อถูกใช้)
const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-ibm-plex-thai",
  display: "swap",
  preload: false,
});

// Cinzel — wordmark ARCHRON ตาม brand board (ตระกูลโรมันคลาสสิก ใช้กับชื่อแบรนด์ละตินเท่านั้น)
// ทุกจุดที่ใช้ (header/footer/intro/auth) เป็น font-semibold — โหลดเฉพาะ 600 พอ
const cinzel = Cinzel({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-cinzel",
  display: "swap",
});

// EB Garamond — ฟอนต์ italic สำหรับ intro preloader (มี Greek + diacritics ครบ: ἀρχή ἄρχων Χρόνος)
// preload: false — ใช้เฉพาะ intro ครั้งแรกของ session ไม่ควรถ่วงทุกหน้า
const ebGaramond = EB_Garamond({
  subsets: ["greek", "latin"],
  weight: ["400", "500"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
  preload: false,
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
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
        className={`${inter.variable} ${notoSansThai.variable} ${ibmPlexSerif.variable} ${notoSerifThai.variable} ${ibmPlexThai.variable} ${cinzel.variable} ${ebGaramond.variable}`}
      >
        <head>
          <meta charSet="utf-8" />
          {/* preconnect → fonts CSS + ไฟล์ฟอนต์ของ Material Symbols เริ่ม handshake ทันที */}
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router ไม่มี pages/_document; โหลด Material Symbols ที่นี่ถูกต้องแล้ว */}
          {/* ล็อกแกน variable ให้ตรงกับที่ใช้จริงใน globals.css (FILL 0, wght 300, GRAD 0, opsz 24)
              → ไฟล์ฟอนต์เล็กลงมากเมื่อเทียบกับการโหลดครบทุกช่วงแกน 20..48/100..700/0..1/-50..200 */}
          <link
            rel="stylesheet"
            href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@24,300,0,0&display=swap"
          />
          <meta name="color-scheme" content="dark" />
          <noscript>
            <style>{`.scroll-reveal{opacity:1!important;transform:none!important}`}</style>
          </noscript>
          {/* กัน double-tap zoom ด้วย CSS touch-action (ดู globals.css) แทน JS listener แบบ non-passive
              — ลดงาน main thread และไม่บล็อกการ scroll (ดีต่อ INP) */}
        </head>
        <body className="min-h-screen bg-deep-navy pb-16 text-ivory antialiased md:pb-0">
          <IntroPreloader />
          <SkipToContent />
          <AccentController />
          <div className="accent-aura" aria-hidden="true" />
          <SiteHeader />
          {children}
          <SiteFooter />
          <ScrollToTop />
          <Tabbar />
          <Fab />
          <QuickOpen />
        </body>
      </html>
    </ClerkProvider>
  );
}
