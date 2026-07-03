"use client";

import { useState } from "react";
import Link from "next/link";
import { CalendarIcon, PersonIcon, SchoolIcon, ArrowRightIcon } from "@/components/icons";

interface TimelineEvent {
  year: string;
  era: "ancient" | "enlightenment" | "modern" | "contemporary";
  title: string;
  thinker?: string;
  school?: string;
  description: string;
  slug?: string;
  type: "article" | "concept" | "school";
}

const TIMELINE_DATA: TimelineEvent[] = [
  {
    year: "399 ปีก่อน ค.ศ.",
    era: "ancient",
    title: "โสกราตีสกับความสงสัยใคร่ครวญแห่งปัญญา (Socratic Questioning)",
    thinker: "Socrates / Plato",
    school: "Ancient Greek Philosophy",
    description: "จุดกำเนิดของการตั้งคำถามเชิงวิพากษ์เพื่อแสวงหาความจริงแท้เกี่ยวกับจิตวิญญาณและจริยธรรมมนุษย์",
    slug: "platonism",
    type: "school",
  },
  {
    year: "ค.ศ. 1637",
    era: "enlightenment",
    title: "ทวิภาคนิยมระหว่างกายและจิต (Cartesian Dualism)",
    thinker: "René Descartes",
    school: "Rationalism",
    description: "การแยกระหว่างจิต (Res Cogitans) และสสารกายภาพ (Res Extensa) ซึ่งเป็นรากฐานของปรัชญาจิตสมัยใหม่",
    slug: "epistemology",
    type: "concept",
  },
  {
    year: "ค.ศ. 1781",
    era: "enlightenment",
    title: "การสังเคราะห์การรับรู้ของคานท์ (Transcendental Idealism)",
    thinker: "Immanuel Kant",
    school: "German Idealism",
    description: "จิตไม่ได้เป็นเพียงผู้รับโครงสร้างจากโลกภายนอก แต่เป็นผู้จัดระเบียบประสบการณ์ทางประสาทสัมผัสผ่านกรอบเวลาและอวกาศ",
    slug: "metaphysics",
    type: "concept",
  },
  {
    year: "ค.ศ. 1899",
    era: "modern",
    title: "การตีความความฝันและการค้นพบจิตไร้สำนึก (The Interpretation of Dreams)",
    thinker: "Sigmund Freud",
    school: "Psychoanalysis",
    description: "การเปิดเผยว่าพฤติกรรมและความปรารถนาส่วนใหญ่ของมนุษย์ถูกขับเคลื่อนโดยแรงขับใต้สำนึกและกลไกป้องกันตนเอง",
    slug: "unconscious",
    type: "concept",
  },
  {
    year: "ค.ศ. 1921",
    era: "modern",
    title: "จิตวิทยาประเภทและต้นแบบสากล (Psychological Types & Archetypes)",
    thinker: "Carl Gustav Jung",
    school: "Analytical Psychology",
    description: "การแบ่งประเภทพลังงานชีวิต (Introversion vs Extraversion) และจิตไร้สำนึกร่วม (Collective Unconscious)",
    slug: "shadow",
    type: "concept",
  },
  {
    year: "ค.ศ. 1943",
    era: "modern",
    title: "ภาวะการมีอยู่และความเสรีแห่งมนุษย์ (Being and Nothingness)",
    thinker: "Jean-Paul Sartre",
    school: "Existentialism",
    description: "การมีอยู่มาก่อนแก่นแท้ (Existence precedes essence) มนุษย์เสรีและต้องรับผิดชอบต่อการกำหนดความหมายของตนเอง",
    slug: "ego",
    type: "concept",
  },
  {
    year: "ค.ศ. 1967",
    era: "contemporary",
    title: "การปฏิวัติความรู้แจ้งและประสาทวิทยารับรู้ (Cognitive Revolution)",
    thinker: "Aaron T. Beck / Albert Ellis",
    school: "Cognitive Behavioral Therapy (CBT)",
    description: "ความเข้าใจว่าอารมณ์และพฤติกรรมไม่ได้เกิดจากเหตุการณ์โดยตรง แต่เกิดจากการตีความและความคิดอัตโนมัติของจิตใจ",
    slug: "cbt",
    type: "concept",
  },
  {
    year: "ค.ศ. 2020s+",
    era: "contemporary",
    title: "จิตวิญญาณสังเคราะห์และโครงข่ายปัญญาประดิษฐ์ (AI & Cognitive Cybernetics)",
    thinker: "ARCHRON Research Community",
    school: "Posthumanism & Philosophy of Mind",
    description: "การตั้งคำถามเกี่ยวกับจิตสำนึก ความหมายของการเป็นมนุษย์ และเส้นแบ่งระหว่างปัญญาชีวภาพกับปัญญาสังเคราะห์",
    slug: "philosophy-of-mind",
    type: "article",
  },
];

