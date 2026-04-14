import { useMemo } from 'react'
import { TrendingUp, ShoppingBag, Users, Package } from 'lucide-react'
import { useOrdersStore } from '../../store/ordersStore'
import { useProductsStore } from '../../store/productsStore'

const CATEGORY_COLORS: Record<string, string> = {
  'Kit Complet': '#5BC4C0',
  'Planșe Simple': '#E86B9E',
  'Nisip Colorat': '#B07CC6',
  'Accesorii': '#F4A68F',
}

export default function AdminReports() {
  const { orders } = useOrdersStore()
  const { products } = useProductsStore()

  const totalRevenue = useMemo(
    () => orders.reduce((sum, o) => sum + o.total, 0),
    [orders]
  )
  const avgOrderValue = orders.length > 0 ? Math.round(totalRevenue / orders.length) : 0

  // Last 6 months of real revenue
  const monthlyRevenue = useMemo(() => {
    const now = new Date()
    return Array.from({ length: 6 }, (_, i) => {
      const date = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1)
      const nextDate = new Date(now.getFullYear(), now.getMonth() - (5 - i) + 1, 1)
      const monthOrders = orders.filter((o) => {
        const d = new Date(o.created_at)
        return d >= date && d < nextDate
      })
      return {
        month: date.toLocaleString('ro-RO', { month: 'short' }).replace('.', ''),
        revenue: monthOrders.reduce((s, o) => s + o.total, 0),
        orders: monthOrders.length,
      }
    })
  }, [orders])

  const maxRevenue = Math.max(...monthlyRevenue.map((d) => d.revenue), 1)

  // Category breakdown from actual order items
  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {}
    orders.forEach((o) => {
      o.items.forEach((item) => {
        const product = products.find((p) => p.id === item.product_id)
        const cat = product?.category ?? 'Altele'
        totals[cat] = (totals[cat] || 0) + item.unit_price * item.quantity
      })
    })
    const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0)
    if (grandTotal === 0) {
      // Fallback when no orders yet
      return [
        { name: 'Kit Complet', value: 45, color: '#5BC4C0' },
        { name: 'Planșe Simple', value: 30, color: '#E86B9E' },
        { name: 'Nisip Colorat', value: 15, color: '#B07CC6' },
        { name: 'Accesorii', value: 10, color: '#F4A68F' },
      ]
    }
    return Object.entries(totals)
      .map(([name, val]) => ({
        name,
        value: Math.round((val / grandTotal) * 100),
        color: CATEGORY_COLORS[name] ?? '#9CA3AF',
      }))
      .sort((a, b) => b.value - a.value)
  }, [orders, products])

  // Top products by quantity sold
  const topProducts = useMemo(() => {
    const qtys: Record<string, number> = {}
    orders.forEach((o) => {
      o.items.forEach((item) => {
        qtys[item.product_id] = (qtys[item.product_id] || 0) + item.quantity
      })
    })
    return products
      .filter((p) => qtys[p.id])
      .sort((a, b) => (qtys[b.id] || 0) - (qtys[a.id] || 0))
      .slice(0, 3)
  }, [orders, products])

  const uniqueCustomers = useMemo(
    () => new Set(orders.map((o) => o.customer_email)).size,
    [orders]
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#2D2D2D]">Rapoarte & Analiză</h2>
        <p className="text-sm text-[#6B7280]">Date din ultimele 6 luni</p>
      </div>

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Venituri totale', value: `${totalRevenue.toLocaleString('ro')} RON`, icon: TrendingUp, color: 'text-[#5BC4C0]', bg: 'bg-[#5BC4C0]/10' },
          { label: 'Comenzi totale', value: orders.length, icon: ShoppingBag, color: 'text-[#E86B9E]', bg: 'bg-[#E86B9E]/10' },
          { label: 'Valoare medie comandă', value: `${avgOrderValue} RON`, icon: Package, color: 'text-[#B07CC6]', bg: 'bg-[#B07CC6]/10' },
          { label: 'Clienți unici', value: uniqueCustomers, icon: Users, color: 'text-[#F4A68F]', bg: 'bg-[#F4A68F]/10' },
        ].map((s) => (
          <div key={s.label} className="bg-white rounded-2xl p-5 shadow-card">
            <div className={`w-10 h-10 ${s.bg} rounded-xl flex items-center justify-center mb-3`}>
              <s.icon size={18} className={s.color} />
            </div>
            <p className="text-2xl font-bold text-[#2D2D2D]">{s.value}</p>
            <p className="text-xs text-[#6B7280] mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Revenue bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-bold text-[#2D2D2D] mb-6">Evoluție venituri lunare</h3>
          <div className="space-y-3">
            {monthlyRevenue.map((d) => (
              <div key={d.month} className="flex items-center gap-4">
                <span className="text-xs text-[#6B7280] w-12 shrink-0 capitalize">{d.month}</span>
                <div className="flex-1 h-8 bg-gray-100 rounded-lg overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#5BC4C0] to-[#5BC4C0]/80 rounded-lg flex items-center justify-end pr-3 transition-all duration-500"
                    style={{ width: `${(d.revenue / maxRevenue) * 100}%`, minWidth: d.revenue > 0 ? '60px' : '0' }}
                  >
                    {d.revenue > 0 && (
                      <span className="text-xs font-bold text-white whitespace-nowrap">{d.revenue.toLocaleString('ro')} RON</span>
                    )}
                  </div>
                </div>
                <span className="text-xs text-[#6B7280] w-14 text-right shrink-0">{d.orders} com.</span>
              </div>
            ))}
          </div>
        </div>

        {/* Category breakdown */}
        <div className="bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-bold text-[#2D2D2D] mb-6">Vânzări pe categorii</h3>
          <div className="space-y-4">
            {categoryData.map((c) => (
              <div key={c.name}>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="font-medium text-[#2D2D2D]">{c.name}</span>
                  <span className="text-[#6B7280]">{c.value}%</span>
                </div>
                <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${c.value}%`, backgroundColor: c.color }}
                  />
                </div>
              </div>
            ))}
          </div>

          {topProducts.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-3">Top produse vândute</p>
              {topProducts.map((p, i) => (
                <div key={p.id} className="flex items-center gap-2 mb-2">
                  <span className="text-xs font-bold text-[#6B7280] w-4">{i + 1}.</span>
                  <p className="text-xs text-[#2D2D2D] flex-1 truncate">{p.name}</p>
                  <span className="text-xs font-semibold text-[#5BC4C0]">{p.price} RON</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
