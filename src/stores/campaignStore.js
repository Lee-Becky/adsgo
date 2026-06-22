import { create } from 'zustand'

/* ═══════════════════════════════════════════════════════════
   Campaign Store — campaign selection, modals, budget
   Extracted from App.jsx useState declarations
   ═══════════════════════════════════════════════════════════ */

const useCampaignStore = create((set) => ({
  /* ── State ──────────────────────────────────────────────── */
  selectedCampaign: null,
  showCampaignAnalysis: false,
  showBudgetReason: false,
  budgetReasonData: null,
  showBudgetEdit: false,
  budgetStatus: {},
  selectedProduct: null,
  hasGeneratedCampaign: false,
  firstGeneratedUrl: '',
  savedConfig: {
    objective: '',
    adsetGoal: '',
    event: '',
    locations: [],
    dailyLimit: '',
  },

  /* ── Actions ────────────────────────────────────────────── */
  setSelectedCampaign: (campaign) => set({ selectedCampaign: campaign }),
  setShowCampaignAnalysis: (val) => set({ showCampaignAnalysis: val }),
  setShowBudgetReason: (val) => set({ showBudgetReason: val }),
  setBudgetReasonData: (data) => set({ budgetReasonData: data }),
  setShowBudgetEdit: (val) => set({ showBudgetEdit: val }),
  setBudgetStatus: (updater) => set((state) => ({
    budgetStatus: typeof updater === 'function' ? updater(state.budgetStatus) : updater,
  })),
  setSelectedProduct: (product) => set({ selectedProduct: product }),
  setHasGeneratedCampaign: (val) => set({ hasGeneratedCampaign: val }),
  setFirstGeneratedUrl: (url) => set({ firstGeneratedUrl: url }),
  setSavedConfig: (updater) => set((state) => ({
    savedConfig: typeof updater === 'function' ? updater(state.savedConfig) : updater,
  })),

  /* ── Compound actions ───────────────────────────────────── */
  openCampaignAnalysis: (campaign) => set({
    selectedCampaign: campaign,
    showCampaignAnalysis: true,
  }),

  closeCampaignAnalysis: () => set({
    showCampaignAnalysis: false,
  }),

  openBudgetReason: (campaign) => set({
    selectedCampaign: campaign,
    budgetReasonData: campaign.budgetReason,
    showBudgetReason: true,
  }),

  closeBudgetReason: () => set({
    showBudgetReason: false,
  }),

  openBudgetEdit: (campaign) => set({
    selectedCampaign: campaign,
    showBudgetEdit: true,
  }),

  closeBudgetEdit: () => set({
    showBudgetEdit: false,
  }),

  updateBudgetStatus: (id, status) => set((state) => ({
    budgetStatus: { ...state.budgetStatus, [id]: status },
  })),

  saveBudget: (campaignId, budgetData) => {
    console.log('Saving budget:', campaignId, budgetData)
    // TODO: Implement actual budget saving logic
  },
}))

export default useCampaignStore
