import create from 'zustand'

const useAdStore = create((set) => ({
  prompt: '',
  ads: [],
  isLoading: false,
  setPrompt: (newPrompt) => set({ prompt: newPrompt }),
  generateAds: async () => {
    set({ isLoading: true })
    try {
      // Simulate API call
      const response = await fetch('/api/generate-ads', {
        method: 'POST',
        body: JSON.stringify({ prompt: get().prompt }),
        headers: {
          'Content-Type': 'application/json',
        },
      })
      const data = await response.json()
      set({ ads: data.ads })
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error('Error generating ads:', error)
    } finally {
      set({ isLoading: false })
    }
  },
})) 

export default useAdStore