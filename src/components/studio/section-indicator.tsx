"use client";

type Section = {
  id: string;
  label: string;
  visible: boolean;
};

type Props = {
  sections: Section[];
  activeSection: string;
  onSectionClick?: (id: string) => void;
};

export function SectionIndicator({ sections, activeSection, onSectionClick }: Props) {
  const visible = sections.filter((s) => s.visible);
  if (visible.length <= 1) return null;

  return (
    <nav className="mb-6 flex flex-wrap items-center gap-1.5 text-xs" aria-label="ส่วนของฟอร์ม">
      {visible.map((s, i) => (
        <span key={s.id} className="flex items-center gap-1.5">
          {i > 0 ? <span className="mx-0.5 text-text-secondary/40">›</span> : null}
          <button
            type="button"
            onClick={() => onSectionClick?.(s.id)}
            className={`rounded-full px-2.5 py-0.5 transition-all ${
              s.id === activeSection
                ? "bg-accent/10 font-medium text-accent"
                : "text-text-secondary hover:text-text-body"
            }`}
          >
            {s.label}
          </button>
        </span>
      ))}
    </nav>
  );
}
