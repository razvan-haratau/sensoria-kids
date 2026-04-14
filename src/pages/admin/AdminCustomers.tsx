import { useState, useMemo } from 'react'
import { Search, Mail, Phone } from 'lucide-react'
import { useOrdersStore } from '../../store/ordersStore'

export default function AdminCustomers() {
  const { orders } = useOrdersStore()
  const [search, setSearch] = useState('')

  // Derive customers from real orders
  const customers = useMemo(() => {
    const map = new Map<string, {
      id: string
      name: string
      email: string
      phone: string
      orders: number
      total: number
      city: string
      created_at: string
    }>()

    orders.forEach((o) => {
      const existing = map.get(o.customer_email)
      if (existing) {
        existing.orders++
        existing.total += o.total
        // keep earliest date as registration date
        if (o.created_at < existing.created_at) {
          existing.created_at = o.created_at
        }
      } else {
        map.set(o.customer_email, {
          id: o.customer_email,
          name: o.customer_name,
          email: o.customer_email,
          phone: o.customer_phone,
          orders: 1,
          total: o.total,
          city: o.shipping_address.city,
          created_at: o.created_at,
        })
      }
    })

    return Array.from(map.values()).sort((a, b) => b.total - a.total)
  }, [orders])

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase()) ||
    c.city.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-[#2D2D2D]">Clienți</h2>
        <p className="text-sm text-[#6B7280]">{customers.length} clienți unici</p>
      </div>

      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-card focus-within:border-[#5BC4C0] transition-colors">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută după nume, email sau oraș..."
          className="flex-1 outline-none text-sm text-[#2D2D2D] placeholder-gray-400"
        />
      </div>

      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Client</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Contact</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Localitate</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Comenzi</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Total cheltuit</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Prima comandă</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-sm text-[#6B7280]">
                    {customers.length === 0 ? 'Nu există clienți înregistrați.' : 'Niciun client găsit.'}
                  </td>
                </tr>
              ) : filtered.map((customer) => (
                <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#5BC4C0] to-[#E86B9E] flex items-center justify-center text-white text-xs font-bold shrink-0">
                        {customer.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
                      </div>
                      <p className="text-sm font-semibold text-[#2D2D2D]">{customer.name}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <a href={`mailto:${customer.email}`} className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#5BC4C0] transition-colors">
                        <Mail size={12} />
                        {customer.email}
                      </a>
                      <a href={`tel:${customer.phone}`} className="flex items-center gap-1.5 text-xs text-[#6B7280] hover:text-[#5BC4C0] transition-colors">
                        <Phone size={12} />
                        {customer.phone}
                      </a>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">{customer.city}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center justify-center w-7 h-7 rounded-full bg-[#5BC4C0]/10 text-[#5BC4C0] text-sm font-bold">
                      {customer.orders}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-[#2D2D2D]">{customer.total} RON</td>
                  <td className="px-6 py-4 text-sm text-[#6B7280]">
                    {new Date(customer.created_at).toLocaleDateString('ro-RO')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
