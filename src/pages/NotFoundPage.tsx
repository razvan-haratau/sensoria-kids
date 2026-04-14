import { Link } from 'react-router-dom'
import { Home, ShoppingBag, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen pt-20 flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        <div className="w-24 h-24 rounded-full bg-teal/10 flex items-center justify-center mx-auto mb-6">
          <span className="text-5xl font-black text-teal">404</span>
        </div>
        <h1 className="text-3xl font-bold text-brand-text mb-3">Pagina nu există</h1>
        <p className="text-brand-gray mb-8 leading-relaxed">
          Ne pare rău, pagina pe care o cauți nu a fost găsită. Poate a fost mutată sau adresa e greșită.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link to="/" className="btn-primary">
            <Home size={16} />
            Pagina principală
          </Link>
          <Link to="/magazin" className="btn-outline">
            <ShoppingBag size={16} />
            Mergi la magazin
          </Link>
        </div>
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-sm text-brand-gray hover:text-teal transition-colors mt-6 mx-auto"
        >
          <ArrowLeft size={14} />
          Înapoi la pagina anterioară
        </button>
      </div>
    </div>
  )
}
