import { create } from 'zustand'
import { supabase } from '../lib/supabase'

interface NewsletterStore {
  subscribe: (email: string) => Promise<boolean>   // false = already subscribed
}

export const useNewsletterStore = create<NewsletterStore>()(() => ({
  subscribe: async (email) => {
    const normalized = email.toLowerCase().trim()

    const { error } = await supabase
      .from('newsletter_subscribers')
      .insert({ email: normalized })

    // Unique constraint violation → already subscribed
    if (error?.code === '23505') return false
    if (error) throw new Error(error.message)
    return true
  },
}))
