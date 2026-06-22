import { create } from 'zustand'

/* ═══════════════════════════════════════════════════════════
   Feature Flags Store — optimization toggles, milestones
   Extracted from App.jsx useState declarations
   ═══════════════════════════════════════════════════════════ */

const useFeatureFlagsStore = create((set) => ({
  /* ── State ──────────────────────────────────────────────── */
  autoExecuteRecommendations: false,
  autoRegenEnabled: false,
  autoOptimizeConfirmed: false,
  publishedAt: null,
  goalConfigured: false,

  /* ── Actions ────────────────────────────────────────────── */
  setAutoExecuteRecommendations: (val) => set({ autoExecuteRecommendations: val }),
  setAutoRegenEnabled: (val) => set({ autoRegenEnabled: val }),
  setAutoOptimizeConfirmed: (val) => set({ autoOptimizeConfirmed: val }),
  setPublishedAt: (val) => set({ publishedAt: val }),
  setGoalConfigured: (val) => set({ goalConfigured: val }),

  confirmAutoOptimize: () => set({ autoOptimizeConfirmed: true }),
  markGoalConfigured: () => set({ goalConfigured: true }),
  markPublished: () => set((state) => ({
    publishedAt: state.publishedAt || Date.now(),
  })),
}))

export default useFeatureFlagsStore
