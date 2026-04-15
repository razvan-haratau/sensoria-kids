import { useState, useEffect } from 'react'
import { Search, ChevronDown, Eye, X, Check, Download } from 'lucide-react'
import { useOrdersStore } from '../../store/ordersStore'
import { Order, OrderStatus } from '../../types'

const STATUS_COLORS: Record<string, string> = {
  'Nouă': 'bg-blue-100 text-blue-700',
  'În procesare': 'bg-yellow-100 text-yellow-700',
  'Expediată': 'bg-purple-100 text-purple-700',
  'Livrată': 'bg-green-100 text-green-700',
  'Anulată': 'bg-red-100 text-red-700',
}

const PAYMENT_COLORS: Record<string, string> = {
  paid: 'bg-green-100 text-green-700',
  pending: 'bg-yellow-100 text-yellow-700',
  failed: 'bg-red-100 text-red-700',
  refunded: 'bg-gray-100 text-gray-600',
}

const PAYMENT_LABELS: Record<string, string> = {
  paid: 'Plătit',
  pending: 'În așteptare',
  failed: 'Eșuat',
  refunded: 'Rambursat',
}

const allStatuses: OrderStatus[] = ['Nouă', 'În procesare', 'Expediată', 'Livrată', 'Anulată']

export default function AdminOrders() {
  const { orders, updateOrderStatus, fetchOrders } = useOrdersStore()
  const [search, setSearch] = useState('')
  const [filterStatus, setFilterStatus] = useState<string>('Toate')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  useEffect(() => {
    fetchOrders()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = orders.filter((o) => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(search.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(search.toLowerCase())
    const matchStatus = filterStatus === 'Toate' || o.order_status === filterStatus
    return matchSearch && matchStatus
  })

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    updateOrderStatus(orderId, status)
    if (selectedOrder?.id === orderId) {
      setSelectedOrder((prev) => prev ? { ...prev, order_status: status } : null)
    }
  }

  const steps: OrderStatus[] = ['Nouă', 'În procesare', 'Expediată', 'Livrată']

  const exportCSV = () => {
    const rows = [
      ['ID Comandă', 'Client', 'Email', 'Telefon', 'Stradă', 'Oraș', 'Județ', 'Produse', 'Transport (RON)', 'Total (RON)', 'Plată', 'Status', 'Data'],
      ...filtered.map((o) => {
        const addr = o.shipping_address as unknown as Record<string, string>
        const items = (o.items as any[]).map((i: any) => `${i.product_name} x${i.quantity}`).join(' | ')
        return [
          o.id,
          o.customer_name,
          o.customer_email,
          o.customer_phone ?? '',
          addr?.street ?? '',
          addr?.city ?? '',
          addr?.county ?? '',
          items,
          o.shipping_cost,
          o.total,
          PAYMENT_LABELS[o.payment_status] ?? o.payment_status,
          o.order_status,
          new Date(o.created_at).toLocaleDateString('ro-RO'),
        ]
      }),
    ]
    const csv = rows.map((r) => r.map((v) => `"${String(v).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `comenzi-sensoria-${new Date().toISOString().slice(0, 10)}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#2D2D2D]">Comenzi</h2>
          <p className="text-sm text-[#6B7280]">{orders.length} comenzi în total</p>
        </div>
        <button
          onClick={exportCSV}
          className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm font-medium text-[#2D2D2D] hover:border-[#5BC4C0] hover:text-[#5BC4C0] transition-colors shadow-card"
        >
          <Download size={15} />
          Export Excel
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-card focus-within:border-[#5BC4C0] transition-colors">
          <Search size={16} className="text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Caută comandă, client, email..."
            className="flex-1 outline-none text-sm text-[#2D2D2D] placeholder-gray-400"
          />
        </div>
        <div className="relative">
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 text-sm font-medium text-[#2D2D2D] outline-none shadow-card"
          >
            <option value="Toate">Toate statusurile</option>
            {allStatuses.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">ID Comandă</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Total</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Plată</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Status</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Data</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 text-sm font-mono font-semibold text-[#5BC4C0]">{order.id}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-medium text-[#2D2D2D]">{order.customer_name}</p>
                    <p className="text-xs text-[#6B7280]">{order.customer_email}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#2D2D2D]">{order.total} RON</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${PAYMENT_COLORS[order.payment_status]}`}>
                      {PAYMENT_LABELS[order.payment_status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="relative">
                      <select
                        value={order.order_status}
                        onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                        className={`appearance-none text-xs font-semibold px-2.5 py-1 pr-6 rounded-full cursor-pointer outline-none ${STATUS_COLORS[order.order_status]}`}
                      >
                        {allStatuses.map((s) => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <ChevronDown size={10} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">
                    {new Date(order.created_at).toLocaleDateString('ro-RO')}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                    >
                      <Eye size={15} />
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

              {/* Customer */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-semibold text-[#2D2D2D] mb-2">Informații client</p>
                <p className="text-sm text-[#6B7280]">{selectedOrder.customer_name}</p>
                <p className="text-sm text-[#6B7280]">{selectedOrder.customer_email}</p>
                <p className="text-sm text-[#6B7280]">{selectedOrder.customer_phone}</p>
              </div>

              {/* Address */}
              <div className="bg-gray-50 rounded-2xl p-4">
                <p className="text-sm font-semibold text-[#2D2D2D] mb-2">Adresă livrare</p>
                {(() => {
                  const addr = selectedOrder.shipping_address as unknown as Record<string, string>
                  return (
                    <>
                      <p className="text-sm text-[#6B7280]">{addr.street}</p>
                      <p className="text-sm text-[#6B7280]">{addr.city}, {addr.county}</p>
                    </>
                  )
                })()}
              </div>

              {/* Items */}
              <div>
                <p className="text-sm font-semibold text-[#2D2D2D] mb-2">Produse comandate</p>
                <div className="space-y-2">
                  {(selectedOrder.items as any[]).map((item: any) => (
                    <div key={item.id} className="flex justify-between text-sm">
                      <span className="text-[#2D2D2D]">{item.product_name} × {item.quantity}</span>
                      <span className="font-semibold">{item.unit_price * item.quantity} RON</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-gray-100 pt-4 space-y-1.5 text-sm">
                <div className="flex justify-between text-[#6B7280]">
                  <span>Transport</span>
                  <span>{selectedOrder.shipping_cost === 0 ? 'Gratuit' : `${selectedOrder.shipping_cost} RON`}</span>
                </div>
                <div className="flex justify-between font-bold text-base text-[#2D2D2D]">
                  <span>Total</span>
                  <span>{selectedOrder.total} RON</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
