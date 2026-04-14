import { ShoppingCart, Eye } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Product } from '../types'
import { useCartStore } from '../store/cartStore'
import { AGE_COLORS, DIFF_COLORS } from '../lib/constants'

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCartStore()
  const isOutOfStock = product.stock_qty === 0 || product.status === 'out_of_stock'
  const isLowStock = product.stock_qty > 0 && product.stock_qty <= 5
  const hasDiscount = product.show_compare_price && product.compare_price && product.compare_price > product.price
  const discount = hasDiscount
    ? Math.round(((product.compare_price! - product.price) / product.compare_price!) * 100)
    : 0

  return (
    <div className="group card overflow-hidden">
      {/* Image */}
      <div className="relative overflow-hidden aspect-square bg-gray-50">
        <Link to={`/produs/${product.id}`}>
          <img
            src={product.images[0]}
            alt={product.name}
            width={400}
            height={400}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        </Link>

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {isOutOfStock && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-gray-800 text-white rounded-full">
              Stoc Epuizat
            </span>
          )}
          {!isOutOfStock && isLowStock && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-orange-500 text-white rounded-full">
              Ultimele {product.stock_qty}
            </span>
          )}
          {hasDiscount && (
            <span className="text-xs font-semibold px-2.5 py-1 bg-[#E86B9E] text-white rounded-full">
              -{discount}%
            </span>
          )}
        </div>

        {/* Quick view on hover */}
        <div className="absolute bottom-3 left-3 right-3 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
          <Link
            to={`/produs/${product.id}`}
            className="flex items-center justify-center gap-2 w-full py-2.5 bg-white/90 backdrop-blur-sm text-[#2D2D2D] text-sm font-semibold rounded-xl hover:bg-white transition-colors"
          >
            <Eye size={15} />
            Vezi detalii
          </Link>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Tags */}
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge-age ${AGE_COLORS[product.age_range] || 'bg-gray-100 text-gray-600'}`}>
            {product.age_range} ani
          </span>
          <span className={`badge-age ${DIFF_COLORS[product.difficulty]}`}>
            {product.difficulty}
          </span>
        </div>

        <Link to={`/produs/${product.id}`}>
          <h3 className="font-semibold text-[#2D2D2D] hover:text-[#5BC4C0] transition-colors line-clamp-2 leading-tight mb-1">
            {product.name}
          </h3>
        </Link>

        <p className="text-xs text-[#6B7280] mb-3">{product.category}</p>

        {/* Price + Button */}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="font-bold text-lg text-[#2D2D2D]">{product.price} RON</span>
            {hasDiscount && (
              <span className="ml-2 text-sm text-gray-400 line-through">
                {product.compare_price} RON
              </span>
            )}
          </div>
          <button
            onClick={() => !isOutOfStock && addItem(product)}
            disabled={isOutOfStock}
            className={`p-2.5 rounded-xl transition-all duration-200 ${
              isOutOfStock
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-[#5BC4C0] text-white hover:bg-[#3EA8A4] active:scale-90'
            }`}
            aria-label="Adaugă în coș"
          >
            <ShoppingCart size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}
