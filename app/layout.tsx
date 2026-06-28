import type { Metadata } from "next";
import { Noto_Serif_Thai, IBM_Plex_Sans_Thai, Playfair_Display } from "next/font/google";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Tabbar } from "@/components/tabbar";
import { Fab } from "@/components/fab";

const notoSerifThai = Noto_Serif_Thai({
  subsets: ["thai", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-noto-serif-thai",
  display: "swap",
});

const ibmPlexThai = IBM_Plex_Sans_Thai({
  subsets: ["thai", "latin"],
  weight: ["300", "400", "500", "600"],
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

export const metadata: Metadata = {
  title: "The Soul's Compass — คลังความรู้จิตใจมนุษย์",
  description:
    "คลังความรู้ภาษาไทยสำหรับศึกษาจิตใจมนุษย์ผ่านจิตวิทยา จิตวิเคราะห์ ปรัชญา ประสาทวิทยาศาสตร์ สัญลักษณ์ และทฤษฎีความรู้ โดยแยกแหล่งที่มา ข้อเท็จจริง และการตีความออกจากกัน",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="th"
      className={`${notoSerifThai.variable} ${ibmPlexThai.variable} ${playfair.variable}`}
    >
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font -- App Router ไม่มี pages/_document; โหลด Material Symbols ที่นี่ถูกต้องแล้ว */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=swap"
        />
        <noscript>
          <style>{`.scroll-reveal{opacity:1!important;transform:none!important}`}</style>
        </noscript>
      </head>
      <body className="min-h-screen bg-deep-navy pb-16 text-ivory antialiased md:pb-0">
        <SiteHeader />
        {children}
        <SiteFooter />
        <ScrollToTop />
        <Tabbar />
        <Fab />
      </body>
    </html>
  );
}
