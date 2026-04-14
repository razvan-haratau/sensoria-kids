import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { ShoppingCart, ArrowLeft, Star, Package, PackageX, Truck, Shield, ChevronLeft, ChevronRight, Plus, Minus, Check } from 'lucide-react'
import { useProductsStore } from '../store/productsStore'
import { useCartStore } from '../store/cartStore'
import ProductCard from '../components/ProductCard'
import { AGE_COLORS } from '../lib/constants'
import { useMeta } from '../hooks/useMeta'

export default function ProductDetailPage() {
  const { id } = useParams()
  const { products } = useProductsStore()
  const product = products.find((p) => p.id === id)
  const { addItem } = useCartStore()
  const [imageIdx, setImageIdx] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [added, setAdded] = useState(false)

  useMeta(
    product?.name ?? 'Produs',
    product ? `${product.description.slice(0, 120)}...` : undefined
  )

  // Reset image index and quantity when navigating to a different product
  useEffect(() => {
    setImageIdx(0)
    setQuantity(1)
  }, [id])

  if (!product) {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4 mx-auto">
          <PackageX size={32} className="text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold text-[#2D2D2D] mb-3">Produsul nu a fost găsit</h2>
        <Link to="/magazin" className="btn-primary">Înapoi la magazin</Link>
      </div>
    )
  }

  const isOutOfStock = product.stock_qty === 0 || product.status === 'out_of_stock'
  const hasDiscount = product.show_compare_price && product.compare_price && product.compare_price > product.price
  const discount = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0

  // #18 — same category first, fill with same age_range, always active
  const related = (() => {
    const active = products.filter((p) => p.id !== product.id && p.status === 'active')
    const sameCategory = active.filter((p) => p.category === product.category)
    if (sameCategory.length >= 4) return sameCategory.slice(0, 4)
    const sameAge = active.filter(
      (p) => p.age_range === product.age_range && !sameCategory.includes(p)
    )
    return [...sameCategory, ...sameAge].slice(0, 4)
  })()

  const handleAddToCart = () => {
    addItem(product, quantity)
    setAdded(true)
    setTimeout(() => setAdded(false), 2000)
  }

  const kitContents: string[] = product.category === 'Nisip Colorat'
    ? [
        'Nisip colorat non-toxic, calitate premium',
        'Culori vibrante certificate CE',
        'Pungi resigillabile pentru depozitare',
        'Sigur pentru copii, testat dermatologic',
      ]
    : product.category === 'Accesorii'
    ? [
        'Pensule de diferite grosimi',
        'Spatule de nivelare',
        'Suflător pentru detalii fine',
        'Instrucțiuni de utilizare',
      ]
    : [
        'Planșe de nisip cu adeziv pre-aplicat',
        'Set nisip colorat non-toxic (6-12 culori)',
        'Instrumente de aplicare',
        'Ghid de activitate ilustrat',
        'Pungă de depozitare',
      ]

  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-[#6B7280] mb-8">
          <Link to="/" className="hover:text-[#5BC4C0] transition-colors">Acasă</Link>
          <span>/</span>
          <Link to="/magazin" className="hover:text-[#5BC4C0] transition-colors">Magazin</Link>
          <span>/</span>
          <span className="text-[#2D2D2D] font-medium line-clamp-1">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          {/* Gallery */}
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-gray-50 mb-4">
              <img
                src={product.images[imageIdx]}
                alt={product.name}
                className="w-full h-full object-cover"
              />
              {product.images.length > 1 && (
                <>
                  <button
                    onClick={() => setImageIdx((prev) => Math.max(0, prev - 1))}
                    disabled={imageIdx === 0}
                    className="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-xl shadow flex items-center justify-center disabled:opacity-40 hover:shadow-md transition-shadow"
                  >
                    <ChevronLeft size={18} />
                  </button>
                  <button
                    onClick={() => setImageIdx((prev) => Math.min(product.images.length - 1, prev + 1))}
                    disabled={imageIdx === product.images.length - 1}
                    className="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 bg-white rounded-xl shadow flex items-center justify-center disabled:opacity-40 hover:shadow-md transition-shadow"
                  >
                    <ChevronRight size={18} />
                  </button>
                </>
              )}
              {hasDiscount && (
                <div className="absolute top-4 left-4 bg-[#E86B9E] text-white text-sm font-bold px-3 py-1.5 rounded-full">
                  -{discount}%
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setImageIdx(i)}
                    className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                      imageIdx === i ? 'border-[#5BC4C0] scale-105' : 'border-gray-100 hover:border-gray-300'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div>
            <div className="flex flex-wrap gap-2 mb-4">
              <span className={`badge-age ${AGE_COLORS[product.age_range] || 'bg-gray-100 text-gray-600'}`}>
                {product.age_range} ani
              </span>
              <span className="badge-age bg-gray-100 text-[#6B7280]">{product.category}</span>
              <span className="badge-age bg-gray-100 text-[#6B7280]">{product.difficulty}</span>
            </div>

            <h1 className="text-3xl font-bold text-[#2D2D2D] mb-3 leading-tight">
              {product.name}
            </h1>

            <div className="flex items-center gap-2 mb-6">
              <div className="flex">
                {[1,2,3,4,5].map((i) => (
                  <Star key={i} size={16} className="text-gray-200 fill-gray-200" />
                ))}
              </div>
              <span className="text-sm text-[#6B7280]">Fii primul care lasă o recenzie</span>
            </div>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-4xl font-bold text-[#2D2D2D]">{product.price} RON</span>
              {hasDiscount && (
                <span className="text-xl text-gray-400 line-through">{product.compare_price} RON</span>
              )}
              {hasDiscount && (
                <span className="text-sm font-semibold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                  Economisești {product.compare_price! - product.price} RON
                </span>
              )}
            </div>

            <p className="text-[#6B7280] leading-relaxed mb-8">{product.description}</p>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <div className={`w-2.5 h-2.5 rounded-full ${isOutOfStock ? 'bg-red-400' : product.stock_qty <= 5 ? 'bg-orange-400' : 'bg-green-400'}`} />
              <span className={`text-sm font-medium ${isOutOfStock ? 'text-red-600' : product.stock_qty <= 5 ? 'text-orange-600' : 'text-green-600'}`}>
                {isOutOfStock ? 'Stoc Epuizat' : product.stock_qty <= 5 ? `Ultimele ${product.stock_qty} bucăți` : `În stoc (${product.stock_qty} disponibile)`}
              </span>
            </div>

            {/* Quantity + Add to cart */}
            {!isOutOfStock && (
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="px-4 py-3 font-bold text-lg min-w-[3rem] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock_qty, quantity + 1))}
                    className="px-4 py-3 hover:bg-gray-100 transition-colors"
                  >
                    <Plus size={16} />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className={`flex-1 flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold text-base transition-all duration-200 ${
                    added
                      ? 'bg-green-500 text-white'
                      : 'bg-[#5BC4C0] text-white hover:bg-[#3EA8A4] active:scale-95'
                  }`}
                >
                  {added ? (
                    <>
                      <Check size={18} />
                      Adăugat în coș!
                    </>
                  ) : (
                    <>
                      <ShoppingCart size={18} />
                      Adaugă în coș
                    </>
                  )}
                </button>
              </div>
            )}

            {isOutOfStock && (
              <div className="bg-gray-100 text-gray-500 text-center py-4 rounded-xl font-medium mb-6">
                Stoc Epuizat — Revino curând
              </div>
            )}

            {/* Features */}
            <div className="grid grid-cols-3 gap-3 border-t border-gray-100 pt-6">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#5BC4C0]/10 flex items-center justify-center">
                  <Truck size={18} className="text-[#5BC4C0]" />
                </div>
                <p className="text-xs text-[#6B7280] font-medium">Livrare rapidă</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#E86B9E]/10 flex items-center justify-center">
                  <Shield size={18} className="text-[#E86B9E]" />
                </div>
                <p className="text-xs text-[#6B7280] font-medium">100% non-toxic</p>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#B07CC6]/10 flex items-center justify-center">
                  <Package size={18} className="text-[#B07CC6]" />
                </div>
                <p className="text-xs text-[#6B7280] font-medium">Retur 30 zile</p>
              </div>
            </div>
          </div>
        </div>

        {/* Kit contents */}
        <div className="bg-gradient-to-br from-[#5BC4C0]/5 to-[#E86B9E]/5 rounded-3xl p-8 mb-20">
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">Ce conține kitul</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {kitContents.map((item, i) => (
              <div key={i} className="flex items-start gap-3 bg-white rounded-xl p-4 shadow-card">
                <div className="w-6 h-6 rounded-full bg-[#5BC4C0] flex items-center justify-center shrink-0">
                  <Check size={12} className="text-white" />
                </div>
                <p className="text-sm text-[#2D2D2D]">{item}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-6">Produse similare</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Back link */}
        <div className="mt-12">
          <Link
            to="/magazin"
            className="flex items-center gap-2 text-[#6B7280] hover:text-[#5BC4C0] transition-colors font-medium"
          >
            <ArrowLeft size={16} />
            Înapoi la magazin
          </Link>
        </div>
      </div>
    </div>
  )
}
