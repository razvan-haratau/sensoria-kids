import { create } from 'zustand'
import { supabase } from '../lib/supabase'

export interface StoreSettings {
  storeName: string
  email: string
  phone: string
  address: string
  instagramUrl: string
  facebookUrl: string
  freeShippingThreshold: number
  shippingCost: number
  lowStockThreshold: number
  currency: string
}

const defaultSettings: StoreSettings = {
  storeName: 'Sensoria Kids',
  email: 'contact@sensoriakids.ro',
  phone: '+40 793 917 909',
  address: 'România',
  instagramUrl: 'https://www.instagram.com/sensoria.kids.bucharest/',
  facebookUrl: 'https://www.facebook.com/',
  freeShippingThreshold: 200,
  shippingCost: 20,
  lowStockThreshold: 5,
  currency: 'RON',
}

interface SettingsStore {
  settings: StoreSettings
  fetchSettings: () => Promise<void>
  updateSettings: (data: Partial<StoreSettings>) => Promise<void>
}

// Map DB column names (snake_case) → app field names (camelCase)
function dbToSettings(row: Record<string, unknown>): StoreSettings {
  return {
    storeName: (row.store_name as string) || defaultSettings.storeName,
    email: (row.email as string) || defaultSettings.email,
    phone: (row.phone as string) || defaultSettings.phone,
    address: (row.address as string) || defaultSettings.address,
    instagramUrl: (row.instagram_url as string) || defaultSettings.instagramUrl,
    facebookUrl: (row.facebook_url as string) || defaultSettings.facebookUrl,
    freeShippingThreshold: (row.free_shipping_threshold as number) ?? defaultSettings.freeShippingThreshold,
    shippingCost: (row.shipping_cost as number) ?? defaultSettings.shippingCost,
    lowStockThreshold: (row.low_stock_threshold as number) ?? defaultSettings.lowStockThreshold,
    currency: (row.currency as string) ?? defaultSettings.currency,
  }
}

function settingsToDb(data: Partial<StoreSettings>): Record<string, unknown> {
  const map: Record<string, string> = {
    storeName: 'store_name',
    email: 'email',
    phone: 'phone',
    address: 'address',
    instagramUrl: 'instagram_url',
    facebookUrl: 'facebook_url',
    freeShippingThreshold: 'free_shipping_threshold',
    shippingCost: 'shipping_cost',
    lowStockThreshold: 'low_stock_threshold',
    currency: 'currency',
  }
  const result: Record<string, unknown> = {}
  for (const [key, val] of Object.entries(data)) {
    if (map[key]) result[map[key]] = val
  }
  return result
}

export const useSettingsStore = create<SettingsStore>()((set, get) => ({
  settings: defaultSettings,

  fetchSettings: async () => {
    const { data, error } = await supabase
      .from('settings')
      .select('*')
      .eq('id', 1)
      .single()

    if (!error && data) {
      set({ settings: dbToSettings(data as Record<string, unknown>) })
    }
  },

  updateSettings: async (data) => {
    const dbData = settingsToDb(data)
    const { error } = await supabase.from('settings').update(dbData).eq('id', 1)
    if (error) throw new Error(error.message)
    set((state) => ({ settings: { ...state.settings, ...data } }))
  },

  // Keep backwards-compatible sync setter for parts of the app that don't need async
  ...(false ? { _unused: get } : {}),
}))
