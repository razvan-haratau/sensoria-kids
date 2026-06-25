import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Calendar, MapPin, Clock, Users, Tag, Check,
  AlertCircle, ChevronRight, BookOpen,
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useMeta } from '../hooks/useMeta'
import { useSettingsStore } from '../store/settingsStore'
import type { Workshop } from '../types'

type RegistrationForm = {
  child_name: string
  child_age: string
  parent_name: string
  parent_email: string
  parent_phone: string
  notes: string
}

const emptyForm: RegistrationForm = {
  child_name: '',
  child_age: '',
  parent_name: '',
  parent_email: '',
  parent_phone: '',
  notes: '',
}

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('ro-RO', {
    hour: '2-digit', minute: '2-digit',
  })
}

function InputField({
  label, required, error, children,
}: {
  label: string
  required?: boolean
  error?: string
  children: React.ReactNode
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
        {label}
        {required && <span className="text-[#E86B9E] ml-0.5">*</span>}
      </label>
      {children}
      {error && (
        <p className="flex items-center gap-1 mt-1.5 text-xs text-red-500">
          <AlertCircle size={12} className="shrink-0" />
          {error}
        </p>
      )}
    </div>
  )
}

const inputClass =
  'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#2D2D2D] placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#5BC4C0]/30 focus:border-[#5BC4C0] transition-colors'

