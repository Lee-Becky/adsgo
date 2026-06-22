import { create } from 'zustand'

/* ═══════════════════════════════════════════════════════════
   Luna Store — AI Chat state, sync, quick prompts
   Stub for Phase 3 integration; provides the state shape
   ═══════════════════════════════════════════════════════════ */

const useLunaStore = create((set, get) => ({
  /* ── Chat State ─────────────────────────────────────────── */
  isOpen: false,
  chatHistory: [],
  isThinking: false,

  /* ── Data Sources ───────────────────────────────────────── */
  activeDataSources: ['adPerformance', 'brandProfile'],

  /* ── Sync Mechanism ─────────────────────────────────────── */
  // Key: module path (e.g. 'settings/goals'), Value: suggestion data
  pendingSync: {},

  /* ── Quick Prompts ──────────────────────────────────────── */
  quickPrompts: [
    { id: 'analyze', label: 'Analyze performance', category: 'analysis' },
    { id: 'optimize', label: 'Optimize budget', category: 'optimize' },
    { id: 'create', label: 'Create campaign', category: 'create' },
    { id: 'report', label: 'Generate report', category: 'report' },
  ],

  /* ── Actions ────────────────────────────────────────────── */
  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),
  openChat: () => set({ isOpen: true }),
  closeChat: () => set({ isOpen: false }),

  addMessage: (message) => set((state) => ({
    chatHistory: [...state.chatHistory, {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      ...message,
    }],
  })),

  clearHistory: () => set({ chatHistory: [] }),
  setThinking: (val) => set({ isThinking: val }),

  setActiveDataSources: (sources) => set({ activeDataSources: sources }),

  /* ── Sync actions ───────────────────────────────────────── */
  setSyncData: (moduleKey, data) => set((state) => ({
    pendingSync: { ...state.pendingSync, [moduleKey]: data },
  })),

  clearSyncData: (moduleKey) => set((state) => {
    const next = { ...state.pendingSync }
    delete next[moduleKey]
    return { pendingSync: next }
  }),

  getSyncData: (moduleKey) => get().pendingSync[moduleKey] || null,

  /* ── Question mechanism ─────────────────────────────────── */
  pendingQuestion: null,
  setPendingQuestion: (question) => set({ pendingQuestion: question }),
  clearPendingQuestion: () => set({ pendingQuestion: null }),
}))

export default useLunaStore
