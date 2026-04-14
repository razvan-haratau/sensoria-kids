import { Component, ErrorInfo, ReactNode } from 'react'
import { RefreshCw, Home } from 'lucide-react'

interface Props {
  children: ReactNode
  fallback?: ReactNode
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    // Log error to monitoring service (Sentry etc.) when configured
    console.error('[ErrorBoundary]', error, info)
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="text-center max-w-sm">
            <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
              <RefreshCw size={28} className="text-red-400" />
            </div>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-2">Ceva nu a mers bine</h2>
            <p className="text-[#6B7280] text-sm mb-6">
              A apărut o eroare neașteptată. Încearcă să reîncărci pagina.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => window.location.reload()}
                className="flex items-center gap-2 px-4 py-2.5 bg-[#5BC4C0] text-white text-sm font-semibold rounded-xl hover:bg-[#3EA8A4] transition-colors"
              >
                <RefreshCw size={14} />
                Reîncarcă
              </button>
              <a
                href="/"
                className="flex items-center gap-2 px-4 py-2.5 border border-gray-200 text-[#6B7280] text-sm font-semibold rounded-xl hover:bg-gray-50 transition-colors"
              >
                <Home size={14} />
                Acasă
              </a>
            </div>
          </div>
        </div>
      )
    }

    return this.props.children
  }
}
