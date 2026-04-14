import { useState } from 'react'
import { Link, useLocation, Outlet } from 'react-router-dom'
import {
  LayoutDashboard, Package, ShoppingBag, Users, BarChart3,
  Settings, LogOut, ExternalLink, Menu, ChevronRight,
} from 'lucide-react'
import { useAuthStore } from '../../store/authStore'
import AdminLogin from './AdminLogin'

const navItems = [
  { label: 'Dashboard', href: '/admin', icon: LayoutDashboard },
  { label: 'Produse', href: '/admin/produse', icon: Package },
  { label: 'Comenzi', href: '/admin/comenzi', icon: ShoppingBag },
  { label: 'Clienți', href: '/admin/clienti', icon: Users },
  { label: 'Rapoarte', href: '/admin/rapoarte', icon: BarChart3 },
  { label: 'Setări', href: '/admin/setari', icon: Settings },
]

export default function AdminLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const location = useLocation()
  const { isAuthenticated, logout } = useAuthStore()

  if (!isAuthenticated) {
    return <AdminLogin />
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar overlay (mobile) */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-soft z-40 transform transition-transform duration-300 lg:translate-x-0 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:block`}
      >
        <div className="p-5 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="Sensoria Kids" className="h-10 w-auto object-contain" />
            <span className="text-xs font-semibold text-[#6B7280] bg-gray-100 px-2 py-0.5 rounded-full">Admin</span>
          </div>
        </div>

        <nav className="p-4 flex flex-col gap-1 flex-1">
          {navItems.map((item) => {
            const isActive = location.pathname === item.href ||
              (item.href !== '/admin' && location.pathname.startsWith(item.href))
            return (
              <Link
                key={item.href}
                to={item.href}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-[#5BC4C0]/10 text-[#5BC4C0]'
                    : 'text-[#6B7280] hover:bg-gray-100 hover:text-[#2D2D2D]'
                }`}
              >
                <item.icon size={18} />
                {item.label}
                {isActive && <ChevronRight size={14} className="ml-auto" />}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-gray-100 space-y-1">
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-[#6B7280] hover:bg-gray-100 transition-colors"
          >
            <ExternalLink size={18} />
            Vizualizează site-ul
          </Link>
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Deconectează-te
          </button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-100 h-14 flex items-center px-4 sm:px-6 gap-4 sticky top-0 z-20">
          <button
            onClick={() => setSidebarOpen(true)}
            className="lg:hidden p-2 rounded-xl hover:bg-gray-100"
          >
            <Menu size={20} />
          </button>
          <h1 className="font-semibold text-[#2D2D2D]">
            {navItems.find((n) => location.pathname === n.href || (n.href !== '/admin' && location.pathname.startsWith(n.href)))?.label || 'Admin'}
          </h1>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
