"use client";

import { useState } from "react";
import type { EditorDraft, EditorRelatedConcept, EditorReference } from "@/lib/content/publishing/publish-validation";
import type { ValidationIssue } from "@/lib/content/publishing/editor-validation";
import { InlineGuidance } from "./inline-guidance";

export function EditorRelations({
  draft,
  updateField,
  validationIssues,
}: {
  draft: EditorDraft;
  updateField: (field: keyof EditorDraft, value: unknown) => void;
  validationIssues?: Record<string, ValidationIssue>;
}) {
  const [newConcept, setNewConcept] = useState<EditorRelatedConcept>({
    conceptSlug: "", relationType: "related", reason: "",
  });
  const [newRef, setNewRef] = useState<EditorReference>({
    sourceType: "primary-source", title: "", relatedClaim: "",
  });

  function addConcept() {
    if (!newConcept.conceptSlug.trim()) return;
    updateField("relatedConcepts", [...draft.relatedConcepts, { ...newConcept }]);
    setNewConcept({ conceptSlug: "", relationType: "related", reason: "" });
  }

  function removeConcept(idx: number) {
    updateField("relatedConcepts", draft.relatedConcepts.filter((_, i) => i !== idx));
  }

  function addReference() {
    if (!newRef.title.trim()) return;
    updateField("references", [...draft.references, { ...newRef }]);
    setNewRef({ sourceType: "primary-source", title: "", relatedClaim: "" });
  }

  function removeReference(idx: number) {
    updateField("references", draft.references.filter((_, i) => i !== idx));
  }

  return (
    <section className="space-y-6 border-t border-border pt-6">
      <h2 className="font-serif text-lg font-semibold text-text-heading">ความสัมพันธ์และแหล่งอ้างอิง</h2>

      <div id="container-field-related-concepts" className="space-y-3 rounded-lg transition-all duration-300">
        <h3 title="แนวคิดที่เกี่ยวข้อง (Related Concepts)" className="text-base font-medium text-text-heading">แนวคิดที่เกี่ยวข้อง</h3>
        {draft.relatedConcepts.map((c, i) => (
          <div key={i} className="flex items-center gap-2 rounded-md border border-text-heading/10 bg-bg-elevated px-3 py-2 text-sm text-text-body">
            <span className="flex-1">
              <span className="font-medium text-text-heading">{c.conceptSlug}</span>
              <span className="mx-1 text-text-secondary">·</span>
              <span className="text-text-secondary">{c.relationType}</span>
              {c.reason && <span className="text-text-secondary"> — {c.reason}</span>}
            </span>
            <button type="button" onClick={() => removeConcept(i)}
              className="rounded px-1.5 py-0.5 text-text-secondary hover:text-accent transition-colors">&times;</button>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-2">
          <input
            id="field-related-concepts"
            type="text"
            value={newConcept.conceptSlug}
            onChange={(e) => setNewConcept({ ...newConcept, conceptSlug: e.target.value })}
            placeholder="Concept slug"
            className="rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
          <select value={newConcept.relationType} onChange={(e) => setNewConcept({ ...newConcept, relationType: e.target.value })}
            className="rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30">
            <option value="related">related</option>
            <option value="prerequisite">prerequisite</option>
            <option value="contrasts-with">contrasts-with</option>
            <option value="part-of">part-of</option>
            <option value="source-of">source-of</option>
            <option value="used-in">used-in</option>
            <option value="influenced-by">influenced-by</option>
          </select>
          <button type="button" onClick={addConcept}
            className="rounded-md border border-border px-3 py-2 text-sm text-text-body hover:bg-bg-elevated transition-colors">เพิ่ม</button>
        </div>
        <input type="text" value={newConcept.reason} onChange={(e) => setNewConcept({ ...newConcept, reason: e.target.value })}
          placeholder="เหตุผล (optional)"
          className="w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        <InlineGuidance issue={validationIssues?.["field-related-concepts"]} />
      </div>

      <div id="container-field-references" className="space-y-3 rounded-lg transition-all duration-300">
        <h3 title="แหล่งอ้างอิง/ตำรา (References/Sources)" className="text-base font-medium text-text-heading">แหล่งอ้างอิง / ตำรา</h3>
        {draft.references.map((r, i) => (
          <div key={i} className="flex items-center gap-2 rounded-md border border-text-heading/10 bg-bg-elevated px-3 py-2 text-sm text-text-body">
            <span className="flex-1">
              <span className="font-medium text-text-heading">{r.title}</span>
              <span className="mx-1 text-text-secondary">·</span>
              <span className="text-text-secondary">{r.sourceType}</span>
              {r.relatedClaim && <span className="text-text-secondary"> — {r.relatedClaim}</span>}
            </span>
            <button type="button" onClick={() => removeReference(i)}
              className="rounded px-1.5 py-0.5 text-text-secondary hover:text-accent transition-colors">&times;</button>
          </div>
        ))}
        <div className="grid grid-cols-3 gap-2">
          <input
            id="field-references"
            type="text"
            value={newRef.title}
            onChange={(e) => setNewRef({ ...newRef, title: e.target.value })}
            placeholder="ชื่อแหล่งอ้างอิง"
            className="rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30"
          />
          <select value={newRef.sourceType} onChange={(e) => setNewRef({ ...newRef, sourceType: e.target.value })}
            className="rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30">
            <option value="primary-source">primary-source</option>
            <option value="secondary-source">secondary-source</option>
            <option value="commentary">commentary</option>
            <option value="editorial-interpretation">editorial-interpretation</option>
            <option value="website">website</option>
            <option value="dictionary-lexicon">dictionary-lexicon</option>
            <option value="other">other</option>
          </select>
          <button type="button" onClick={addReference}
            className="rounded-md border border-border px-3 py-2 text-sm text-text-body hover:bg-bg-elevated transition-colors">เพิ่ม</button>
        </div>
        <input type="text" value={newRef.relatedClaim} onChange={(e) => setNewRef({ ...newRef, relatedClaim: e.target.value })}
          placeholder="ข้อกล่าวอ้างที่อ้างอิง (optional)"
          className="w-full rounded-md border border-text-heading/15 px-3 py-2 bg-bg-card text-text-heading text-sm outline-none focus:border-accent/50 focus:ring-2 focus:ring-accent/30" />
        <InlineGuidance issue={validationIssues?.["field-references"]} />
      </div>
    </section>
  );
}
