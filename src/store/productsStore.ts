import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Product } from '../types'

interface ProductsStore {
  products: Product[]
  isLoading: boolean
  error: string | null
  fetchProducts: () => Promise<void>
  addProduct: (data: Omit<Product, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updateProduct: (id: string, data: Partial<Product>) => Promise<void>
  deleteProduct: (id: string) => Promise<void>
  decrementStock: (productId: string, quantity: number) => Promise<void>
}

export const useProductsStore = create<ProductsStore>()((set, get) => ({
  products: [],
  isLoading: false,
  error: null,

  fetchProducts: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }
    set({ products: (data ?? []) as Product[], isLoading: false })
  },

  addProduct: async (data) => {
    const { data: inserted, error } = await supabase
      .from('products')
      .insert(data)
      .select()
      .single()

    if (error) throw new Error(error.message)
    set((state) => ({ products: [inserted as Product, ...state.products] }))
  },

  updateProduct: async (id, data) => {
    const { data: updated, error } = await supabase
      .from('products')
      .update(data)
      .eq('id', id)
      .select()
      .single()

    if (error) throw new Error(error.message)
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? (updated as Product) : p)),
    }))
  },

  deleteProduct: async (id) => {
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (error) throw new Error(error.message)
    set((state) => ({ products: state.products.filter((p) => p.id !== id) }))
  },

  decrementStock: async (productId, quantity) => {
    const product = get().products.find((p) => p.id === productId)
    if (!product) return

    const newQty = Math.max(0, product.stock_qty - quantity)
    const newStatus = newQty === 0 ? 'out_of_stock' : product.status

    await supabase
      .from('products')
      .update({ stock_qty: newQty, status: newStatus })
      .eq('id', productId)

    set((state) => ({
      products: state.products.map((p) =>
        p.id === productId ? { ...p, stock_qty: newQty, status: newStatus as Product['status'] } : p
      ),
    }))
  },
}))
