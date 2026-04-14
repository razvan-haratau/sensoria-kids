import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// ─── Database types ───────────────────────────────────────────────────────────

export type DbProduct = {
  id: string
  name: string
  description: string
  price: number
  compare_price: number | null
  show_compare_price: boolean
  sku: string
  stock_qty: number
  category: string
  age_range: string
  difficulty: string
  images: string[]
  status: string
  weight: number | null
  created_at: string
  updated_at: string
}

export type DbOrder = {
  id: string
  customer_email: string
  customer_name: string
  customer_phone: string
  shipping_address: Record<string, string>
  items: Record<string, unknown>[]
  total: number
  shipping_cost: number
  payment_status: string
  order_status: string
  payment_method: string
  netopia_ntpid: string | null
  created_at: string
}

export type DbSettings = {
  id: number
  store_name: string
  email: string
  phone: string
  address: string
  instagram_url: string
  facebook_url: string
  free_shipping_threshold: number
  shipping_cost: number
  low_stock_threshold: number
  currency: string
  updated_at: string
}
