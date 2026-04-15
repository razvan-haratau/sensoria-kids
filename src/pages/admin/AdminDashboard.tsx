import { useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Package, Users, AlertTriangle, Eye, X, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useOrdersStore } from '../../store/ordersStore'
import { useProductsStore } from '../../store/productsStore'
import { Order, OrderStatus } from '../../types'

const ORDER_STATUS_COLORS: Record<string, string> = {
  'Nouă': 'bg-blue-100 text-blue-700',
  'În procesare': 'bg-yellow-100 text-yellow-700',
  'Expediată': 'bg-purple-100 text-purple-700',
  'Livrată': 'bg-green-100 text-green-700',
  'Anulată': 'bg-red-100 text-red-700',
}

const revenueData = [
  { month: 'Oct', value: 1200 },
  { month: 'Nov', value: 1800 },
  { month: 'Dec', value: 3200 },
  { month: 'Ian', value: 2100 },
  { month: 'Feb', value: 2600 },
  { month: 'Mar', value: 3100 },
]

const maxRevenue = Math.max(...revenueData.map((d) => d.value))

const allStatuses: OrderStatus[] = ['Nouă', 'În procesare', 'Expediată', 'Livrată', 'Anulată']
const steps: OrderStatus[] = ['Nouă', 'În procesare', 'Expediată', 'Livrată']

