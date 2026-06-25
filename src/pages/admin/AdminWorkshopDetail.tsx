import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import {
  ArrowLeft, Save, Download, Trash2, Check,
  Users, Calendar, MapPin, Tag, Clock, ExternalLink,
  X, AlertCircle, ImagePlus,
} from 'lucide-react'
import { supabase } from '../../lib/supabase'
import type { Workshop, WorkshopRegistration } from '../../types'

const STATUS_LABELS: Record<string, string> = {
  draft: 'Ciornă', active: 'Activ', full: 'Plin', closed: 'Închis',
}

type FormState = Omit<Workshop, 'id' | 'created_at' | 'updated_at'>

const emptyForm: FormState = {
  title: '',
  slug: '',
  description: '',
  date: '',
  duration_minutes: 60,
  location: '',
  price: 0,
  age_min: 4,
  age_max: 10,
  max_participants: 20,
  includes: [],
  status: 'draft',
}

const inputClass =
  'w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-sm text-[#2D2D2D] focus:outline-none focus:ring-2 focus:ring-[#5BC4C0]/30 focus:border-[#5BC4C0] transition-colors'

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">{label}</label>
      {children}
    </div>
  )
}

export default function AdminWorkshopDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const isNew = id === 'nou'

  const [form, setForm] = useState<FormState>(emptyForm)
  const [registrations, setRegistrations] = useState<WorkshopRegistration[]>([])
  const [loading, setLoading] = useState(!isNew)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [includeInput, setIncludeInput] = useState('')
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [imageUploading, setImageUploading] = useState(false)

  useEffect(() => {
    if (!isNew && id) fetchWorkshop()
  }, [id]) // eslint-disable-line react-hooks/exhaustive-deps

  async function fetchWorkshop() {
    setLoading(true)
    const [{ data: workshop }, { data: regs }] = await Promise.all([
      supabase.from('workshops').select('*').eq('id', id).single(),
      supabase.from('workshop_registrations').select('*').eq('workshop_id', id).order('created_at', { ascending: false }),
    ])
    if (workshop) {
      const { id: _id, created_at, updated_at, ...rest } = workshop as Workshop
      setForm({ ...rest, date: rest.date.slice(0, 16) })
    }
    setRegistrations((regs as WorkshopRegistration[]) || [])
    setLoading(false)
  }

  function generateSlug(title: string) {
    return title
      .toLowerCase()
      .normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^a-z0-9\s-]/g, '')
      .trim().replace(/\s+/g, '-')
  }

  async function handleSave() {
    setSaving(true)
    setError('')
    const payload = { ...form, date: new Date(form.date).toISOString(), updated_at: new Date().toISOString() }

    if (isNew) {
      const { data, error: err } = await supabase.from('workshops').insert(payload).select().single()
      if (err) { setError(err.message); setSaving(false); return }
      setSaved(true)
      setTimeout(() => { navigate(`/admin/ateliere/${(data as Workshop).id}`) }, 800)
    } else {
      const { error: err } = await supabase.from('workshops').update(payload).eq('id', id)
      if (err) { setError(err.message); setSaving(false); return }
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    }
    setSaving(false)
  }

  async function cancelRegistration(regId: string) {
    await supabase.from('workshop_registrations').update({ status: 'cancelled' }).eq('id', regId)
    setRegistrations(prev => prev.map(r => r.id === regId ? { ...r, status: 'cancelled' } : r))
    setDeleteConfirm(null)
  }

  function exportCSV() {
    const confirmed = registrations.filter(r => r.status === 'confirmed')
    const headers = ['Nume copil', 'Vârstă', 'Nume părinte', 'Email', 'Telefon', 'Mențiuni', 'Data înscrierii']
    const rows = confirmed.map(r => [
      r.child_name,
      r.child_age,
      r.parent_name,
      r.parent_email,
      r.parent_phone,
      r.notes || '',
      new Date(r.created_at).toLocaleDateString('ro-RO'),
    ])
    const csv = [headers, ...rows].map(row => row.map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `inscrieri-${form.slug || 'atelier'}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  async function handleImageUpload(file: File) {
    setImageUploading(true)
    try {
      const canvas = document.createElement('canvas')
      const img = await createImageBitmap(file)
      const maxW = 1200
      const scale = img.width > maxW ? maxW / img.width : 1
      canvas.width = img.width * scale
      canvas.height = img.height * scale
      canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height)
      const blob = await new Promise<Blob>(res => canvas.toBlob(b => res(b!), 'image/jpeg', 0.85))
      const fileName = `workshops/${crypto.randomUUID()}.jpg`
      const { error: upErr } = await supabase.storage.from('product-images').upload(fileName, blob, { contentType: 'image/jpeg', upsert: true })
      if (upErr) throw upErr
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(fileName)
      setForm(f => ({ ...f, image_url: publicUrl }))
    } catch (e) {
      setError('Eroare la încărcarea imaginii.')
    }
    setImageUploading(false)
  }

  const confirmed = registrations.filter(r => r.status === 'confirmed').length

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-8 h-8 border-4 border-[#5BC4C0] border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to="/admin/ateliere" className="p-2 rounded-xl hover:bg-gray-100 text-[#6B7280] transition-colors">
            <ArrowLeft size={18} />
          </Link>
          <div>
            <h2 className="text-xl font-bold text-[#2D2D2D]">
              {isNew ? 'Atelier nou' : form.title || 'Editează atelierul'}
            </h2>
            {!isNew && (
              <p className="text-sm text-[#6B7280] mt-0.5">{confirmed} / {form.max_participants} locuri rezervate</p>
            )}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {!isNew && form.status !== 'draft' && (
            <a
              href={`/atelier/${form.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-2 text-sm text-[#6B7280] hover:text-[#2D2D2D] border border-gray-200 rounded-xl transition-colors"
            >
              <ExternalLink size={14} />
              Pagina publică
            </a>
          )}
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 bg-[#5BC4C0] hover:bg-[#4AB3AF] disabled:opacity-60 text-white px-4 py-2.5 rounded-xl text-sm font-semibold transition-colors"
          >
            {saving ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : saved ? (
              <><Check size={14} /> Salvat!</>
            ) : (
              <><Save size={14} /> Salvează</>
            )}
          </button>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-50 rounded-xl p-3 mb-4">
          <AlertCircle size={14} />
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Informații generale</h3>

            <Field label="Titlu atelier">
              <input
                type="text"
                value={form.title}
                onChange={e => setForm({ ...form, title: e.target.value, slug: isNew ? generateSlug(e.target.value) : form.slug })}
                placeholder="Ex: Corpul uman explicat"
                className={inputClass}
              />
            </Field>

            <Field label="Slug (URL)">
              <div className="flex items-center gap-2">
                <span className="text-sm text-[#6B7280] shrink-0">/atelier/</span>
                <input
                  type="text"
                  value={form.slug}
                  onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                  placeholder="corpul-uman-explicat"
                  className={inputClass}
                />
              </div>
            </Field>

            <Field label="Descriere scurtă">
              <textarea
                rows={3}
                value={form.description}
                onChange={e => setForm({ ...form, description: e.target.value })}
                placeholder="Descriere afișată pe pagina de înregistrare..."
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Detalii logistice</h3>

            <div className="grid sm:grid-cols-2 gap-4">
              <Field label="Data și ora">
                <input
                  type="datetime-local"
                  value={form.date}
                  onChange={e => setForm({ ...form, date: e.target.value })}
                  className={inputClass}
                />
              </Field>
              <Field label="Durată (minute)">
                <input
                  type="number" min={15}
                  value={form.duration_minutes}
                  onChange={e => setForm({ ...form, duration_minutes: parseInt(e.target.value) || 60 })}
                  className={inputClass}
                />
              </Field>
            </div>

            <Field label="Locație">
              <input
                type="text"
                value={form.location}
                onChange={e => setForm({ ...form, location: e.target.value })}
                placeholder="Ex: Parcul Kisseleff, Scena"
                className={inputClass}
              />
            </Field>

            <div className="grid sm:grid-cols-3 gap-4">
              <Field label="Preț (RON)">
                <input
                  type="number" min={0}
                  value={form.price}
                  onChange={e => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                  className={inputClass}
                />
              </Field>
              <Field label="Vârstă min">
                <input
                  type="number" min={1} max={18}
                  value={form.age_min}
                  onChange={e => setForm({ ...form, age_min: parseInt(e.target.value) || 4 })}
                  className={inputClass}
                />
              </Field>
              <Field label="Vârstă max">
                <input
                  type="number" min={1} max={18}
                  value={form.age_max}
                  onChange={e => setForm({ ...form, age_max: parseInt(e.target.value) || 10 })}
                  className={inputClass}
                />
              </Field>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Partener (opțional)</h3>
            <Field label="Nume partener">
              <input
                type="text"
                value={form.partner_name ?? ''}
                onChange={e => setForm({ ...form, partner_name: e.target.value || null })}
                placeholder="Ex: Clubul Curioșilor"
                className={inputClass}
              />
            </Field>
            <Field label="Descriere partener">
              <textarea
                rows={2}
                value={form.partner_description ?? ''}
                onChange={e => setForm({ ...form, partner_description: e.target.value || null })}
                placeholder="Scurtă descriere despre partener și rolul lui în atelier..."
                className={`${inputClass} resize-none`}
              />
            </Field>
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Ce include înscrierea</h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={includeInput}
                onChange={e => setIncludeInput(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    if (includeInput.trim()) {
                      setForm({ ...form, includes: [...form.includes, includeInput.trim()] })
                      setIncludeInput('')
                    }
                  }
                }}
                placeholder="Ex: Planșă Corpul Uman — Enter pentru a adăuga"
                className={inputClass}
              />
              <button
                type="button"
                onClick={() => {
                  if (includeInput.trim()) {
                    setForm({ ...form, includes: [...form.includes, includeInput.trim()] })
                    setIncludeInput('')
                  }
                }}
                className="px-3 bg-[#5BC4C0]/10 text-[#5BC4C0] rounded-xl hover:bg-[#5BC4C0]/20 transition-colors text-sm font-medium shrink-0"
              >
                Adaugă
              </button>
            </div>
            <ul className="space-y-2">
              {form.includes.map((item, i) => (
                <li key={i} className="flex items-center justify-between gap-2 bg-gray-50 rounded-xl px-3 py-2 text-sm text-[#2D2D2D]">
                  <span>{item}</span>
                  <button
                    onClick={() => setForm({ ...form, includes: form.includes.filter((_, j) => j !== i) })}
                    className="text-[#6B7280] hover:text-red-500 transition-colors"
                  >
                    <X size={13} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Imagine atelier */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-3">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Imagine atelier</h3>
            {form.image_url ? (
              <div className="relative">
                <img src={form.image_url} alt="Imagine atelier" className="w-full rounded-xl object-cover max-h-56" />
                <button
                  onClick={() => setForm(f => ({ ...f, image_url: null }))}
                  className="absolute top-2 right-2 w-7 h-7 bg-white/90 hover:bg-red-50 text-[#6B7280] hover:text-red-500 rounded-full flex items-center justify-center shadow transition-colors"
                >
                  <X size={13} />
                </button>
              </div>
            ) : (
              <label className={`flex flex-col items-center justify-center gap-2 border-2 border-dashed rounded-xl p-6 cursor-pointer transition-colors ${imageUploading ? 'border-[#5BC4C0] bg-[#5BC4C0]/5' : 'border-gray-200 hover:border-[#5BC4C0] hover:bg-[#5BC4C0]/5'}`}>
                {imageUploading ? (
                  <div className="w-6 h-6 border-2 border-[#5BC4C0] border-t-transparent rounded-full animate-spin" />
                ) : (
                  <ImagePlus size={22} className="text-gray-300" />
                )}
                <span className="text-xs text-[#6B7280]">{imageUploading ? 'Se încarcă...' : 'Apasă pentru a adăuga imagine'}</span>
                <input
                  type="file" accept="image/*" className="hidden"
                  disabled={imageUploading}
                  onChange={e => { const f = e.target.files?.[0]; if (f) handleImageUpload(f) }}
                />
              </label>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-5 space-y-4">
            <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Publicare</h3>
            <Field label="Status">
              <select
                value={form.status}
                onChange={e => setForm({ ...form, status: e.target.value as Workshop['status'] })}
                className={inputClass}
              >
                <option value="draft">Ciornă (invizibil)</option>
                <option value="active">Activ (public)</option>
                <option value="full">Plin</option>
                <option value="closed">Închis</option>
              </select>
            </Field>
            <Field label="Locuri maxime">
              <input
                type="number" min={1}
                value={form.max_participants}
                onChange={e => setForm({ ...form, max_participants: parseInt(e.target.value) || 20 })}
                className={inputClass}
              />
            </Field>
          </div>

          {!isNew && (
            <div className="bg-white rounded-2xl border border-gray-100 p-5">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-[#6B7280] uppercase tracking-wide">Statistici</h3>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Confirmate</span>
                  <span className="font-bold text-[#2D2D2D]">{confirmed}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Anulate</span>
                  <span className="font-bold text-[#2D2D2D]">{registrations.filter(r => r.status === 'cancelled').length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#6B7280]">Locuri rămase</span>
                  <span className="font-bold text-green-600">{form.max_participants - confirmed}</span>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full">
                  <div
                    className="h-2 rounded-full bg-[#5BC4C0] transition-all"
                    style={{ width: `${Math.min(100, (confirmed / form.max_participants) * 100)}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Registrations table */}
      {!isNew && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Users size={18} className="text-[#5BC4C0]" />
              <h3 className="text-lg font-bold text-[#2D2D2D]">Înscrieri</h3>
              <span className="text-sm text-[#6B7280]">({confirmed} confirmate)</span>
            </div>
            {confirmed > 0 && (
              <button
                onClick={exportCSV}
                className="flex items-center gap-2 text-sm font-medium text-[#5BC4C0] hover:text-[#4AB3AF] border border-[#5BC4C0]/30 hover:border-[#5BC4C0] px-3 py-2 rounded-xl transition-colors"
              >
                <Download size={14} />
                Export CSV
              </button>
            )}
          </div>

          {registrations.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-2xl border border-gray-100 text-[#6B7280] text-sm">
              Nicio înscriere încă.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-100">
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Copil</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Vârstă</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Părinte</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Contact</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Data</th>
                      <th className="text-left px-4 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Status</th>
                      <th className="px-4 py-3" />
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {registrations.map(r => (
                      <tr key={r.id} className={r.status === 'cancelled' ? 'opacity-40' : 'hover:bg-gray-50/50'}>
                        <td className="px-4 py-3 font-medium text-[#2D2D2D]">{r.child_name}</td>
                        <td className="px-4 py-3 text-[#6B7280]">{r.child_age} ani</td>
                        <td className="px-4 py-3 text-[#6B7280]">{r.parent_name}</td>
                        <td className="px-4 py-3">
                          <div className="text-[#6B7280]">{r.parent_email}</div>
                          <div className="text-[#6B7280] text-xs">{r.parent_phone}</div>
                          {r.notes && <div className="text-xs text-[#6B7280] italic mt-0.5">"{r.notes}"</div>}
                        </td>
                        <td className="px-4 py-3 text-[#6B7280] whitespace-nowrap">
                          {new Date(r.created_at).toLocaleDateString('ro-RO')}
                        </td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${r.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                            {r.status === 'confirmed' ? 'Confirmat' : 'Anulat'}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          {r.status === 'confirmed' && (
                            deleteConfirm === r.id ? (
                              <div className="flex items-center gap-1">
                                <button
                                  onClick={() => cancelRegistration(r.id)}
                                  className="text-xs text-red-500 hover:text-red-700 font-medium"
                                >
                                  Confirmă
                                </button>
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="text-xs text-[#6B7280] hover:text-[#2D2D2D] ml-1"
                                >
                                  Nu
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirm(r.id)}
                                className="text-[#6B7280] hover:text-red-500 transition-colors"
                                title="Anulează înscrierea"
                              >
                                <Trash2 size={14} />
                              </button>
                            )
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
