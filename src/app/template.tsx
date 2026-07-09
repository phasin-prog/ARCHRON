import { ScrollReveal } from "@/components/scroll-reveal";

// template.tsx re-mount ทุกครั้งที่นำทาง → ได้ทั้ง route transition (fade) และ
// re-scan .scroll-reveal ของหน้าใหม่ (ScrollReveal ทำงานครบทุกหน้าโดยไม่ต้องวางซ้ำ)
export default function Template({ children }: { children: React.ReactNode }) {
  return (
    <div id="main-content" tabIndex={-1} className="route-fade relative">
      {children}
      <ScrollReveal />
    </div>
  );
}
