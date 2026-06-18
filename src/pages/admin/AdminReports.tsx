import { useMemo, useState, useEffect } from 'react'
import { TrendingUp, ShoppingBag, Users, Package } from 'lucide-react'
import { useOrdersStore } from '../../store/ordersStore'
import { useProductsStore } from '../../store/productsStore'

const CATEGORY_COLORS: Record<string, string> = {
  'Kit Complet': '#5BC4C0',
  'Planșe Simple': '#E86B9E',
  'Nisip Colorat': '#B07CC6',
  'Accesorii': '#F4A68F',
}

const MONTH_LABELS = ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

type PeriodKey = '7z' | '30z' | '6l' | '1an' | 'custom'
const PERIODS: { key: PeriodKey; label: string }[] = [
  { key: '7z', label: '7 zile' },
  { key: '30z', label: '30 zile' },
  { key: '6l', label: '6 luni' },
  { key: '1an', label: '1 an' },
  { key: 'custom', label: 'Custom' },
]

function RevenueLineChart({ data }: { data: { label: string; revenue: number; orders: number }[] }) {
  const [hoverIdx, setHoverIdx] = useState<number | null>(null)

  const W = 560, H = 220, PL = 64, PR = 20, PT = 16, PB = 36
  const chartW = W - PL - PR
  const chartH = H - PT - PB

  const maxRev = Math.max(...data.map((d) => d.revenue), 100)
  // arată mereu o scală curată
  const niceMax = Math.ceil(maxRev / 100) * 100
  const yTicks = [0, Math.round(niceMax * 0.25), Math.round(niceMax * 0.5), Math.round(niceMax * 0.75), niceMax]

  const px = (i: number) => PL + (i / Math.max(data.length - 1, 1)) * chartW
  const py = (v: number) => PT + chartH - (v / niceMax) * chartH

  const points = data.map((d, i) => ({ x: px(i), y: py(d.revenue), d }))

  const linePath = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')
  const areaPath = `${linePath} L${points[points.length - 1].x.toFixed(1)},${(PT + chartH).toFixed(1)} L${PL.toFixed(1)},${(PT + chartH).toFixed(1)} Z`

  const hovered = hoverIdx !== null ? points[hoverIdx] : null

  return (
    <div className="w-full" style={{ overflowX: 'auto' }}>
      <svg viewBox={`0 0 ${W} ${H}`} style={{ display: 'block', width: '100%', minWidth: 320 }}>
        <defs>
          <linearGradient id="areaGrad2" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5BC4C0" stopOpacity="0.15" />
            <stop offset="100%" stopColor="#5BC4C0" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Y-axis grid + labels */}
        {yTicks.map((tick) => {
          const y = py(tick)
          return (
            <g key={tick}>
              <line x1={PL} y1={y} x2={W - PR} y2={y} stroke="#F3F4F6" strokeWidth="1" />
              <text x={PL - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9CA3AF" fontFamily="inherit">
                {tick === 0 ? '0' : tick >= 1000 ? `${(tick / 1000).toFixed(1)}k` : `${tick}`}
              </text>
            </g>
          )
        })}

        {/* Hover vertical line */}
        {hovered && (
          <line x1={hovered.x} y1={PT} x2={hovered.x} y2={PT + chartH} stroke="#E5E7EB" strokeWidth="1" strokeDasharray="4 3" />
        )}

        {/* Area fill */}
        <path d={areaPath} fill="url(#areaGrad2)" />

        {/* Line */}
        <path d={linePath} fill="none" stroke="#5BC4C0" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />

        {/* Dots */}
        {points.map((p, i) => (
          <circle
            key={i}
            cx={p.x} cy={p.y} r={hoverIdx === i ? 6 : 4}
            fill={hoverIdx === i ? '#5BC4C0' : p.d.revenue > 0 ? '#5BC4C0' : '#E5E7EB'}
            stroke="white" strokeWidth="2"
            style={{ cursor: 'pointer', transition: 'r 0.1s' }}
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          />
        ))}

        {/* Invisible wider hover targets */}
        {points.map((p, i) => (
          <rect
            key={`h${i}`}
            x={p.x - 20} y={PT} width="40" height={chartH}
            fill="transparent"
            onMouseEnter={() => setHoverIdx(i)}
            onMouseLeave={() => setHoverIdx(null)}
          />
        ))}

        {/* X-axis labels */}
        {data.map((d, i) => (
          <text key={i} x={px(i)} y={H - 8} textAnchor="middle" fontSize="11" fill="#9CA3AF" fontFamily="inherit" style={{ textTransform: 'capitalize' }}>
            {d.label}
          </text>
        ))}

        {/* Tooltip */}
        {hovered && (() => {
          const pad = 10
          const bw = 120, bh = 42
          const tx = Math.min(hovered.x + pad, W - bw - PR)
          const ty = Math.max(PT + 4, hovered.y - bh - pad)
          return (
            <g>
              <rect x={tx} y={ty} width={bw} height={bh} rx="8" fill="#1F2937" />
              <text x={tx + 10} y={ty + 16} fontSize="12" fill="white" fontWeight="700" fontFamily="inherit">
                {hovered.d.revenue.toLocaleString('ro')} RON
              </text>
              <text x={tx + 10} y={ty + 32} fontSize="11" fill="#9CA3AF" fontFamily="inherit">
                {hovered.d.orders} {hovered.d.orders === 1 ? 'comandă' : 'comenzi'}
              </text>
            </g>
          )
        })()}
      </svg>
    </div>
  )
}

