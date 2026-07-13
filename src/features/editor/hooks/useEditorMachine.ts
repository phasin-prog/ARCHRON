"use client";

import { useReducer, useCallback } from "react";
import type { EditorDraft } from "@/lib/content/publishing/publish-validation";

export type EditorMode = "dashboard" | "editing" | "preview";
export type AutoSaveState = "idle" | "saving" | "saved";

export interface EditorFeedbackData {
  missingFields: string[];
  deadLinks: string[];
  suggestions: string[];
}

export interface EntryItem {
  id: string; slug: string; title: string; status: string;
  content_type: string; published_at: string | null; author_name?: string | null;
}

export interface DraftItem {
  id: string; slug: string; title: string; status: string;
  updated_at: string | null;
}

export interface EditorMachineState {
  mode: EditorMode;
  draft: EditorDraft;
  entryId: string | null;
  savedAt: string | null;
  autoState: AutoSaveState;
  feedback: EditorFeedbackData | null;
  publishTried: boolean;
  publishing: boolean;
  loadingDraft: boolean;
  displayName: string | null;
  activeSection: string;
  originalAuthorId: string | null;
  originalAuthorName: string | null;
  showDashboard: boolean;
  entries: EntryItem[];
  drafts: DraftItem[];
  loadingEntries: boolean;
  typeFilter: string;
}

export type EditorAction =
  | { type: "SET_MODE"; payload: EditorMode }
  | { type: "LOAD_DRAFT"; draft: EditorDraft; entryId?: string | null }
  | { type: "UPDATE_FIELD"; field: keyof EditorDraft; value: unknown }
  | { type: "AUTO_SAVE_START" }
  | { type: "AUTO_SAVE_DONE" }
  | { type: "SET_FEEDBACK"; feedback: EditorFeedbackData | null }
  | { type: "PUBLISH_TRIED" }
  | { type: "PUBLISH_START" }
  | { type: "PUBLISH_DONE" }
  | { type: "SET_DISPLAY_NAME"; name: string | null }
  | { type: "SET_ACTIVE_SECTION"; section: string }
  | { type: "SET_ORIGINAL_AUTHOR"; id: string | null; name: string | null }
  | { type: "TOGGLE_DASHBOARD" }
  | { type: "SET_ENTRIES"; entries: EntryItem[] }
  | { type: "SET_DRAFTS"; drafts: DraftItem[] }
  | { type: "SET_LOADING_ENTRIES"; loading: boolean }
  | { type: "SET_TYPE_FILTER"; filter: string }
  | { type: "RESET" };

export function initialEditorState(draft: EditorDraft): EditorMachineState {
  return {
    mode: "dashboard",
    draft,
    entryId: null, savedAt: null, autoState: "idle",
    feedback: null, publishTried: false, publishing: false,
    loadingDraft: false, displayName: null, activeSection: "basic",
    originalAuthorId: null, originalAuthorName: null,
    showDashboard: true,
    entries: [], drafts: [], loadingEntries: true, typeFilter: "all",
  };
}

export function editorReducer(state: EditorMachineState, action: EditorAction): EditorMachineState {
  switch (action.type) {
    case "SET_MODE":
      return { ...state, mode: action.payload };
    case "LOAD_DRAFT":
      return {
        ...state,
        draft: action.draft,
        entryId: action.entryId ?? state.entryId,
        mode: "editing",
        loadingDraft: false,
      };
    case "UPDATE_FIELD":
      return { ...state, draft: { ...state.draft, [action.field]: action.value } };
    case "AUTO_SAVE_START":
      return { ...state, autoState: "saving" };
    case "AUTO_SAVE_DONE":
      return { ...state, autoState: "saved", savedAt: new Date().toISOString() };
    case "SET_FEEDBACK":
      return { ...state, feedback: action.feedback };
    case "PUBLISH_TRIED":
      return { ...state, publishTried: true };
    case "PUBLISH_START":
      return { ...state, publishing: true };
    case "PUBLISH_DONE":
      return { ...state, publishing: false, publishTried: false };
    case "SET_DISPLAY_NAME":
      return { ...state, displayName: action.name };
    case "SET_ACTIVE_SECTION":
      return { ...state, activeSection: action.section };
    case "TOGGLE_DASHBOARD":
      return { ...state, showDashboard: !state.showDashboard };
    case "SET_ENTRIES":
      return { ...state, entries: action.entries, loadingEntries: false };
    case "SET_DRAFTS":
      return { ...state, drafts: action.drafts };
    case "SET_LOADING_ENTRIES":
      return { ...state, loadingEntries: action.loading };
    case "SET_TYPE_FILTER":
      return { ...state, typeFilter: action.filter };
    case "SET_ORIGINAL_AUTHOR":
      return { ...state, originalAuthorId: action.id, originalAuthorName: action.name };
    case "RESET":
      return initialEditorState(state.draft);
    default:
      return state;
  }
}

export function useEditorMachine(initialDraft: EditorDraft) {
  const [state, dispatch] = useReducer(editorReducer, initialDraft, initialEditorState);

  const updateField = useCallback(
    (field: keyof EditorDraft, value: unknown) => dispatch({ type: "UPDATE_FIELD", field, value }),
    [],
  );

  return { state, dispatch, updateField };
}
