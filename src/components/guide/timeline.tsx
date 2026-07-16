import { TIMELINE_STEPS } from "@/components/guide/types";

export function AnalysisTimeline() {
  return (
    <section className="border-b border-border/30 bg-bg py-20 lg:py-24">
      <div className="tpl-reference">
        <div className="text-center">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            ลำดับการรับบริการ
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            ขั้นตอนการรับบริการ
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary/85 md:text-base">
            ตั้งแต่จองคิว ชำระเงิน เข้าสัมภาษณ์ จนถึงรับรายงาน
          </p>
        </div>

        <div className="mt-16 relative">
          {/* Vertical connecting line */}
          <div
            className="absolute left-[23px] top-6 bottom-6 w-px bg-gradient-to-b from-accent/40 via-border/70 to-accent/20 md:left-1/2 md:-translate-x-1/2"
            aria-hidden="true"
          />

          <div className="space-y-12">
            {TIMELINE_STEPS.map((item, index) => {
              const isEven = index % 2 === 0;
              return (
                <div
                  key={item.step}
                  className={`relative flex flex-col items-start gap-6 pl-14 md:flex-row md:items-center md:pl-0 ${
                    isEven ? "md:flex-row-reverse" : ""
                  }`}
                >
                  {/* Step dot marker */}
                  <div
                    className="absolute left-2.5 top-1.5 flex h-9 w-9 items-center justify-center rounded-full border-2 border-accent bg-bg text-xs font-bold text-accent shadow-sm transition-transform duration-200 hover:scale-110 md:left-1/2 md:-translate-x-1/2 md:top-auto"
                    aria-label={`ขั้นตอนที่ ${item.step}`}
                  >
                    {item.step}
                  </div>

                  {/* Content card */}
                  <div className="w-full md:w-[45%]">
                    <div
                      className={`group rounded-lg border border-border/40 bg-bg-card/75 p-6 shadow-sm transition-all duration-200 hover:border-accent/40 hover:bg-bg-card hover:shadow-md ${
                        isEven ? "md:text-right" : "md:text-left"
                      }`}
                    >
                      <div
                        className={`flex items-center gap-2 ${
                          isEven ? "md:justify-end" : "md:justify-start"
                        }`}
                      >
                        <span className="rounded bg-accent/10 px-2 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-accent">
                          STEP {item.step} · {item.code}
                        </span>
                      </div>

                      <h3 className="mt-3 font-serif text-lg font-bold text-text-heading group-hover:text-accent">
                        {item.title}
                      </h3>

                      <p className="mt-2 text-xs leading-relaxed text-text-secondary/85">
                        {item.description}
                      </p>
                    </div>
                  </div>

                  {/* Empty opposite space for balance */}
                  <div className="hidden w-[45%] md:block" aria-hidden="true" />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
