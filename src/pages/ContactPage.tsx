import { useState } from 'react'
import { Phone, Mail, MapPin, Instagram, Facebook, Send, CheckCircle } from 'lucide-react'
import { useMeta } from '../hooks/useMeta'
import { useSettingsStore } from '../store/settingsStore'

const categories = ['Comenzi', 'Colaborări', 'Educatori & Instituții', 'Altele']

export default function ContactPage() {
  useMeta('Contact', 'Contactează Sensoria Kids — suntem aici să te ajutăm cu comenzi, colaborări sau orice întrebare despre produsele noastre.')
  const { settings } = useSettingsStore()
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    category: 'Comenzi',
    message: '',
  })
  const [honeypot, setHoneypot] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    // Honeypot: bots fill hidden fields, real users don't
    if (honeypot) return
    setLoading(true)
    // TODO: send to real API (Supabase / email service)
    await new Promise((r) => setTimeout(r, 1200))
    setLoading(false)
    setSent(true)
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-3">Contact</h1>
          <p className="text-[#6B7280] text-lg max-w-lg mx-auto">
            Suntem aici să te ajutăm. Scrie-ne și îți răspundem în cel mai scurt timp.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid lg:grid-cols-3 gap-12">
          {/* Contact info */}
          <div>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-6">Informații de contact</h2>
            <div className="space-y-4 mb-8">
              <a
                href={`tel:${settings.phone.replace(/\s/g, '')}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#5BC4C0]/5 hover:bg-[#5BC4C0]/10 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#5BC4C0] flex items-center justify-center shrink-0">
                  <Phone size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Telefon</p>
                  <p className="font-semibold text-[#2D2D2D] group-hover:text-[#5BC4C0] transition-colors">
                    {settings.phone}
                  </p>
                </div>
              </a>

              <a
                href={`mailto:${settings.email}`}
                className="flex items-center gap-4 p-4 rounded-2xl bg-[#E86B9E]/5 hover:bg-[#E86B9E]/10 transition-colors group"
              >
                <div className="w-11 h-11 rounded-xl bg-[#E86B9E] flex items-center justify-center shrink-0">
                  <Mail size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Email</p>
                  <p className="font-semibold text-[#2D2D2D] group-hover:text-[#E86B9E] transition-colors">
                    {settings.email}
                  </p>
                </div>
              </a>

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-[#B07CC6]/5">
                <div className="w-11 h-11 rounded-xl bg-[#B07CC6] flex items-center justify-center shrink-0">
                  <MapPin size={18} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#6B7280] mb-0.5">Adresă</p>
                  <p className="font-semibold text-[#2D2D2D]">{settings.address}</p>
                </div>
              </div>
            </div>

            {/* Social */}
            <h3 className="text-sm font-semibold text-[#2D2D2D] mb-3 uppercase tracking-wide">Social media</h3>
            <div className="flex gap-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 text-white text-sm font-semibold hover:shadow-hover transition-shadow"
              >
                <Instagram size={16} />
                Instagram
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] text-white text-sm font-semibold hover:shadow-hover transition-shadow"
              >
                <Facebook size={16} />
                Facebook
              </a>
            </div>

            {/* Map placeholder */}
            <div className="mt-8 rounded-2xl overflow-hidden bg-gray-100 h-48 flex items-center justify-center">
              <div className="text-center text-[#6B7280]">
                <MapPin size={32} className="mx-auto mb-2 text-[#5BC4C0]" />
                <p className="text-sm font-medium">Harta Google Maps</p>
                <p className="text-xs">Configurează adresa în setări</p>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2">
            <div className="card p-8">
              {sent ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle size={64} className="text-green-500 mb-4" />
                  <h3 className="text-2xl font-bold text-[#2D2D2D] mb-2">Mesaj trimis!</h3>
                  <p className="text-[#6B7280] max-w-sm">
                    Mulțumim pentru mesajul tău. Îți vom răspunde în cel mai scurt timp, de regulă în 24 de ore.
                  </p>
                  <button
                    onClick={() => { setSent(false); setForm({ name: '', email: '', phone: '', category: 'Comenzi', message: '' }) }}
                    className="btn-primary mt-6"
                  >
                    Trimite un alt mesaj
                  </button>
                </div>
              ) : (
                <>
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-6">Trimite-ne un mesaj</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    {/* Honeypot — hidden from real users, bots fill it */}
                    <div aria-hidden="true" style={{ position: 'absolute', left: '-9999px', opacity: 0, pointerEvents: 'none' }}>
                      <label htmlFor="contact-website">Website</label>
                      <input
                        id="contact-website"
                        type="text"
                        name="website"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        tabIndex={-1}
                        autoComplete="off"
                      />
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-name" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Nume complet <span className="text-[#E86B9E]">*</span>
                        </label>
                        <input
                          id="contact-name"
                          type="text"
                          name="name"
                          value={form.name}
                          onChange={handleChange}
                          required
                          placeholder="Maria Ionescu"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] focus:ring-2 focus:ring-[#5BC4C0]/10 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-email" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Email <span className="text-[#E86B9E]">*</span>
                        </label>
                        <input
                          id="contact-email"
                          type="email"
                          name="email"
                          value={form.email}
                          onChange={handleChange}
                          required
                          placeholder="maria@email.ro"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] focus:ring-2 focus:ring-[#5BC4C0]/10 transition-all text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-5">
                      <div>
                        <label htmlFor="contact-phone" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Telefon
                        </label>
                        <input
                          id="contact-phone"
                          type="tel"
                          name="phone"
                          value={form.phone}
                          onChange={handleChange}
                          placeholder="+40 7xx xxx xxx"
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] focus:ring-2 focus:ring-[#5BC4C0]/10 transition-all text-sm"
                        />
                      </div>
                      <div>
                        <label htmlFor="contact-category" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Subiect <span className="text-[#E86B9E]">*</span>
                        </label>
                        <select
                          id="contact-category"
                          name="category"
                          value={form.category}
                          onChange={handleChange}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] focus:ring-2 focus:ring-[#5BC4C0]/10 transition-all text-sm bg-white"
                        >
                          {categories.map((c) => (
                            <option key={c} value={c}>{c}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="contact-message" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                        Mesaj <span className="text-[#E86B9E]">*</span>
                      </label>
                      <textarea
                        id="contact-message"
                        name="message"
                        value={form.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        placeholder="Scrie mesajul tău aici..."
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] focus:ring-2 focus:ring-[#5BC4C0]/10 transition-all text-sm resize-none"
                      />
                    </div>

                    <p className="text-xs text-[#6B7280]">
                      Prin trimiterea acestui formular, ești de acord cu{' '}
                      <a href="/confidentialitate" className="text-[#5BC4C0] hover:underline">
                        Politica de Confidențialitate
                      </a>
                      .
                    </p>

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-primary w-full justify-center py-4 text-base"
                    >
                      {loading ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          Se trimite...
                        </span>
                      ) : (
                        <>
                          <Send size={18} />
                          Trimite mesajul
                        </>
                      )}
                    </button>
                  </form>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
