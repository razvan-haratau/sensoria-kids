export interface Product {
  id: string
  name: string
  description: string
  price: number
  compare_price?: number
  show_compare_price?: boolean
  sku: string
  stock_qty: number
  category: string
  age_range: string
  difficulty: 'Ușor' | 'Mediu' | 'Avansat'
  images: string[]
  status: 'active' | 'draft' | 'out_of_stock'
  weight?: number
  created_at: string
  updated_at: string
}

export interface CartItem {
  product: Product
  quantity: number
}

export interface Order {
  id: string
  customer_email: string
  customer_name: string
  customer_phone: string
  shipping_address: ShippingAddress
  items: OrderItem[]
  total: number
  shipping_cost: number
  payment_status: 'pending' | 'paid' | 'failed' | 'refunded'
  order_status: 'Nouă' | 'În procesare' | 'Expediată' | 'Livrată' | 'Anulată'
  netopia_ntpid?: string
  payment_method: 'card' | 'ramburs'
  created_at: string
}

export interface OrderItem {
  id: string
  order_id: string
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
}

export interface ShippingAddress {
  name: string
  street: string
  city: string
  county: string
  postal_code: string
  country: string
}

export interface Customer {
  id: string
  email: string
  name: string
  phone?: string
  address?: ShippingAddress
  created_at: string
}

export type ProductCategory = 'Planșe Simple' | 'Kit Complet' | 'Nisip Colorat' | 'Accesorii'
export type AgeRange = '2-4' | '4-6' | '6-8' | '8-10'
export type Difficulty = 'Ușor' | 'Mediu' | 'Avansat'
export type OrderStatus = 'Nouă' | 'În procesare' | 'Expediată' | 'Livrată' | 'Anulată'
