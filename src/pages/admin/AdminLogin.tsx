import { useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { Eye, EyeOff, Lock, Mail, AlertCircle } from 'lucide-react'

export default function AdminLogin() {
  const { login } = useAuthStore()
  const [email, setEmail] = useState('')
  const [pass, setPass] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    const result = await login(email.trim(), pass)
    setLoading(false)
    if (!result.ok) {
      setError(result.error ?? 'Credențiale incorecte.')
      setPass('')
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <img src="/logo.png" alt="Sensoria Kids" className="h-14 w-auto object-contain mx-auto mb-3" />
          <span className="inline-block text-xs font-semibold text-[#6B7280] bg-gray-100 px-3 py-1 rounded-full">
            Panou de administrare
          </span>
        </div>

        <div className="bg-white rounded-3xl shadow-soft p-8">
          <h1 className="text-xl font-bold text-[#2D2D2D] mb-6">Autentificare</h1>

          {error && (
            <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3 mb-5">
              <AlertCircle size={16} className="shrink-0" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="admin-email" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                Email
              </label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  placeholder="admin@sensoriakids.ro"
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] focus:ring-2 focus:ring-[#5BC4C0]/10 text-sm transition-all"
                />
              </div>
            </div>

            <div>
              <label htmlFor="admin-pass" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                Parolă
              </label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  id="admin-pass"
                  type={showPass ? 'text' : 'password'}
                  value={pass}
                  onChange={(e) => setPass(e.target.value)}
                  required
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="w-full pl-10 pr-10 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] focus:ring-2 focus:ring-[#5BC4C0]/10 text-sm transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  tabIndex={-1}
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#5BC4C0] text-white font-semibold rounded-xl hover:bg-[#3EA8A4] active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Se verifică...
                </>
              ) : (
                'Intră în cont'
              )}
            </button>
          </form>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Acces restricționat — doar personal autorizat
        </p>
      </div>
    </div>
  )
}