export default function AdminDashboard() {
  const { products } = useProductsStore()
  const { orders, updateOrderStatus, fetchOrders } = useOrdersStore()
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0)
  const totalOrders = orders.length
  const lowStockProducts = products.filter((p) => p.stock_qty > 0 && p.stock_qty <= 5)
  const outOfStockProducts = products.filter((p) => p.stock_qty === 0)
  const newOrdersCount = orders.filter((o) => o.order_status === 'Nouă').length
  const uniqueCustomers = new Set(orders.map((o) => o.customer_email)).size

  const stats = [
    {
      label: 'Venituri totale',
      value: `${totalRevenue.toLocaleString('ro')} RON`,
      change: `${totalOrders} comenzi plasate`,
      icon: TrendingUp,
      color: 'text-[#5BC4C0]',
      bg: 'bg-[#5BC4C0]/10',
    },
    {
      label: 'Comenzi',
      value: totalOrders,
      change: `${newOrdersCount} ${newOrdersCount === 1 ? 'comandă nouă' : 'comenzi noi'}`,
      icon: ShoppingBag,
      color: 'text-[#E86B9E]',
      bg: 'bg-[#E86B9E]/10',
    },
    {
      label: 'Produse active',
      value: products.filter((p) => p.status === 'active').length,
      change: `${outOfStockProducts.length} stoc epuizat`,
      icon: Package,
      color: 'text-[#B07CC6]',
      bg: 'bg-[#B07CC6]/10',
    },
    {
      label: 'Clienți unici',
      value: uniqueCustomers,
      change: 'din comenzi plasate',
      icon: Users,
      color: 'text-[#F4A68F]',
      bg: 'bg-[#F4A68F]/10',
    },
  ]

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status)
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, order_status: status } : null)
    }
  }

  return (
    <div className="space-y-8">
      {/* Low stock alert */}
      {(lowStockProducts.length > 0 || outOfStockProducts.length > 0) && (
        <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-start gap-3">
          <AlertTriangle size={20} className="text-orange-500 shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold text-orange-700 text-sm">Alertă stoc</p>
            <p className="text-orange-600 text-sm">
              {outOfStockProducts.length} produs(e) fără stoc, {lowStockProducts.length} produs(e) cu stoc redus.{' '}
              <Link to="/admin/produse" className="underline font-semibold hover:no-underline">
                Gestionează inventarul
              </Link>
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-5">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-6 shadow-card">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-11 h-11 ${stat.bg} rounded-xl flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
            </div>
            <p className="text-2xl font-bold text-[#2D2D2D] mb-1">{stat.value}</p>
            <p className="text-xs text-[#6B7280]">{stat.label}</p>
            <p className="text-xs text-green-600 font-medium mt-1">{stat.change}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-bold text-[#2D2D2D] mb-6">Venituri lunare (RON)</h3>
          <div className="flex items-end gap-3 h-40">
            {revenueData.map((d) => (
              <div key={d.month} className="flex-1 flex flex-col items-center gap-2">
                <span className="text-xs text-[#6B7280] font-medium">{d.value.toLocaleString('ro')}</span>
                <div
                  className="w-full bg-gradient-to-t from-[#5BC4C0] to-[#5BC4C0]/60 rounded-lg transition-all hover:from-[#3EA8A4] hover:to-[#3EA8A4]/60"
                  style={{ height: `${(d.value / maxRevenue) * 100}%` }}
                />
                <span className="text-xs text-[#6B7280]">{d.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Low stock */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-[#2D2D2D]">Stoc redus</h3>
            <Link to="/admin/produse" className="text-xs text-[#5BC4C0] font-semibold hover:underline">
              Vezi toate
            </Link>
          </div>
          <div className="space-y-3">
            {[...outOfStockProducts, ...lowStockProducts].slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                  {p.images[0] && <img src={p.images[0]} alt={p.name} className="w-full h-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-[#2D2D2D] truncate">{p.name}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-gray-100 rounded-full">
                      <div
                        className={`h-full rounded-full ${p.stock_qty === 0 ? 'bg-red-400' : p.stock_qty <= 3 ? 'bg-orange-400' : 'bg-yellow-400'}`}
                        style={{ width: `${Math.min((p.stock_qty / 20) * 100, 100)}%` }}
                      />
                    </div>
                    <span className={`text-xs font-bold ${p.stock_qty === 0 ? 'text-red-500' : 'text-orange-500'}`}>
                      {p.stock_qty}
                    </span>
                  </div>
                </div>
              </div>
            ))}
            {lowStockProducts.length === 0 && outOfStockProducts.length === 0 && (
              <p className="text-sm text-[#6B7280] text-center py-4">Stoc OK pentru toate produsele</p>
            )}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="font-bold text-[#2D2D2D]">Comenzi recente</h3>
          <Link to="/admin/comenzi" className="text-sm text-[#5BC4C0] font-semibold hover:underline">
            Vezi toate
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Comandă</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Data</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.slice(0, 5).map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-[#5BC4C0]">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#2D2D2D]">{order.customer_name}</p>
                    <p className="text-xs text-[#6B7280]">{order.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#2D2D2D]">{order.total} RON</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${ORDER_STATUS_COLORS[order.order_status]}`}>
                      {order.order_status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">
                    {new Date(order.created_at).toLocaleDateString('ro-RO')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors inline-flex"
                    >
                      <Eye size={15} className="text-[#6B7280]" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order detail modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-hover">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h3 className="font-bold text-lg text-[#2D2D2D]">{selectedOrder.id}</h3>
              <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>
            <div className="p-6 space-y-5">
              {/* Status stepper */}
              <div>
                <p className="text-sm font-semibold text-[#2D2D2D] mb-3">Status comandă</p>
                <div className="flex items-center gap-0">
                  {steps.map((s, i) => {
                    const currentIdx = steps.indexOf(selectedOrder.order_status as OrderStatus)
                    const isActive = i === currentIdx
                    const isDone = i < currentIdx
                    return (
                      <div key={s} className="flex items-center flex-1">
                        <button
                          onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shrink-0 ${
                            isDone ? 'bg-green-500 text-white' : isActive ? 'bg-[#5BC4C0] text-white' : 'bg-gray-200 text-gray-400'
                          }`}
                        >
                          {isDone ? <Check size={14} /> : i + 1}
                        </button>
                        {i < steps.length - 1 && (
                          <div className={`flex-1 h-0.5 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    )
                  })}
                </div>
                <div className="flex justify-between mt-1">
                  {steps.map((s) => (
                    <p key={s} className="text-xs text-[#6B7280] text-center" style={{ width: '25%' }}>{s}</p>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-semibold text-[#2D2D2D] mb-2">Client</p>
                <p className="text-sm text-[#6B7280]">{selectedOrder.customer_name}</p>
                <p className="text-sm text-[#6B7280]">{selectedOrder.customer_email}</p>
                <p className="text-sm text-[#6B7280]">{selectedOrder.customer_phone}</p>
              </div>

              <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-base text-[#2D2D2D]">
                <span>Total</span>
                <span>{selectedOrder.total} RON</span>
              </div>

              {/* Change status */}
              <div>
                <p className="text-sm font-semibold text-[#2D2D2D] mb-2">Schimbă statusul</p>
                <div className="flex flex-wrap gap-2">
                  {allStatuses.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleUpdateStatus(selectedOrder.id, s)}
                      className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                        selectedOrder.order_status === s
                          ? ORDER_STATUS_COLORS[s]
                          : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
