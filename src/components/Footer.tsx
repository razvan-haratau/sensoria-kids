import { Link } from 'react-router-dom'
import { Instagram, Facebook, Mail, Phone, MapPin, Heart } from 'lucide-react'
import { useSettingsStore } from '../store/settingsStore'

export default function Footer() {
  const { settings } = useSettingsStore()

  return (
    <footer className="bg-[#2D2D2D] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <img src="/logo.png" alt="Sensoria Kids" className="h-12 w-auto object-contain" />
            </div>
            <p className="text-sm text-gray-400 leading-relaxed mb-4">
              Joacă blândă, liniște, creativitate. Planșe de nisip colorate pentru copii de 2–10 ani.
            </p>
            <div className="flex gap-3">
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#E86B9E] flex items-center justify-center transition-colors"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-white/10 hover:bg-[#5BC4C0] flex items-center justify-center transition-colors"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* Navigare */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Navigare</h3>
            <ul className="space-y-2">
              {[
                { label: 'Acasă', href: '/' },
                { label: 'Magazin', href: '/magazin' },
                { label: 'Despre Noi', href: '/despre-noi' },
                { label: 'Contact', href: '/contact' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-[#5BC4C0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Informații</h3>
            <ul className="space-y-2">
              {[
                { label: 'Termeni și Condiții', href: '/termeni' },
                { label: 'Politica de Confidențialitate', href: '/confidentialitate' },
                { label: 'Politica de Retur', href: '/retur' },
                { label: 'GDPR', href: '/gdpr' },
              ].map((link) => (
                <li key={link.href}>
                  <Link
                    to={link.href}
                    className="text-sm text-gray-400 hover:text-[#5BC4C0] transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4 text-white">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone size={15} className="text-[#5BC4C0] mt-0.5 shrink-0" />
                <a href={`tel:${settings.phone.replace(/\s/g, '')}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {settings.phone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail size={15} className="text-[#5BC4C0] mt-0.5 shrink-0" />
                <a href={`mailto:${settings.email}`} className="text-sm text-gray-400 hover:text-white transition-colors">
                  {settings.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin size={15} className="text-[#5BC4C0] mt-0.5 shrink-0" />
                <span className="text-sm text-gray-400">{settings.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} {settings.storeName}. Toate drepturile rezervate.
          </p>
          <p className="text-sm text-gray-500">
            Realizat cu <Heart size={12} className="inline text-[#E86B9E] fill-[#E86B9E]" /> pentru copiii creativi din România
          </p>
        </div>
      </div>
    </footer>
  )
}
