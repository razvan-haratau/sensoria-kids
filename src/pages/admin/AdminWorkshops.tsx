import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  Plus, Calendar, MapPin, Users, ExternalLink,
  Edit2, Tag, Clock,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Workshop } from '../../types'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Ciornă',
  active: 'Activ',
  full: 'Plin',
  closed: 'Închis',
}
const STATUS_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-600',
  active: 'bg-green-100 text-green-700',
  full: 'bg-orange-100 text-orange-700',
  closed: 'bg-red-100 text-red-600',
}

type WorkshopWithCount = Workshop & { registration_count: number }

export default function AdminWorkshops() {
  const [workshops, setWorkshops] = useState<WorkshopWithCount[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchWorkshops()
  }, [])

  async function fetchWorkshops() {
    setLoading(true)
    const { data } = await supabase
      .from('workshops')
      .select('*')
      .order('date', { ascending: true })

    if (!data) { setLoading(false); return }

    const withCounts = await Promise.all(
      (data as Workshop[]).map(async (w) => {
        const { count } = await supabase
          .from('workshop_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('workshop_id', w.id)
          .eq('status', 'confirmed')
        return { ...w, registration_count: count ?? 0 }
      })
    )

    setWorkshops(withCounts)
    setLoading(false)
  }

  function formatDate(dateStr: string) {
    return new Date(dateStr).toLocaleDateString('ro-RO', {
      day: 'numeric', month: 'long', year: 'numeric',
    })
  }
  function formatTime(dateStr: string) {
    return new Date(dateStr).toLocaleTimeString('ro-RO', {
      hour: '2-digit', minute: '2-digit',
    })
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-[#2D2D2D]">Ateliere</h2>
          <p className="text-sm text-[#6B7280] mt-0.5">{workshops.length} ateliere înregistrate</p>
        </div>
        <Link
          to="/admin/ateliere/nou"
          className="flex items-center gap-2 bg-[#5BC4C0] hover:bg-[#4AB3AF] text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
        >
          <Plus size={16} />
          Atelier nou
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-[#5BC4C0] border-t-transparent rounded-full animate-spin" />
        </div>
      ) : workshops.length === 0 ? (
        <div className="text-center py-16 text-[#6B7280]">
          <p className="mb-2 font-medium">Niciun atelier creat încă</p>
          <p className="text-sm">Apasă "Atelier nou" pentru a începe.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {workshops.map((w) => {
            const spotsLeft = w.max_participants - w.registration_count
            const spotsColor = spotsLeft <= 3 ? 'text-red-500' : spotsLeft <= 7 ? 'text-orange-500' : 'text-[#5BC4C0]'
            return (
              <div key={w.id} className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_COLORS[w.status]}`}>
                        {STATUS_LABELS[w.status]}
                      </span>
                      <span className="text-xs text-[#6B7280]">/{w.slug}</span>
                    </div>
                    <h3 className="font-bold text-[#2D2D2D] text-lg mb-3">{w.title}</h3>
                    <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                      <span className="flex items-center gap-1.5">
                        <Calendar size={13} className="text-[#5BC4C0]" />
                        {formatDate(w.date)}, ora {formatTime(w.date)}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <MapPin size={13} className="text-[#5BC4C0]" />
                        {w.location}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Tag size={13} className="text-[#E86B9E]" />
                        {w.price} lei
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock size={13} className="text-[#6B7280]" />
                        {w.duration_minutes} min · {w.age_min}–{w.age_max} ani
                      </span>
                    </div>
                  </div>

                  {/* Spot counter */}
                  <div className="text-right shrink-0">
                    <div className="flex items-center gap-1.5 justify-end mb-1">
                      <Users size={14} className={spotsColor} />
                      <span className={`text-2xl font-bold ${spotsColor}`}>{w.registration_count}</span>
                      <span className="text-[#6B7280] text-sm">/ {w.max_participants}</span>
                    </div>
                    <p className="text-xs text-[#6B7280]">înscriși</p>
                    {/* Progress bar */}
                    <div className="w-24 h-1.5 bg-gray-100 rounded-full mt-2">
                      <div
                        className={`h-1.5 rounded-full transition-all ${spotsLeft <= 3 ? 'bg-red-400' : spotsLeft <= 7 ? 'bg-orange-400' : 'bg-[#5BC4C0]'}`}
                        style={{ width: `${Math.min(100, (w.registration_count / w.max_participants) * 100)}%` }}
                      />
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 mt-4 pt-4 border-t border-gray-50">
                  <Link
                    to={`/admin/ateliere/${w.id}`}
                    className="flex items-center gap-1.5 text-sm font-medium text-[#5BC4C0] hover:text-[#4AB3AF] transition-colors"
                  >
                    <Edit2 size={13} />
                    Gestionează / Înscrieri
                  </Link>
                  {w.status !== 'draft' && (
                    <a
                      href={`/atelier/${w.slug}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#2D2D2D] transition-colors ml-4"
                    >
                      <ExternalLink size={13} />
                      Pagina publică
                    </a>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
