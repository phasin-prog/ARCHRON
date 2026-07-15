"use client";

import { PsychologyIcon, SynthesisIcon, GridIcon } from "@/components/icons";

export function IntroductionSection() {
  return (
    <section className="border-b border-border/30 bg-bg px-6 py-20 lg:py-24">
      <div className="mx-auto max-w-5xl">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            Philosophical & Psychological Foundation
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            Jungian Type Analysis คืออะไร?
          </h2>
          <p className="mt-4 font-serif text-base leading-relaxed text-text-body/90 md:text-lg">
            ไม่ใช่แบบทดสอบบุคลิกภาพสำเร็จรูป (SaaS Test) และไม่ใช่การจำแนกคนออกเป็นกล่อง 16 ประเภท แต่เป็นกระบวนการวิเคราะห์ทางจิตวิทยาเชิงลึก เพื่อสังเกตทิศทางการไหลเวียนพลังงานจิตตามธรรมชาติ และการทำงานร่วมกันของช่องทางรับรู้ในตัวตนของคุณ
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          <div className="relative rounded-lg border border-border/40 bg-bg-card/60 p-7 shadow-sm transition-all duration-200 hover:border-accent/30 hover:bg-bg-card hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/20 bg-accent/5 text-accent">
              <SynthesisIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-lg font-semibold text-text-heading">
              1. เข้าใจทิศทางพลังงานจิตพื้นฐาน
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-text-secondary/85">
              ค้นพบว่าตัวตนของคุณดึงพลังงานและฟื้นฟูจิตใจจากโลกภายใน (Introversion) หรือโลกภายนอก (Extraversion) เป็นหลัก เพื่อการวางตัวและบริหารพลังงานในชีวิตประจำวันอย่างไม่ฝืนธรรมชาติ
            </p>
          </div>

          <div className="relative rounded-lg border border-border/40 bg-bg-card/60 p-7 shadow-sm transition-all duration-200 hover:border-accent/30 hover:bg-bg-card hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/20 bg-accent/5 text-accent">
              <GridIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-lg font-semibold text-text-heading">
              2. ถอดรหัสโครงสร้าง Cognitive Stack
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-text-secondary/85">
              มองเห็นลำดับชั้นของฟังก์ชันจิต (Thinking, Feeling, Sensation, Intuition) รู้ว่าช่องทางใดคือเครื่องมือหลักที่ทรงพลัง (Dominant) และช่องทางใดคือจุดบอดที่มักถูกกดทับ (Inferior)
            </p>
          </div>

          <div className="relative rounded-lg border border-border/40 bg-bg-card/60 p-7 shadow-sm transition-all duration-200 hover:border-accent/30 hover:bg-bg-card hover:shadow-md">
            <div className="flex h-12 w-12 items-center justify-center rounded-full border border-accent/20 bg-accent/5 text-accent">
              <PsychologyIcon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-serif text-lg font-semibold text-text-heading">
              3. รู้เท่าทันกลไกยามเครียดและ Shadow
            </h3>
            <p className="mt-2.5 text-xs leading-relaxed text-text-secondary/85">
              ตระหนักรู้ต่อปฏิกิริยาป้องกันตัวอัตโนมัติเมื่อ Ego รู้สึกถูกคุกคาม และเรียนรู้ที่จะโอบรับเงาในจิตไร้สำนึก (The Shadow) เพื่อสร้างความมั่นคงทางอารมณ์และอิสรภาพทางจิตใจ
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border/40 bg-gradient-to-r from-bg-elevated/60 via-bg-card/80 to-bg-elevated/60 p-6 text-center md:p-8">
          <p className="font-serif text-sm italic text-text-body/90 md:text-base">
            &ldquo;ความประสงค์ของการวิเคราะห์ไม่ใช่เพื่อเปลี่ยนแปลงตัวตนให้เป็นคนอื่น แต่เพื่อให้คุณตระหนักรู้ในกลไกที่คุ้นเคย และสามารถเลือกใช้ชีวิตด้วยความยืดหยุ่นอย่างมีสติ&rdquo;
          </p>
        </div>
      </div>
    </section>
  );
}
