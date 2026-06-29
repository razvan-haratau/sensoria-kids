import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Calendar, MapPin, Tag, Clock, Users, ChevronRight } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useMeta } from '../hooks/useMeta'
import type { Workshop } from '../types'

type WorkshopWithSpots = Workshop & { spotsLeft: number }

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    weekday: 'long', day: 'numeric', month: 'long',
  })
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('ro-RO', {
    hour: '2-digit', minute: '2-digit',
  })
}

export default function WorkshopsListPage() {
  const [workshops, setWorkshops] = useState<WorkshopWithSpots[]>([])
  const [loading, setLoading] = useState(true)

  useMeta(
    'Ateliere — Sensoria Kids',
    'Ateliere creative pentru copii: planșe cu nisip colorat, lectură și activități educative. Rezervă un loc pentru copilul tău.',
  )

  useEffect(() => {
    fetchWorkshops()
  }, [])

  async function fetchWorkshops() {
    const { data } = await supabase
      .from('workshops')
      .select('*')
      .in('status', ['active', 'full'])
      .order('date', { ascending: true })

    if (!data) { setLoading(false); return }

    const withSpots = await Promise.all(
      (data as Workshop[]).map(async (w) => {
        const { count } = await supabase
          .from('workshop_registrations')
          .select('*', { count: 'exact', head: true })
          .eq('workshop_id', w.id)
          .eq('status', 'confirmed')
        return { ...w, spotsLeft: w.max_participants - (count ?? 0) }
      })
    )

    setWorkshops(withSpots)
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#5BC4C0]/15 to-[#E86B9E]/10 pb-10">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-24">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-[#5BC4C0] px-3 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#5BC4C0] rounded-full animate-pulse" />
            Ateliere Sensoria Kids
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2D2D] mb-4 leading-tight">
            Ateliere creative<br />pentru copii curioși
          </h1>
          <p className="text-lg text-[#6B7280] max-w-xl leading-relaxed">
            Activități educative combinate cu planșe de nisip colorat. Copilul învață, creează și pleacă acasă cu o lucrare de care e mândru.
          </p>
        </div>
      </div>

      {/* List */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-[#5BC4C0] border-t-transparent rounded-full animate-spin" />
          </div>
        ) : workshops.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-xl font-semibold text-[#2D2D2D] mb-2">Niciun atelier programat momentan</p>
            <p className="text-[#6B7280] mb-6">Urmărește-ne pe Instagram pentru a afla despre atelierele viitoare.</p>
            <a
              href="https://www.instagram.com/sensoria.kids.bucharest/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-[#E86B9E] hover:bg-[#d45f8e] text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-colors"
            >
              Urmărește pe Instagram
            </a>
          </div>
        ) : (
          <div className="space-y-6">
            {workshops.map((w) => {
              const isFull = w.spotsLeft <= 0 || w.status === 'full'
              const spotsColor = isFull ? 'text-red-500' : w.spotsLeft <= 3 ? 'text-orange-500' : 'text-[#5BC4C0]'

              return (
                <Link
                  key={w.id}
                  to={`/atelier/${w.slug}`}
                  className="group block bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
                >
                  <div className="flex flex-col sm:flex-row">
                    {/* Imagine */}
                    {w.image_url && (
                      <div className="sm:w-52 shrink-0 bg-gray-50">
                        <img
                          src={w.image_url}
                          alt={w.title}
                          className="w-full h-48 sm:h-full object-contain p-4"
                        />
                      </div>
                    )}

                    {/* Content */}
                    <div className="flex-1 p-6">
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                          {isFull ? (
                            <span className="text-xs font-semibold bg-red-100 text-red-600 px-2.5 py-0.5 rounded-full">Locuri epuizate</span>
                          ) : w.spotsLeft <= 3 ? (
                            <span className="text-xs font-semibold bg-orange-100 text-orange-600 px-2.5 py-0.5 rounded-full">Ultimele {w.spotsLeft} locuri</span>
                          ) : (
                            <span className="text-xs font-semibold bg-[#5BC4C0]/10 text-[#5BC4C0] px-2.5 py-0.5 rounded-full">{w.spotsLeft} locuri disponibile</span>
                          )}
                        </div>
                        <ChevronRight size={18} className="text-gray-300 group-hover:text-[#5BC4C0] transition-colors shrink-0 mt-0.5" />
                      </div>

                      <h2 className="text-xl font-bold text-[#2D2D2D] mb-3 group-hover:text-[#5BC4C0] transition-colors">
                        {w.title}
                      </h2>

                      <p className="text-sm text-[#6B7280] leading-relaxed mb-4 line-clamp-2">
                        {w.description}
                      </p>

                      <div className="flex flex-wrap gap-4 text-sm text-[#6B7280]">
                        <span className="flex items-center gap-1.5">
                          <Calendar size={13} className="text-[#5BC4C0] shrink-0" />
                          <span className="capitalize">{formatDate(w.date)}, {formatTime(w.date)}</span>
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin size={13} className="text-[#5BC4C0] shrink-0" />
                          {w.location}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Tag size={13} className="text-[#E86B9E] shrink-0" />
                          {w.price} lei / copil
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Clock size={13} className="text-[#6B7280] shrink-0" />
                          {w.duration_minutes} min · {w.age_min}–{w.age_max} ani
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Users size={13} className={spotsColor + ' shrink-0'} />
                          <span className={spotsColor}>{isFull ? 'Plin' : `${w.spotsLeft} locuri`}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
