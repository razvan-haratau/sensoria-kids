// Analytics — GA4 via gtag.js
// Replace G-XXXXXXXXXX with your real Measurement ID from Google Analytics 4

const GA_ID = import.meta.env.VITE_GA_ID || ''

declare global {
  interface Window {
    dataLayer: unknown[]
    gtag: (...args: unknown[]) => void
  }
}

export function initAnalytics() {
  if (!GA_ID) return
  if (typeof window.gtag === 'function') return // already loaded

  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
  document.head.appendChild(script)

  window.dataLayer = window.dataLayer || []
  window.gtag = function (...args: unknown[]) {
    window.dataLayer.push(args)
  }
  window.gtag('js', new Date())
  window.gtag('config', GA_ID, { anonymize_ip: true })
}

export function trackPageView(path: string) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', 'page_view', { page_path: path })
}

export function trackEvent(name: string, params?: Record<string, unknown>) {
  if (typeof window.gtag !== 'function') return
  window.gtag('event', name, params)
}
