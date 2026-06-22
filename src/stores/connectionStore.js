import { create } from 'zustand'

/* ═══════════════════════════════════════════════════════════
   Connection Store — data fetching states per page
   Extracted from App.jsx useState declarations
   ═══════════════════════════════════════════════════════════ */

const useConnectionStore = create((set) => ({
  /* ── State ──────────────────────────────────────────────── */
  isOverviewConnected: false,
  isOverviewDataFetching: false,
  isDashboardConnected: false,
  isDashboardDataFetching: false,
  isInsightsConnected: false,
  isInsightsDataFetching: false,

  /* ── Actions ────────────────────────────────────────────── */
  setOverviewConnected: (val) => set({ isOverviewConnected: val }),
  setOverviewDataFetching: (val) => set({ isOverviewDataFetching: val }),
  setDashboardConnected: (val) => set({ isDashboardConnected: val }),
  setDashboardDataFetching: (val) => set({ isDashboardDataFetching: val }),
  setInsightsConnected: (val) => set({ isInsightsConnected: val }),
  setInsightsDataFetching: (val) => set({ isInsightsDataFetching: val }),
}))

export default useConnectionStore