type EraFilter = "all" | "ancient" | "enlightenment" | "modern" | "contemporary";

export function TimelineBrowser() {
  const [selectedEra, setSelectedEra] = useState<EraFilter>("all");

  const filteredEvents = selectedEra === "all"
    ? TIMELINE_DATA
    : TIMELINE_DATA.filter((e) => e.era === selectedEra);

  return (
    <div className="space-y-10">
      {/* ตัวคัดกรองยุคสมัย */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ink/10 pb-4">
        {[
          { id: "all", label: "ทุกยุคสมัยประวัติศาสตร์" },
          { id: "ancient", label: "ยุคโบราณ & คลาสสิก" },
          { id: "enlightenment", label: "ยุคฟื้นฟู & แสงสว่างทางปัญญา" },
          { id: "modern", label: "ปฏิวัติจิตวิเคราะห์ & ปรัชญาสมัยใหม่" },
          { id: "contemporary", label: "ยุคประสาทวิทยา & ปัญญาประดิษฐ์" },
        ].map((era) => (
          <button
            key={era.id}
            onClick={() => setSelectedEra(era.id as EraFilter)}
            className={`rounded-lg px-4 py-2 text-xs font-medium transition-all ${
              selectedEra === era.id
                ? "bg-burnished-gold/20 text-soft-gold border border-burnished-gold/50 shadow-sm"
                : "bg-surface-container/40 text-on-surface-variant hover:bg-surface-container hover:text-ivory border border-transparent"
            }`}
          >
            {era.label}
          </button>
        ))}
      </div>

      {/* ลำดับเส้นเวลา Timeline UI */}
      <div className="relative border-l-2 border-burnished-gold/30 ml-4 sm:ml-8 pl-6 sm:pl-10 space-y-12">
        {filteredEvents.map((ev, idx) => (
          <div key={idx} className="relative group">
            {/* จุดมาร์กเกอร์บนเส้นเวลา */}
            <span className="absolute -left-[31px] sm:-left-[47px] top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-deep-navy border-2 border-burnished-gold group-hover:scale-125 transition-transform" />

            <div className="archron-card p-6 transition-all duration-300 hover:border-burnished-gold/50 hover:-translate-y-0.5 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-soft-gold font-mono">
                <span className="flex items-center gap-1.5 bg-burnished-gold/10 px-2.5 py-1 rounded border border-burnished-gold/30">
                  <CalendarIcon className="h-3.5 w-3.5" />
                  {ev.year}
                </span>
                <span className="text-[11px] uppercase tracking-wider text-muted font-sans">
                  {ev.school}
                </span>
              </div>

              <h3 className="font-serif text-xl text-ivory group-hover:text-soft-gold transition-colors">
                {ev.title}
              </h3>

              <p className="text-sm text-soft-ivory/90 leading-relaxed">
                {ev.description}
              </p>

              {ev.thinker && (
                <div className="pt-2 flex items-center justify-between border-t border-ink/10 text-xs text-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <PersonIcon className="h-3.5 w-3.5 text-burnished-gold" />
                    {ev.thinker}
                  </span>
                  {ev.slug && (
                    <Link
                      href={ev.type === "concept" ? `/concepts/${ev.slug}` : `/articles/${ev.slug}`}
                      className="inline-flex items-center gap-1 text-soft-gold hover:underline"
                    >
                      ศึกษามโนทัศน์นี้
                      <ArrowRightIcon className="h-3.5 w-3.5" />
                    </Link>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
