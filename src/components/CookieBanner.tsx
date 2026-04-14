import { useState, useEffect } from 'react'
import { Cookie } from 'lucide-react'
import { initAnalytics } from '../lib/analytics'

export type CookieConsent = 'accepted' | 'declined' | null

export function getCookieConsent(): CookieConsent {
  return localStorage.getItem('cookie-consent') as CookieConsent
}

export default function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const consent = getCookieConsent()
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500)
      return () => clearTimeout(timer)
    }
  }, [])

  const accept = () => {
    localStorage.setItem('cookie-consent', 'accepted')
    setVisible(false)
    initAnalytics()
  }

  const decline = () => {
    localStorage.setItem('cookie-consent', 'declined')
    setVisible(false)
    // When analytics/tracking is added, ensure it stays disabled (do NOT initialize it)
  }

  if (!visible) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:bottom-6 sm:max-w-sm z-50">
      <div className="bg-white rounded-2xl shadow-hover border border-gray-100 p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl bg-[#5BC4C0]/10 flex items-center justify-center shrink-0">
            <Cookie size={18} className="text-[#5BC4C0]" />
          </div>
          <div>
            <p className="font-semibold text-sm text-[#2D2D2D] mb-1">Cookie-uri</p>
            <p className="text-xs text-[#6B7280] leading-relaxed">
              Folosim cookie-uri esențiale pentru funcționarea site-ului. Prin acceptare, ești de acord și cu cookie-urile analitice conform{' '}
              <a href="/confidentialitate" className="text-[#5BC4C0] hover:underline">
                Politicii de Confidențialitate
              </a>
              .
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <button
            onClick={decline}
            className="flex-1 py-2 text-xs font-semibold text-[#6B7280] border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
          >
            Doar esențiale
          </button>
          <button
            onClick={accept}
            className="flex-1 py-2 text-xs font-semibold text-white bg-[#5BC4C0] rounded-xl hover:bg-[#3EA8A4] transition-colors"
          >
            Accept toate
          </button>
        </div>
      </div>
    </div>
  )
}
