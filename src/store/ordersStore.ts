import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { Order, OrderStatus } from '../types'

interface OrdersStore {
  orders: Order[]
  isLoading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  addOrder: (order: Order) => Promise<void>
  updateOrderStatus: (id: string, status: OrderStatus) => Promise<void>
}

export const useOrdersStore = create<OrdersStore>()((set) => ({
  orders: [],
  isLoading: false,
  error: null,

  fetchOrders: async () => {
    set({ isLoading: true, error: null })
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      set({ error: error.message, isLoading: false })
      return
    }
    set({ orders: (data ?? []) as Order[], isLoading: false })
  },

  addOrder: async (order) => {
    const { error } = await supabase.from('orders').insert({
      id: order.id,
      customer_email: order.customer_email,
      customer_name: order.customer_name,
      customer_phone: order.customer_phone,
      shipping_address: order.shipping_address,
      items: order.items,
      total: order.total,
      shipping_cost: order.shipping_cost,
      payment_status: order.payment_status,
      order_status: order.order_status,
      payment_method: order.payment_method,
      netopia_ntpid: order.netopia_ntpid ?? null,
      created_at: order.created_at,
    })

    if (error) throw new Error(error.message)
    set((state) => ({ orders: [order, ...state.orders] }))
  },

  updateOrderStatus: async (id, status) => {
    const { error } = await supabase
      .from('orders')
      .update({ order_status: status })
      .eq('id', id)

    if (error) throw new Error(error.message)
    set((state) => ({
      orders: state.orders.map((o) =>
        o.id === id ? { ...o, order_status: status } : o
      ),
    }))
  },
}))
