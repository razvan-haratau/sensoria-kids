import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, Suspense } from 'react'
import { getCookieConsent } from './components/CookieBanner'
import { initAnalytics } from './lib/analytics'
import { useAuthStore } from './store/authStore'
import { useProductsStore } from './store/productsStore'
import { useSettingsStore } from './store/settingsStore'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import CookieBanner from './components/CookieBanner'
import ErrorBoundary from './components/ErrorBoundary'
import ScrollToTop from './components/ScrollToTop'
import ScrollToTopButton from './components/ScrollToTopButton'

import HomePage from './pages/HomePage'
import ShopPage from './pages/ShopPage'
import ProductDetailPage from './pages/ProductDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import CheckoutPage from './pages/CheckoutPage'
import NotFoundPage from './pages/NotFoundPage'
import { TermeniPage, ConfidentialitiatePage, ReturPage } from './pages/LegalPages'

import CumFunctioneazaPage from './pages/CumFunctioneazaPage'
import PetreceriCorporatePage from './pages/PetreceriCorporatePage'

import AdminLayout from './pages/admin/AdminLayout'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminProducts from './pages/admin/AdminProducts'
import AdminOrders from './pages/admin/AdminOrders'
import AdminCustomers from './pages/admin/AdminCustomers'
import AdminReports from './pages/admin/AdminReports'
import AdminSettings from './pages/admin/AdminSettings'

function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <CartDrawer />
      <CookieBanner />
      <ScrollToTopButton />
    </>
  )
}

function AppInit() {
  const { initSession } = useAuthStore()
  const { fetchProducts } = useProductsStore()
  const { fetchSettings } = useSettingsStore()

  useEffect(() => {
    // Initialize Supabase auth session
    initSession()
    // Fetch products and settings from Supabase on app start
    fetchProducts()
    fetchSettings()
    // Initialize analytics if consent already given
    if (getCookieConsent() === 'accepted') initAnalytics()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ScrollToTop />
        <AppInit />
        <Suspense fallback={
          <div className="min-h-screen flex items-center justify-center">
            <div className="w-8 h-8 border-4 border-teal border-t-transparent rounded-full animate-spin" />
          </div>
        }>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<PublicLayout><HomePage /></PublicLayout>} />
            <Route path="/magazin" element={<PublicLayout><ShopPage /></PublicLayout>} />
            <Route path="/produs/:id" element={<PublicLayout><ProductDetailPage /></PublicLayout>} />
            <Route path="/despre-noi" element={<PublicLayout><AboutPage /></PublicLayout>} />
            <Route path="/cum-functioneaza" element={<PublicLayout><CumFunctioneazaPage /></PublicLayout>} />
            <Route path="/petreceri-corporate" element={<PublicLayout><PetreceriCorporatePage /></PublicLayout>} />
            <Route path="/contact" element={<PublicLayout><ContactPage /></PublicLayout>} />
            <Route path="/checkout" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
            {/* Netopia return URL — /checkout/confirmare?orderId=xxx&status=success */}
            <Route path="/checkout/confirmare" element={<PublicLayout><CheckoutPage /></PublicLayout>} />
            <Route path="/termeni" element={<PublicLayout><TermeniPage /></PublicLayout>} />
            <Route path="/confidentialitate" element={<PublicLayout><ConfidentialitiatePage /></PublicLayout>} />
            <Route path="/retur" element={<PublicLayout><ReturPage /></PublicLayout>} />
            <Route path="/gdpr" element={<PublicLayout><ConfidentialitiatePage /></PublicLayout>} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminLayout />}>
              <Route index element={<AdminDashboard />} />
              <Route path="produse" element={<AdminProducts />} />
              <Route path="comenzi" element={<AdminOrders />} />
              <Route path="clienti" element={<AdminCustomers />} />
              <Route path="rapoarte" element={<AdminReports />} />
              <Route path="setari" element={<AdminSettings />} />
            </Route>

            {/* 404 */}
            <Route path="*" element={<PublicLayout><NotFoundPage /></PublicLayout>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
    </ErrorBoundary>
  )
}
