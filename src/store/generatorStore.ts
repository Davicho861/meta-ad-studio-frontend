import { create } from 'zustand'
import { generateAdConcepts } from '../services/aiService'
import type { AdConcept } from '../services/aiService'

type GeneratorSettings = {
  aspectRatio: string
  style: string
  version: string
}

type GeneratorState = {
  promptText: string
  generatorSettings: GeneratorSettings
  isLoading: boolean
  placeholders: boolean
  results: AdConcept[]
  updatePromptText: (text: string) => void
  updateSetting: (key: keyof GeneratorSettings, value: string) => void
  generate: () => Promise<void>
}

export const useGeneratorStore = create<GeneratorState>((set: any, get: any) => ({
  promptText: '',
  generatorSettings: { aspectRatio: '1:1', style: 'Neón', version: 'v1' },
  isLoading: false,
  placeholders: false,
  results: [],

  updatePromptText: (text: string) => set({ promptText: text }),

  updateSetting: (key, value) => set((state: GeneratorState) => ({ generatorSettings: { ...state.generatorSettings, [key]: value } })),

  generate: async () => {
    const { promptText, generatorSettings } = get()
    // simple validation: if no prompt, do nothing
    if (!promptText || promptText.trim().length === 0) return

    set({ isLoading: true, placeholders: true })

    try {
      const concepts = await generateAdConcepts(promptText, generatorSettings)
      set((state: GeneratorState) => ({
        isLoading: false,
        placeholders: false,
        results: [...concepts, ...state.results]
      }))
    } catch (err) {
      console.error('Error generating concepts:', err)
      set((state: GeneratorState) => ({
        isLoading: false,
        placeholders: false,
        results: [{ title: 'Error', description: 'No se pudieron generar los conceptos. Intenta de nuevo.' }, ...state.results]
      }))
    }
  }
}))

export default useGeneratorStore
