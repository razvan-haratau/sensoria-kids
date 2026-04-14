import { X, Plus, Minus, ShoppingBag, Trash2 } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useProductsStore } from '../store/productsStore'
import { useSettingsStore } from '../store/settingsStore'
import { Link } from 'react-router-dom'

export default function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, total, itemCount } = useCartStore()
  const { products } = useProductsStore()
  const { settings } = useSettingsStore()
  const { freeShippingThreshold, shippingCost: shippingCostSetting } = settings

  const cartTotal = total()
  const shippingCost = cartTotal >= freeShippingThreshold ? 0 : shippingCostSetting
  const orderTotal = cartTotal + shippingCost
  const totalQuantity = itemCount()

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 backdrop-blur-sm"
          onClick={closeCart}
        />
      )}

      {/* Drawer */}
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-md bg-white z-50 shadow-2xl transform transition-transform duration-300 flex flex-col ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-bold text-lg text-[#2D2D2D]">
            Coș de Cumpărături
            {totalQuantity > 0 && (
              <span className="ml-2 text-sm font-normal text-[#6B7280]">
                ({totalQuantity} {totalQuantity === 1 ? 'produs' : 'produse'})
              </span>
            )}
          </h2>
          <button
            onClick={closeCart}
            className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-4 p-8 text-center">
              <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center">
                <ShoppingBag size={32} className="text-gray-400" />
              </div>
              <p className="text-[#6B7280] font-medium">Coșul tău este gol</p>
              <p className="text-sm text-gray-400">Adaugă produse pentru a continua</p>
              <button onClick={closeCart} className="btn-primary mt-2">
                Continuă cumpărăturile
              </button>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {items.map(({ product, quantity }) => {
                // Always use current product data from store to avoid stale prices
                const currentProduct = products.find((p) => p.id === product.id) || product
                const maxStock = currentProduct.stock_qty

                return (
                  <div key={product.id} className="flex gap-4 p-4">
                    <div className="w-20 h-20 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                      <img
                        src={currentProduct.images[0]}
                        alt={currentProduct.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-sm text-[#2D2D2D] line-clamp-2">{currentProduct.name}</p>
                      <p className="text-[#5BC4C0] font-bold mt-1">{currentProduct.price} RON</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                          <button
                            onClick={() => updateQuantity(product.id, quantity - 1)}
                            className="p-1.5 hover:bg-gray-100 transition-colors"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="px-3 text-sm font-semibold">{quantity}</span>
                          <button
                            onClick={() => updateQuantity(product.id, quantity + 1)}
                            disabled={quantity >= maxStock}
                            className="p-1.5 hover:bg-gray-100 transition-colors disabled:opacity-40"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button
                          onClick={() => removeItem(product.id)}
                          className="p-1.5 text-gray-400 hover:text-red-500 transition-colors rounded-lg hover:bg-red-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                    <p className="font-bold text-sm text-[#2D2D2D] shrink-0">
                      {(currentProduct.price * quantity).toFixed(0)} RON
                    </p>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-100 p-5 space-y-4">
            {/* Free shipping progress */}
            {cartTotal < freeShippingThreshold && (
              <div>
                <p className="text-xs text-[#6B7280] mb-1.5">
                  Mai adaugă <strong className="text-[#5BC4C0]">{freeShippingThreshold - cartTotal} RON</strong> pentru livrare gratuită
                </p>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#5BC4C0] rounded-full transition-all duration-500"
                    style={{ width: `${Math.min((cartTotal / freeShippingThreshold) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}
            {cartTotal >= freeShippingThreshold && (
              <p className="text-sm text-[#5BC4C0] font-medium text-center">
                Livrare gratuită aplicată!
              </p>
            )}

            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-[#6B7280]">
                <span>Subtotal</span>
                <span>{cartTotal} RON</span>
              </div>
              <div className="flex justify-between text-[#6B7280]">
                <span>Transport</span>
                <span>{shippingCost === 0 ? 'Gratuit' : `${shippingCost} RON`}</span>
              </div>
              <div className="flex justify-between font-bold text-[#2D2D2D] text-base border-t border-gray-100 pt-2 mt-2">
                <span>Total</span>
                <span>{orderTotal} RON</span>
              </div>
            </div>

            <Link
              to="/checkout"
              onClick={closeCart}
              className="btn-primary w-full justify-center text-base"
            >
              Finalizează comanda
            </Link>
          </div>
        )}
      </div>
    </>
  )
}