export default function WorkshopPage() {
  const { slug } = useParams<{ slug: string }>()
  const { settings } = useSettingsStore()
  const [workshop, setWorkshop] = useState<Workshop | null>(null)
  const [spotsLeft, setSpotsLeft] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)
  const [notFound, setNotFound] = useState(false)
  const [form, setForm] = useState<RegistrationForm>(emptyForm)
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState('')
  const [formErrors, setFormErrors] = useState<Partial<Record<keyof RegistrationForm, string>>>({})

  useMeta(
    workshop?.title || 'Atelier',
    workshop
      ? `Înscrie-te la atelierul "${workshop.title}" — ${workshop.location}, ${formatDate(workshop.date)}.`
      : '',
  )

  useEffect(() => {
    if (slug) fetchWorkshop()
  }, [slug]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchWorkshop() {
    setLoading(true)
    const { data, error } = await supabase
      .from('workshops')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) { setNotFound(true); setLoading(false); return }
    setWorkshop(data as Workshop)
    await refreshCount(data.id, data.max_participants)
    setLoading(false)
  }

  async function refreshCount(workshopId: string, maxParticipants: number) {
    const { count } = await supabase
      .from('workshop_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshopId)
      .eq('status', 'confirmed')
    setSpotsLeft(maxParticipants - (count ?? 0))
  }

  function validateForm(): boolean {
    const errors: Partial<Record<keyof RegistrationForm, string>> = {}
    if (!form.child_name.trim()) errors.child_name = 'Completează acest câmp'
    if (!form.child_age) errors.child_age = 'Selectează vârsta'
    if (!form.parent_name.trim()) errors.parent_name = 'Completează acest câmp'
    if (!form.parent_email.trim()) errors.parent_email = 'Completează acest câmp'
    else if (!/\S+@\S+\.\S+/.test(form.parent_email)) errors.parent_email = 'Adresa de email nu este validă'
    if (!form.parent_phone.trim()) errors.parent_phone = 'Completează acest câmp'
    setFormErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!workshop) return
    if (!validateForm()) return
    setSubmitting(true)
    setError('')

    // Re-verifică locurile înainte de submit
    const { count } = await supabase
      .from('workshop_registrations')
      .select('*', { count: 'exact', head: true })
      .eq('workshop_id', workshop.id)
      .eq('status', 'confirmed')

    if ((count ?? 0) >= workshop.max_participants) {
      setError('Ne pare rău, locurile s-au epuizat între timp.')
      setSubmitting(false)
      return
    }

    const { error: insertError } = await supabase
      .from('workshop_registrations')
      .insert({
        workshop_id: workshop.id,
        parent_name: form.parent_name.trim(),
        parent_email: form.parent_email.trim().toLowerCase(),
        parent_phone: form.parent_phone.trim(),
        child_name: form.child_name.trim(),
        child_age: parseInt(form.child_age),
        notes: form.notes.trim() || null,
        status: 'confirmed',
      })

    if (insertError) {
      setError('A apărut o eroare. Încearcă din nou sau contactează-ne la contact@sensoriakids.ro.')
      setSubmitting(false)
      return
    }

    // Email confirmare (non-blocking)
    supabase.functions.invoke('send-workshop-confirmation', {
      body: {
        registration: {
          parent_name: form.parent_name,
          parent_email: form.parent_email,
          child_name: form.child_name,
        },
        workshop: {
          title: workshop.title,
          date: workshop.date,
          location: workshop.location,
          price: workshop.price,
        },
      },
    }).catch(() => {})

    setSubmitted(true)
    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#5BC4C0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  if (notFound || !workshop) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-[#2D2D2D] mb-2">Atelierul nu a fost găsit</h1>
          <p className="text-[#6B7280]">Verifică link-ul sau contactează-ne la contact@sensoriakids.ro.</p>
        </div>
      </div>
    )
  }

  // Success screen
  if (submitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10 flex items-center justify-center px-4 py-12">
        <div className="bg-white rounded-3xl shadow-hover max-w-md w-full p-8 text-center">
          <div className="w-16 h-16 bg-[#5BC4C0]/10 rounded-full flex items-center justify-center mx-auto mb-5">
            <Check size={32} className="text-[#5BC4C0]" />
          </div>
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Loc rezervat!</h2>
          <p className="text-[#6B7280] mb-1">
            Bună, <span className="font-semibold text-[#2D2D2D]">{form.parent_name}</span>!
          </p>
          <p className="text-[#6B7280] mb-5">
            <span className="font-semibold text-[#2D2D2D]">{form.child_name}</span> este înscris la{' '}
            <span className="font-semibold text-[#2D2D2D]">{workshop.title}</span>.
          </p>
          <div className="bg-gray-50 rounded-2xl p-4 text-left space-y-2.5 mb-5">
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Calendar size={14} className="text-[#5BC4C0] shrink-0" />
              <span className="capitalize">{formatDate(workshop.date)}, ora {formatTime(workshop.date)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <MapPin size={14} className="text-[#5BC4C0] shrink-0" />
              {workshop.location}
            </div>
            <div className="flex items-center gap-2 text-sm text-[#6B7280]">
              <Tag size={14} className="text-[#E86B9E] shrink-0" />
              {workshop.price} lei — plată la față locului, la sosire
            </div>
          </div>
          <p className="text-xs text-[#6B7280]">
            Am trimis un email de confirmare la{' '}
            <span className="font-medium">{form.parent_email}</span>.{' '}
            Verifică și folderul Spam dacă nu îl găsești.
          </p>
        </div>
      </div>
    )
  }

  const isFull = workshop.status === 'full' || workshop.status === 'closed' || spotsLeft === 0
  const spotsColor =
    spotsLeft === null ? 'text-[#5BC4C0]'
    : spotsLeft <= 3 ? 'text-red-500'
    : spotsLeft <= 7 ? 'text-orange-500'
    : 'text-[#5BC4C0]'
  const spotsBg =
    spotsLeft === null ? 'border-gray-100'
    : spotsLeft <= 3 ? 'border-red-200 bg-red-50/50'
    : 'border-gray-100'

  return (
    <div className="min-h-screen bg-white">

      {/* ═══ HERO ═══ */}
      <div className="bg-gradient-to-br from-[#5BC4C0]/15 to-[#E86B9E]/10 pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-24">
          <div className="flex items-center gap-3 mb-6">
            <img src="/logo.png" alt="Sensoria Kids" className="h-[70px] w-auto object-contain" />
            <div className="flex gap-2">
              <a href={settings.facebookUrl} target="_blank" rel="noopener noreferrer">
                <img src="https://www.sensoriakids.ro/icon-facebook.png" alt="Facebook" width="30" height="30" className="rounded-lg" />
              </a>
              <a href={settings.instagramUrl} target="_blank" rel="noopener noreferrer">
                <img src="https://www.sensoriakids.ro/icon-instagram.png" alt="Instagram" width="30" height="30" className="rounded-lg" />
              </a>
            </div>
          </div>
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-sm text-[#5BC4C0] px-3 py-1.5 rounded-full text-xs font-semibold mb-4 shadow-sm">
            <span className="w-1.5 h-1.5 bg-[#5BC4C0] rounded-full animate-pulse" />
            Atelier Sensoria Kids
          </div>
          <h1 className="text-4xl sm:text-5xl font-bold text-[#2D2D2D] mb-4 leading-tight">
            {workshop.title}
          </h1>
          <p className="text-lg text-[#6B7280] leading-relaxed mb-7 max-w-2xl">
            {workshop.description}
          </p>

          {/* Info cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 shadow-sm">
              <Calendar size={15} className="text-[#5BC4C0] mb-1.5" />
              <p className="text-[10px] uppercase tracking-wide text-[#6B7280] mb-0.5">Data</p>
              <p className="text-sm font-bold text-[#2D2D2D] capitalize">{new Date(workshop.date).toLocaleDateString('ro-RO', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
              <p className="text-xs text-[#6B7280]">ora {formatTime(workshop.date)}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 shadow-sm">
              <MapPin size={15} className="text-[#5BC4C0] mb-1.5" />
              <p className="text-[10px] uppercase tracking-wide text-[#6B7280] mb-0.5">Locație</p>
              <p className="text-sm font-bold text-[#2D2D2D] leading-tight">{workshop.location}</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 shadow-sm">
              <Tag size={15} className="text-[#E86B9E] mb-1.5" />
              <p className="text-[10px] uppercase tracking-wide text-[#6B7280] mb-0.5">Preț</p>
              <p className="text-sm font-bold text-[#2D2D2D]">{workshop.price} lei</p>
              <p className="text-xs text-[#6B7280]">/ copil</p>
            </div>
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-3.5 shadow-sm">
              <Clock size={15} className="text-[#E86B9E] mb-1.5" />
              <p className="text-[10px] uppercase tracking-wide text-[#6B7280] mb-0.5">Durată / Vârstă</p>
              <p className="text-sm font-bold text-[#2D2D2D]">{workshop.duration_minutes} min</p>
              <p className="text-xs text-[#6B7280]">{workshop.age_min}–{workshop.age_max} ani</p>
            </div>
          </div>

          {/* Spots counter */}
          <div className={`inline-flex items-center gap-2.5 bg-white rounded-2xl px-4 py-2.5 shadow-sm border ${spotsBg}`}>
            <Users size={15} className={spotsColor} />
            {spotsLeft !== null ? (
              <span className="text-sm">
                <span className={`font-bold ${spotsColor}`}>
                  {spotsLeft === 0 ? 'Locuri epuizate' : `${spotsLeft} locuri disponibile`}
                </span>
                {spotsLeft > 0 && (
                  <span className="text-[#6B7280]"> din {workshop.max_participants}</span>
                )}
              </span>
            ) : (
              <span className="text-sm text-[#6B7280]">Se verifică disponibilitatea...</span>
            )}
          </div>
        </div>
      </div>

      {/* ═══ IMAGINE ═══ */}
      {workshop.image_url && (
        <div className="max-w-sm mx-auto px-4 -mt-2 pb-2">
          <img
            src={workshop.image_url}
            alt={workshop.title}
            className="w-full rounded-3xl shadow-lg object-contain"
          />
        </div>
      )}

      {/* ═══ CONTENT ═══ */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
        <div className="grid lg:grid-cols-5 gap-8 lg:gap-12">

          {/* Left: detalii */}
          <div className="lg:col-span-2 space-y-8">

            {/* Ce include */}
            <div>
              <h2 className="text-base font-bold text-[#2D2D2D] mb-3">Ce include atelierul</h2>
              <ul className="space-y-2.5">
                {workshop.includes.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5 text-sm text-[#6B7280]">
                    <div className="w-5 h-5 rounded-full bg-[#5BC4C0]/10 flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-[#5BC4C0]" />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Cum se desfășoară */}
            <div>
              <h2 className="text-base font-bold text-[#2D2D2D] mb-3">Cum se desfășoară</h2>
              <div className="space-y-3">
                {[
                  'Fiecare copil primește kitul complet la sosire',
                  `Un cititor de la ${workshop.partner_name ?? 'un partener Sensoria'} prezintă lecția`,
                  'Copilul creează propria planșă cu nisip colorat, pas cu pas',
                  'Planșa finalizată pleacă acasă — poate fi înrămată',
                ].map((step, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <span className="w-6 h-6 rounded-full bg-[#5BC4C0]/10 text-[#5BC4C0] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                      {i + 1}
                    </span>
                    <p className="text-sm text-[#6B7280] leading-relaxed">{step}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Partener */}
            {workshop.partner_name && (
              <div className="bg-[#E86B9E]/5 border border-[#E86B9E]/10 rounded-2xl p-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-xl bg-[#E86B9E]/10 flex items-center justify-center shrink-0">
                    <BookOpen size={15} className="text-[#E86B9E]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#2D2D2D] mb-0.5">{workshop.partner_name}</p>
                    {workshop.partner_description && (
                      <p className="text-xs text-[#6B7280] leading-relaxed">{workshop.partner_description}</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* Plată */}
            <div className="bg-[#5BC4C0]/5 rounded-2xl p-4">
              <p className="text-sm text-[#6B7280]">
                <span className="font-semibold text-[#2D2D2D]">Plată la față locului.</span>{' '}
                Rezervi locul prin formular, plata de <span className="font-semibold">{workshop.price} lei</span> se face la sosire, înainte de începerea atelierului.
              </p>
            </div>
          </div>

          {/* Right: formular */}
          <div className="lg:col-span-3">
            {isFull ? (
              <div className="bg-gray-50 rounded-3xl p-8 text-center">
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <AlertCircle size={22} className="text-red-500" />
                </div>
                <h3 className="font-bold text-[#2D2D2D] mb-2">Locuri epuizate</h3>
                <p className="text-sm text-[#6B7280]">
                  Toate cele {workshop.max_participants} locuri au fost rezervate. Urmărește-ne pe Instagram pentru a afla despre atelierele viitoare.
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-3xl border border-gray-100 shadow-soft p-6 sm:p-8">
                <h2 className="text-xl font-bold text-[#2D2D2D] mb-1">Rezervă un loc</h2>
                <p className="text-sm text-[#6B7280] mb-6">
                  Completează formularul — înscrierea se confirmă instant.
                </p>

                <form onSubmit={handleSubmit} noValidate className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4 items-end">
                    <InputField label="Nume copil" required error={formErrors.child_name}>
                      <input
                        type="text"
                        value={form.child_name}
                        onChange={e => { setForm({ ...form, child_name: e.target.value }); setFormErrors(fe => ({ ...fe, child_name: undefined })) }}
                        placeholder="Ex: Maria Ionescu"
                        className={`${inputClass} ${formErrors.child_name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                      />
                    </InputField>
                    <InputField label="Vârsta copilului" required error={formErrors.child_age}>
                      <select
                        value={form.child_age}
                        onChange={e => { setForm({ ...form, child_age: e.target.value }); setFormErrors(fe => ({ ...fe, child_age: undefined })) }}
                        className={`${inputClass} ${formErrors.child_age ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                      >
                        <option value="">Selectează vârsta</option>
                        {Array.from({ length: 7 }, (_, i) => i + 4).map(age => (
                          <option key={age} value={age}>{age} ani</option>
                        ))}
                      </select>
                    </InputField>
                  </div>

                  <InputField label="Prenume și nume (părinte / însoțitor)" required error={formErrors.parent_name}>
                    <input
                      type="text"
                      value={form.parent_name}
                      onChange={e => { setForm({ ...form, parent_name: e.target.value }); setFormErrors(fe => ({ ...fe, parent_name: undefined })) }}
                      placeholder="Ex: Ana Ionescu"
                      className={`${inputClass} ${formErrors.parent_name ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                    />
                  </InputField>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <InputField label="Email" required error={formErrors.parent_email}>
                      <input
                        type="email"
                        value={form.parent_email}
                        onChange={e => { setForm({ ...form, parent_email: e.target.value }); setFormErrors(fe => ({ ...fe, parent_email: undefined })) }}
                        placeholder="ana@email.com"
                        className={`${inputClass} ${formErrors.parent_email ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                      />
                    </InputField>
                    <InputField label="Telefon" required error={formErrors.parent_phone}>
                      <input
                        type="tel"
                        value={form.parent_phone}
                        onChange={e => { setForm({ ...form, parent_phone: e.target.value }); setFormErrors(fe => ({ ...fe, parent_phone: undefined })) }}
                        placeholder="07xx xxx xxx"
                        className={`${inputClass} ${formErrors.parent_phone ? 'border-red-400 focus:border-red-400 focus:ring-red-200' : ''}`}
                      />
                    </InputField>
                  </div>

                  <InputField label="Mențiuni speciale (opțional)">
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={e => setForm({ ...form, notes: e.target.value })}
                      placeholder="Alergii, nevoi speciale, întrebări..."
                      className={`${inputClass} resize-none`}
                    />
                  </InputField>

                  {error && (
                    <div className="flex items-start gap-2 text-red-500 text-sm bg-red-50 rounded-xl p-3">
                      <AlertCircle size={14} className="shrink-0 mt-0.5" />
                      {error}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-[#5BC4C0] hover:bg-[#4AB3AF] disabled:opacity-60 text-white font-semibold py-3.5 rounded-xl transition-colors flex items-center justify-center gap-2 text-sm"
                  >
                    {submitting ? (
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        Rezervă locul
                        <ChevronRight size={15} />
                      </>
                    )}
                  </button>

                  <p className="text-xs text-[#6B7280] text-center leading-relaxed">
                    Prin trimiterea formularului, confirmi că ai citit{' '}
                    <a href="/termeni" target="_blank" className="underline hover:text-[#5BC4C0]">
                      Termenii și Condițiile
                    </a>{' '}
                    și{' '}
                    <a href="/confidentialitate" target="_blank" className="underline hover:text-[#5BC4C0]">
                      Politica de Confidențialitate
                    </a>.
                  </p>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
