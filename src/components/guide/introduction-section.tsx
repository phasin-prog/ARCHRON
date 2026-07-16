import { PsychologyIcon, SynthesisIcon, GridIcon } from "@/components/icons";

export function IntroductionSection() {
  return (
    <section className="border-b border-border/30 bg-bg py-20 lg:py-24">
      <div className="tpl-reference">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            กรอบคิดทางจิตวิทยา
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            Jungian Type Analysis คืออะไร?
          </h2>
          <p className="mt-4 font-serif text-base leading-relaxed text-text-body/90 md:text-lg">
            ไม่ใช่แบบทดสอบสำเร็จรูปหรือการจัดคนไว้ใน 16 ประเภท แต่เป็นการสนทนาเพื่อพิจารณาทิศทางพลังงานจิตและการทำงานร่วมกันของช่องทางรับรู้ตามกรอบ Jungian
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
              พิจารณาว่าคุณมักหันความสนใจไปยังโลกภายใน (Introversion) หรือโลกภายนอก (Extraversion) เป็นหลัก
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
              ทำความเข้าใจลำดับของ Thinking, Feeling, Sensation และ Intuition รวมถึงฟังก์ชันหลัก (Dominant) และฟังก์ชันด้อย (Inferior)
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
              สังเกตปฏิกิริยาป้องกันตัวเมื่อ Ego รู้สึกถูกคุกคาม และพิจารณาบทบาทของ The Shadow ในจิตไร้สำนึก
            </p>
          </div>
        </div>

        <div className="mt-12 rounded-lg border border-border/40 bg-gradient-to-r from-bg-elevated/60 via-bg-card/80 to-bg-elevated/60 p-6 text-center md:p-8">
          <p className="font-serif text-sm italic text-text-body/90 md:text-base">
            เป้าหมายของการวิเคราะห์คือการเห็นกลไกที่คุ้นเคยชัดขึ้น ไม่ใช่การเปลี่ยนให้คุณเป็นคนอื่น
          </p>
        </div>
      </div>
    </section>
  );
}
