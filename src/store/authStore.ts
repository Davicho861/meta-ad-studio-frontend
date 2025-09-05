import { create } from 'zustand'
import { login as apiLogin, register as apiRegister } from '../services/authService'

type AuthState = {
  token: string | null
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? (localStorage.getItem('token') || null) : null,
  isAuthenticated: !!(typeof window !== 'undefined' && localStorage.getItem('token')),
  login: async (email, password) => {
    const token = await apiLogin(email, password)
    localStorage.setItem('token', token)
    set({ token, isAuthenticated: true })
  },
  register: async (email, password) => {
    const token = await apiRegister(email, password)
    localStorage.setItem('token', token)
    set({ token, isAuthenticated: true })
  },
  logout: () => {
    localStorage.removeItem('token')
    set({ token: null, isAuthenticated: false })
  }
}))

export default useAuthStore
