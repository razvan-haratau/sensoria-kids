import { useState } from 'react'
import { Save, Check, AlertTriangle } from 'lucide-react'
import { useSettingsStore } from '../../store/settingsStore'

export default function AdminSettings() {
  const { settings, updateSettings } = useSettingsStore()
  const [form, setForm] = useState({ ...settings })
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSettings(form)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h2 className="text-xl font-bold text-[#2D2D2D]">Setări</h2>
        <p className="text-sm text-[#6B7280]">Configurează magazinul tău</p>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card space-y-5">
        <h3 className="font-bold text-[#2D2D2D] border-b border-gray-100 pb-3">Informații magazin</h3>

        {[
          { label: 'Nume magazin', key: 'storeName', type: 'text' },
          { label: 'Email contact', key: 'email', type: 'email' },
          { label: 'Telefon', key: 'phone', type: 'tel' },
          { label: 'Adresă', key: 'address', type: 'text' },
          { label: 'URL Instagram', key: 'instagramUrl', type: 'url' },
          { label: 'URL Facebook', key: 'facebookUrl', type: 'url' },
        ].map(({ label, key, type }) => (
          <div key={key}>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">{label}</label>
            <input
              type={type}
              value={form[key as keyof typeof form] as string}
              onChange={(e) => setForm({ ...form, [key]: e.target.value })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
            />
          </div>
        ))}
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-card space-y-5">
        <h3 className="font-bold text-[#2D2D2D] border-b border-gray-100 pb-3">Livrare & Stoc</h3>

        <div className="grid sm:grid-cols-2 gap-5">
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
              Prag livrare gratuită (RON)
            </label>
            <input
              type="number"
              value={form.freeShippingThreshold}
              onChange={(e) => setForm({ ...form, freeShippingThreshold: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
              Cost transport (RON)
            </label>
            <input
              type="number"
              value={form.shippingCost}
              onChange={(e) => setForm({ ...form, shippingCost: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
              Prag alertă stoc redus
            </label>
            <input
              type="number"
              value={form.lowStockThreshold}
              onChange={(e) => setForm({ ...form, lowStockThreshold: Number(e.target.value) })}
              className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
              min={1}
            />
          </div>
        </div>
      </div>

      {/* Payment integrations — info only */}
      <div className="bg-white rounded-2xl p-6 shadow-card space-y-4">
        <h3 className="font-bold text-[#2D2D2D] border-b border-gray-100 pb-3">Integrări plăți</h3>
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle size={18} className="text-amber-500 shrink-0 mt-0.5" />
          <div className="text-sm text-amber-700">
            <p className="font-semibold mb-1">Cheile API se configurează în server, nu în aplicația client</p>
            <p className="text-amber-600">
              Cheia secretă Netopia (<code className="font-mono text-xs bg-amber-100 px-1 rounded">NETOPIA_API_KEY</code>) și semnătura POS
              nu trebuie niciodată expuse în frontend. Configurează-le ca variabile de mediu în
              Supabase Edge Functions (Settings → Edge Functions → Secrets).
            </p>
            <p className="text-amber-600 mt-2">
              Variabilele necesare:{' '}
              <code className="font-mono text-xs bg-amber-100 px-1 rounded">NETOPIA_API_KEY</code>,{' '}
              <code className="font-mono text-xs bg-amber-100 px-1 rounded">NETOPIA_POS_SIGNATURE</code>,{' '}
              <code className="font-mono text-xs bg-amber-100 px-1 rounded">NETOPIA_SANDBOX</code>,{' '}
              <code className="font-mono text-xs bg-amber-100 px-1 rounded">SITE_URL</code>.
            </p>
          </div>
        </div>
      </div>

      <button
        onClick={handleSave}
        className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all ${
          saved ? 'bg-green-500' : 'bg-[#5BC4C0] hover:bg-[#3EA8A4]'
        }`}
      >
        {saved ? <><Check size={16} /> Salvat cu succes!</> : <><Save size={16} /> Salvează setările</>}
      </button>
    </div>
  )
}