export default function AdminReports() {
  const { orders, fetchOrders } = useOrdersStore()
  const { products } = useProductsStore()
  const [period, setPeriod] = useState<PeriodKey>('6l')

  useEffect(() => {
    fetchOrders()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps
  const [customFrom, setCustomFrom] = useState('')
  const [customTo, setCustomTo] = useState('')

  const now = new Date()

  const dateRange = useMemo(() => {
    const to = new Date(now); to.setHours(23, 59, 59, 999)
    if (period === '7z') {
      const from = new Date(now); from.setDate(from.getDate() - 6); from.setHours(0, 0, 0, 0)
      return { from, to }
    }
    if (period === '30z') {
      const from = new Date(now); from.setDate(from.getDate() - 29); from.setHours(0, 0, 0, 0)
      return { from, to }
    }
    if (period === '6l') {
      return { from: new Date(now.getFullYear(), now.getMonth() - 5, 1), to }
    }
    if (period === '1an') {
      return { from: new Date(now.getFullYear(), now.getMonth() - 11, 1), to }
    }
    // custom
    const from = customFrom ? new Date(customFrom) : new Date(now.getFullYear(), now.getMonth(), 1)
    const customToDate = customTo ? new Date(customTo) : to
    customToDate.setHours(23, 59, 59, 999)
    return { from, to: customToDate }
  }, [period, customFrom, customTo]) // eslint-disable-line react-hooks/exhaustive-deps

  const filteredOrders = useMemo(
    () => orders.filter((o) => { const d = new Date(o.created_at); return d >= dateRange.from && d <= dateRange.to }),
    [orders, dateRange]
  )

  const totalRevenue = useMemo(() => filteredOrders.reduce((sum, o) => sum + o.total, 0), [filteredOrders])
  const avgOrderValue = filteredOrders.length > 0 ? Math.round(totalRevenue / filteredOrders.length) : 0
  const uniqueCustomers = useMemo(() => new Set(filteredOrders.map((o) => o.customer_email)).size, [filteredOrders])

  // Chart data — pe zile sau pe luni în funcție de perioadă
  const chartData = useMemo(() => {
    if (period === '7z' || period === '30z') {
      const days = period === '7z' ? 7 : 30
      return Array.from({ length: days }, (_, i) => {
        const d = new Date(dateRange.from)
        d.setDate(d.getDate() + i)
        const revenue = filteredOrders
          .filter((o) => new Date(o.created_at).toDateString() === d.toDateString())
          .reduce((s, o) => s + o.total, 0)
        const ordersCount = filteredOrders.filter((o) => new Date(o.created_at).toDateString() === d.toDateString()).length
        const label = period === '7z'
          ? `${d.getDate()} ${MONTH_LABELS[d.getMonth()]}`
          : `${d.getDate()}/${d.getMonth() + 1}`
        return { label, revenue, orders: ordersCount }
      })
    }
    // pe luni
    const months: { label: string; revenue: number; orders: number }[] = []
    const cur = new Date(dateRange.from.getFullYear(), dateRange.from.getMonth(), 1)
    while (cur <= dateRange.to) {
      const y = cur.getFullYear(); const m = cur.getMonth()
      const mo = filteredOrders.filter((o) => { const od = new Date(o.created_at); return od.getFullYear() === y && od.getMonth() === m })
      months.push({
        label: `${MONTH_LABELS[m]}${y !== now.getFullYear() ? ` ${y}` : ''}`,
        revenue: mo.reduce((s, o) => s + o.total, 0),
        orders: mo.length,
      })
      cur.setMonth(cur.getMonth() + 1)
    }
    return months
  }, [filteredOrders, period, dateRange]) // eslint-disable-line react-hooks/exhaustive-deps

  const maxRevenue = Math.max(...chartData.map((d) => d.revenue), 1)

  const categoryData = useMemo(() => {
    const totals: Record<string, number> = {}
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        const product = products.find((p) => p.id === item.product_id)
        const cat = product?.category ?? 'Altele'
        totals[cat] = (totals[cat] || 0) + item.unit_price * item.quantity
      })
    })
    const grandTotal = Object.values(totals).reduce((s, v) => s + v, 0)
    if (grandTotal === 0) return [
      { name: 'Kit Complet', value: 45, color: '#5BC4C0' },
      { name: 'Planșe Simple', value: 30, color: '#E86B9E' },
      { name: 'Nisip Colorat', value: 15, color: '#B07CC6' },
      { name: 'Accesorii', value: 10, color: '#F4A68F' },
    ]
    return Object.entries(totals)
      .map(([name, val]) => ({ name, value: Math.round((val / grandTotal) * 100), color: CATEGORY_COLORS[name] ?? '#9CA3AF' }))
      .sort((a, b) => b.value - a.value)
  }, [filteredOrders, products])

  const topProducts = useMemo(() => {
    const qtys: Record<string, number> = {}
    const revenues: Record<string, number> = {}
    filteredOrders.forEach((o) => {
      o.items.forEach((item) => {
        qtys[item.product_id] = (qtys[item.product_id] || 0) + item.quantity
        revenues[item.product_id] = (revenues[item.product_id] || 0) + item.unit_price * item.quantity
      })
    })
    return products
      .filter((p) => qtys[p.id])
      .sort((a, b) => (qtys[b.id] || 0) - (qtys[a.id] || 0))
      .slice(0, 3)
      .map((p) => ({ ...p, qtySold: qtys[p.id] || 0, totalRevenue: revenues[p.id] || 0 }))
  }, [filteredOrders, products])

  return (
    <div className="space-y-6">
      {/* Header + period selector */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D2D2D]">Rapoarte & Analiză</h2>
          <p className="text-sm text-[#6B7280]">{filteredOrders.length} comenzi în perioada selectată</p>
        </div>
        <div className="flex flex-wrap gap-1.5">
          {PERIODS.map((p) => (
            <button
              key={p.key}
              onClick={() => setPeriod(p.key)}
              className={`text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors ${
                period === p.key ? 'bg-[#5BC4C0] text-white' : 'bg-white border border-gray-200 text-[#6B7280] hover:border-[#5BC4C0] hover:text-[#5BC4C0]'
              }`}
            >
              {p.label}
            </button>
          ))}
        </div>
      </div>

      {period === 'custom' && (
        <div className="flex flex-wrap gap-3 bg-white rounded-2xl p-4 shadow-card">
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#6B7280] font-medium">De la</label>
            <input type="date" value={customFrom} onChange={(e) => setCustomFrom(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#5BC4C0]" />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-xs text-[#6B7280] font-medium">Până la</label>
            <input type="date" value={customTo} onChange={(e) => setCustomTo(e.target.value)}
              className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 outline-none focus:border-[#5BC4C0]" />
          </div>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        {[
          { label: 'Venituri', value: `${totalRevenue.toLocaleString('ro')} RON`, icon: TrendingUp, color: 'text-[#5BC4C0]', bg: 'bg-[#5BC4C0]/10' },
          { label: 'Comenzi', value: filteredOrders.length, icon: ShoppingBag, color: 'text-[#E86B9E]', bg: 'bg-[#E86B9E]/10' },
          { label: 'Valoare medie', value: `${avgOrderValue} RON`, icon: Package, color: 'text-[#B07CC6]', bg: 'bg-[#B07CC6]/10' },
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
        {/* Revenue line chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-card">
          <h3 className="font-bold text-[#2D2D2D] mb-4">Evoluție venituri</h3>
          <RevenueLineChart data={chartData} />
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
                  <div className="h-full rounded-full" style={{ width: `${c.value}%`, backgroundColor: c.color }} />
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
                  <span className="text-xs text-[#6B7280]">×{p.qtySold}</span>
                  <span className="text-xs font-semibold text-[#5BC4C0]">{p.totalRevenue} RON</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
