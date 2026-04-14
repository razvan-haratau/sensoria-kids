import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCartStore } from '../store/cartStore'

const navLinks = [
  { label: 'Acasă', href: '/' },
  { label: 'Magazin', href: '/magazin' },
  { label: 'Despre Noi', href: '/despre-noi' },
  { label: 'Contact', href: '/contact' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { toggleCart, itemCount } = useCartStore()
  const count = itemCount()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location])

  const isHome = location.pathname === '/'

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled || !isHome
          ? 'bg-white shadow-soft'
          : 'bg-transparent'
      }`}
    >
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center shrink-0">
          <img src="/logo.png" alt="Sensoria Kids" className="h-12 w-auto object-contain" />
        </Link>

        {/* Desktop Nav */}
        <ul className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                to={link.href}
                className={`text-sm font-medium transition-colors duration-200 hover:text-[#5BC4C0] ${
                  location.pathname === link.href ? 'text-[#5BC4C0]' : 'text-[#2D2D2D]'
                }`}
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <button
            onClick={toggleCart}
            className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors"
            aria-label="Coș de cumpărături"
          >
            <ShoppingCart size={22} className="text-[#2D2D2D]" />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E86B9E] text-white text-xs rounded-full flex items-center justify-center font-semibold">
                {count > 9 ? '9+' : count}
              </span>
            )}
          </button>

          <button
            className="md:hidden p-2 rounded-xl hover:bg-gray-100 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Meniu"
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 shadow-soft">
          <ul className="px-4 py-4 flex flex-col gap-1">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  to={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                    location.pathname === link.href
                      ? 'bg-[#5BC4C0]/10 text-[#5BC4C0]'
                      : 'text-[#2D2D2D] hover:bg-gray-50'
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </header>
  )
}
