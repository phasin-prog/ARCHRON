"use client";

import { useState, useEffect, useCallback } from "react";

interface Draft {
  id: string;
  slug: string;
  title: string;
  content: string;
  status: "draft" | "needs-source-check" | "ready-to-publish" | "published" | "archived";
  updatedAt: string;
  autosavedAt?: string;
}

interface WorkflowState {
  draft: Draft | null;
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  autosaveEnabled: boolean;
}

interface UseWorkflowOptions {
  autosaveInterval?: number;
  onAutosave?: (draft: Draft) => Promise<void>;
  onSave?: (draft: Draft) => Promise<void>;
  onPublish?: (draft: Draft) => Promise<void>;
}

export function useWorkflow(options: UseWorkflowOptions = {}) {
  const {
    autosaveInterval = 30000, // 30 seconds
    onAutosave,
    onSave,
    onPublish,
  } = options;

  const [state, setState] = useState<WorkflowState>({
    draft: null,
    isDirty: false,
    isSaving: false,
    lastSaved: null,
    autosaveEnabled: true,
  });

  // Autosave effect
  useEffect(() => {
    if (!state.autosaveEnabled || !state.isDirty || !state.draft || !onAutosave) return;

    const timer = setInterval(async () => {
      setState((prev) => ({ ...prev, isSaving: true }));
      try {
        await onAutosave(state.draft!);
        setState((prev) => ({
          ...prev,
          isSaving: false,
          isDirty: false,
          lastSaved: new Date(),
          draft: prev.draft
            ? { ...prev.draft, autosavedAt: new Date().toISOString() }
            : null,
        }));
      } catch {
        setState((prev) => ({ ...prev, isSaving: false }));
      }
    }, autosaveInterval);

    return () => clearInterval(timer);
  }, [state.autosaveEnabled, state.isDirty, state.draft, onAutosave, autosaveInterval]);

  const loadDraft = useCallback((draft: Draft) => {
    setState({
      draft,
      isDirty: false,
      isSaving: false,
      lastSaved: null,
      autosaveEnabled: true,
    });
  }, []);

  const updateDraft = useCallback((updates: Partial<Draft>) => {
    setState((prev) => ({
      ...prev,
      draft: prev.draft ? { ...prev.draft, ...updates } : null,
      isDirty: true,
    }));
  }, []);

  const saveDraft = useCallback(async () => {
    if (!state.draft || !onSave) return;

    setState((prev) => ({ ...prev, isSaving: true }));
    try {
      await onSave(state.draft!);
      setState((prev) => ({
        ...prev,
        isSaving: false,
        isDirty: false,
        lastSaved: new Date(),
      }));
    } catch {
      setState((prev) => ({ ...prev, isSaving: false }));
    }
  }, [state.draft, onSave]);

  const publishDraft = useCallback(async () => {
    if (!state.draft || !onPublish) return;

    setState((prev) => ({ ...prev, isSaving: true }));
    try {
      await onPublish(state.draft!);
      setState((prev) => ({
        ...prev,
        isSaving: false,
        isDirty: false,
        lastSaved: new Date(),
        draft: prev.draft
          ? { ...prev.draft, status: "published" }
          : null,
      }));
    } catch {
      setState((prev) => ({ ...prev, isSaving: false }));
    }
  }, [state.draft, onPublish]);

  const toggleAutosave = useCallback(() => {
    setState((prev) => ({ ...prev, autosaveEnabled: !prev.autosaveEnabled }));
  }, []);

  return {
    ...state,
    loadDraft,
    updateDraft,
    saveDraft,
    publishDraft,
    toggleAutosave,
  };
}

interface WorkflowStatusProps {
  isDirty: boolean;
  isSaving: boolean;
  lastSaved: Date | null;
  autosaveEnabled: boolean;
  onToggleAutosave: () => void;
}

export function WorkflowStatus({
  isDirty,
  isSaving,
  lastSaved,
  autosaveEnabled,
  onToggleAutosave,
}: WorkflowStatusProps) {
  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("th-TH", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="flex items-center gap-3 text-xs text-text-secondary">
      {/* Saving Status */}
      {isSaving ? (
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined animate-spin text-[14px]">progress_activity</span>
          กำลังบันทึก...
        </span>
      ) : isDirty ? (
        <span className="flex items-center gap-1 text-amber-400">
          <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
          มีการเปลี่ยนแปลง
        </span>
      ) : lastSaved ? (
        <span className="flex items-center gap-1">
          <span className="material-symbols-outlined text-[14px]">check_circle</span>
          บันทึกแล้ว {formatTime(lastSaved)}
        </span>
      ) : null}

      {/* Autosave Toggle */}
      <button
        onClick={onToggleAutosave}
        className={`flex items-center gap-1 rounded-md px-2 py-0.5 transition-colors ${
          autosaveEnabled
            ? "bg-accent/10 text-accent"
            : "bg-bg-card text-text-secondary"
        }`}
      >
        <span className="material-symbols-outlined text-[14px]">
          {autosaveEnabled ? "autorenew" : "pause"}
        </span>
        {autosaveEnabled ? "Auto-save On" : "Auto-save Off"}
      </button>
    </div>
  );
}
