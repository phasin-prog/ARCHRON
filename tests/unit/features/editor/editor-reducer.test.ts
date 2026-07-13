import { describe, it, expect } from "vitest";
import { editorReducer, initialEditorState } from "@/features/editor/hooks/useEditorMachine";
import { EMPTY_DRAFT } from "@/lib/content/publishing/publish-validation";

describe("editorReducer", () => {
  const initial = initialEditorState(EMPTY_DRAFT);

  it("switches to editing mode on LOAD_DRAFT", () => {
    const next = editorReducer(initial, {
      type: "LOAD_DRAFT",
      draft: { ...EMPTY_DRAFT, title: "New Article", slug: "new-article" },
    });
    expect(next.mode).toBe("editing");
    expect(next.draft.title).toBe("New Article");
    expect(next.draft.slug).toBe("new-article");
  });

  it("updates field on UPDATE_FIELD", () => {
    const next = editorReducer(initial, { type: "UPDATE_FIELD", field: "title", value: "Updated" });
    expect(next.draft.title).toBe("Updated");
  });

  it("sets autoState to saving on AUTO_SAVE_START", () => {
    const next = editorReducer(initial, { type: "AUTO_SAVE_START" });
    expect(next.autoState).toBe("saving");
  });

  it("sets autoState to saved on AUTO_SAVE_DONE", () => {
    const next = editorReducer({ ...initial, autoState: "saving" }, { type: "AUTO_SAVE_DONE" });
    expect(next.autoState).toBe("saved");
    expect(next.savedAt).toBeTruthy();
  });

  it("resets to initial state", () => {
    const modified = editorReducer(initial, {
      type: "LOAD_DRAFT", draft: { ...EMPTY_DRAFT, title: "X" },
    });
    const reset = editorReducer(modified, { type: "RESET" });
    expect(reset.mode).toBe("dashboard");
  });

  it("toggles dashboard", () => {
    const next = editorReducer(initial, { type: "TOGGLE_DASHBOARD" });
    expect(next.showDashboard).toBe(false);
  });
});
