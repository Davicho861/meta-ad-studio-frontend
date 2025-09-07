import create from 'zustand'
import aiService from '../services/aiService'
import { getAllGenerations, getGenerationById } from '../services/dbService'

export const useAdStore = create((set, get) => ({
  prompt: '',
  isLoading: false,
  generatedAds: [],
  selectedAd: null,
  isSettingsPanelOpen: false,
  generationProgress: { status: 'idle', logs: [] },
  history: [],

  setPrompt: (p) => set({ prompt: p }),
  setGenerationProgress: (val) => set({ generationProgress: val }),

  // Simulate generation flow
  generateAds: async (overridePrompt) => {
    const promptText = overridePrompt ?? get().prompt
    if (!promptText || promptText.trim() === '') return
  set({ isLoading: true, generatedAds: [], selectedAd: null, generationProgress: { status: 'running', logs: [] } })

    try {
      const ads = await aiService.generateAdCreatives(promptText)
      set({ generatedAds: ads, isLoading: false })
      // refresh local history after a successful run
      try {
        const h = await getAllGenerations()
        set({ history: h })
      } catch (e) {
        console.warn('Failed to refresh history', e)
      }
    } catch (err) {
      // In production we would handle/report the error more fully
      console.error('generateAds error', err)
      set({ isLoading: false })
    }
  },

  selectAd: (ad) => set({ selectedAd: ad, isSettingsPanelOpen: true }),
  closeSettings: () => set({ isSettingsPanelOpen: false }),
  clearAds: () => set({ generatedAds: [] }),
  loadHistory: async () => {
    try {
      const h = await getAllGenerations()
      set({ history: h })
    } catch (e) {
      console.warn('loadHistory failed', e)
    }
  },
  loadGenerationById: async (id) => {
    try {
      const g = await getGenerationById(id)
      if (g && g.results) set({ generatedAds: g.results })
    } catch (e) {
      console.warn('loadGenerationById failed', e)
    }
  },
}))

export default useAdStore
