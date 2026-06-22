import { create } from 'zustand'

/* ═══════════════════════════════════════════════════════════
   Brand Store — brand selection, switching, CRUD
   Extracted from App.jsx useState declarations
   ═══════════════════════════════════════════════════════════ */

const useBrandStore = create((set, get) => ({
  /* ── State ──────────────────────────────────────────────── */
  brands: ['Default Brand'],
  selectedBrand: 'Default Brand',
  brandDetails: {
    'Default Brand': { url: '', isAnalyzed: false },
  },
  isBrandSwitching: false,
  isCreateBrandModalOpen: false,
  editingBrand: null,

  /* ── Actions ────────────────────────────────────────────── */
  setSelectedBrand: (brand) => set({ selectedBrand: brand }),

  setBrands: (updater) => set((state) => ({
    brands: typeof updater === 'function' ? updater(state.brands) : updater,
  })),

  setBrandDetails: (updater) => set((state) => ({
    brandDetails: typeof updater === 'function' ? updater(state.brandDetails) : updater,
  })),

  setIsBrandSwitching: (val) => set({ isBrandSwitching: val }),
  setIsCreateBrandModalOpen: (val) => set({ isCreateBrandModalOpen: val }),
  setEditingBrand: (brand) => set({ editingBrand: brand }),
  clearEditingBrand: () => set({ editingBrand: null }),

  /* ── Compound actions ───────────────────────────────────── */
  switchBrand: (brand) => {
    set({ isBrandSwitching: true, selectedBrand: brand })
    // Simulate loading/syncing time
    setTimeout(() => {
      set({ isBrandSwitching: false })
    }, 1500)
  },

  createBrand: (newBrand) => {
    const brandName = newBrand.name
    set((state) => {
      const updatedBrands = state.brands.includes(brandName)
        ? state.brands
        : [...state.brands, brandName]
      return {
        brands: updatedBrands,
        brandDetails: {
          ...state.brandDetails,
          [brandName]: {
            url: newBrand.url || '',
            isAnalyzed: false,
          },
        },
      }
    })
    // Then switch to new brand
    get().switchBrand(brandName)
  },

  updateBrandDetail: (brandName, details) => {
    set((state) => ({
      brandDetails: {
        ...state.brandDetails,
        [brandName]: { ...state.brandDetails[brandName], ...details },
      },
    }))
  },
}))

export default useBrandStore
