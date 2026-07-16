import { SCOPE_ITEMS, type ScopeCardItem } from "@/components/guide/types";
import {
  SynthesisIcon,
  PsychologyIcon,
  GridIcon,
  ConceptIcon,
  AuthorPenIcon,
  ClockIcon,
} from "@/components/icons";

function renderScopeIcon(iconType: ScopeCardItem["icon"]) {
  switch (iconType) {
    case "orientation":
      return <SynthesisIcon className="h-6 w-6" />;
    case "functions":
      return <PsychologyIcon className="h-6 w-6" />;
    case "stack":
      return <GridIcon className="h-6 w-6" />;
    case "ego":
      return <ConceptIcon className="h-6 w-6" />;
    case "shadow":
      return <AuthorPenIcon className="h-6 w-6" />;
    case "defenses":
      return <ClockIcon className="h-6 w-6" />;
  }
}

export function AnalysisCards() {
  return (
    <section className="border-b border-border/30 bg-bg py-20 lg:py-24">
      <div className="tpl-reference">
        <div className="text-center md:text-left">
          <span className="text-xs font-semibold uppercase tracking-[0.22em] text-accent/85">
            ขอบเขตการพิจารณา
          </span>
          <h2 className="mt-3 font-serif text-3xl font-bold text-text-heading md:text-4xl">
            หัวข้อที่ใช้ในการวิเคราะห์
          </h2>
          <p className="mt-3 text-sm text-text-secondary/85 md:text-base">
            หกหัวข้อสำหรับพิจารณาโครงสร้างและแบบแผนของ Ego ในรายงานสรุป
          </p>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {SCOPE_ITEMS.map((item, index) => (
            <div
              key={item.id}
              className="relative flex flex-col justify-between rounded-lg border border-border/40 bg-bg-card/50 p-6 transition-all duration-200 hover:border-accent/40 hover:bg-bg-card/90 hover:shadow-md"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex h-11 w-11 items-center justify-center rounded-md border border-border/50 bg-bg text-accent">
                    {renderScopeIcon(item.icon)}
                  </div>
                  <span className="font-mono text-xs font-semibold text-text-secondary/40">
                    M–0{index + 1}
                  </span>
                </div>

                <span className="mt-5 block text-[10px] font-semibold uppercase tracking-wider text-text-secondary/70">
                  {item.englishTitle}
                </span>

                <h3 className="mt-1 font-serif text-lg font-bold text-text-heading">
                  {item.title}
                </h3>

                <p className="mt-2.5 text-xs leading-relaxed text-text-secondary/85">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 border-t border-border/20 pt-3">
                <span className="inline-block rounded bg-accent/5 px-2 py-0.5 text-[10px] font-medium text-accent">
                  กรอบ Jungian
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
