import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface AuthStore {
  isAuthenticated: boolean
  loading: boolean
  login: (email: string, pass: string) => Promise<{ ok: boolean; error?: string }>
  logout: () => Promise<void>
  initSession: () => Promise<void>
}

export const useAuthStore = create<AuthStore>()((set) => ({
  isAuthenticated: false,
  loading: true,

  initSession: async () => {
    const { data } = await supabase.auth.getSession()
    set({ isAuthenticated: !!data.session, loading: false })

    // Keep store in sync with Supabase auth state changes
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ isAuthenticated: !!session })
    })
  },

  login: async (email, pass) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password: pass })
    if (error) {
      // Map common Supabase auth errors to Romanian messages
      if (error.message.includes('Invalid login credentials')) {
        return { ok: false, error: 'Email sau parolă incorecte.' }
      }
      if (error.message.includes('Email not confirmed')) {
        return { ok: false, error: 'Confirmă email-ul înainte de a te autentifica.' }
      }
      return { ok: false, error: error.message }
    }
    set({ isAuthenticated: true })
    return { ok: true }
  },

  logout: async () => {
    await supabase.auth.signOut()
    set({ isAuthenticated: false })
  },
}))
