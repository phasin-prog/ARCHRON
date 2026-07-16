import type { ComponentType, ReactNode } from "react";
import type { ContentEntry } from "@/types/content";
import { MarkdownRenderer } from "@/components/reading/markdown-renderer";
import { InternalLinkText } from "@/components/reading/internal-link-text";
import {
  RealExampleIcon,
  ScholarIcon,
  VisualMeaningIcon,
} from "@/components/icons";

function SectionH3({
  icon: Icon,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  children: ReactNode;
}) {
  return (
    <h2 className="flex items-center gap-3 font-serif text-fluid-h3 text-text-heading">
      <span
        className="flex h-9 w-9 flex-none items-center justify-center rounded-lg border"
        style={{
          color: "var(--accent)",
          borderColor: "color-mix(in srgb, var(--accent) 30%, transparent)",
          backgroundColor: "color-mix(in srgb, var(--accent) 9%, transparent)",
        }}
      >
        <Icon className="h-5 w-5" />
      </span>
      <span>{children}</span>
    </h2>
  );
}

/**
 * Authored document sections shared by the published reading page and Studio
 * preview. Route-specific context remains in the calling page.
 */
export function ReadingDocumentContent({ entry }: { entry: ContentEntry }) {
  return (
    <>
      {entry.visualExplanation ? (
        <section className="scroll-reveal mt-14">
          <SectionH3 icon={VisualMeaningIcon}>คำอธิบายให้เห็นภาพ</SectionH3>
          <div className="md-body mt-4 whitespace-pre-line">
            <InternalLinkText text={entry.visualExplanation} />
          </div>
        </section>
      ) : null}

      {entry.technicalMeaning ? (
        <section className="scroll-reveal mt-14">
          <SectionH3 icon={ScholarIcon}>ความหมายทางวิชาการ / เทคนิค</SectionH3>
          <div className="md-body mt-4 whitespace-pre-line">
            <InternalLinkText text={entry.technicalMeaning} />
          </div>
        </section>
      ) : null}

      {entry.realWorldExamples ? (
        <section className="scroll-reveal mt-14">
          <SectionH3 icon={RealExampleIcon}>ตัวอย่างในชีวิตจริง (อิงจากตำรา)</SectionH3>
          <div className="md-body mt-4 whitespace-pre-line">
            <InternalLinkText text={entry.realWorldExamples} />
          </div>
        </section>
      ) : null}

      {entry.bodyMarkdown?.trim() ? (
        <section className="scroll-reveal mt-14">
          <MarkdownRenderer content={entry.bodyMarkdown} />
        </section>
      ) : null}
    </>
  );
}
