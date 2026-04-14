import { useState, useEffect } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft, CreditCard, Truck, CheckCircle, Package } from 'lucide-react'
import { useCartStore } from '../store/cartStore'
import { useSettingsStore } from '../store/settingsStore'
import { useOrdersStore } from '../store/ordersStore'
import { useProductsStore } from '../store/productsStore'
import { supabase } from '../lib/supabase'
import { Order } from '../types'
import { isValidRomanianPhone } from '../lib/constants'

type Step = 'shipping' | 'payment' | 'confirmation'

const counties = [
  'Alba','Arad','Argeș','Bacău','Bihor','Bistrița-Năsăud','Botoșani','Brăila','Brașov',
  'București','Buzău','Călărași','Caraș-Severin','Cluj','Constanța','Covasna','Dâmbovița',
  'Dolj','Galați','Giurgiu','Gorj','Harghita','Hunedoara','Ialomița','Iași','Ilfov',
  'Maramureș','Mehedinți','Mureș','Neamț','Olt','Prahova','Sălaj','Satu Mare','Sibiu',
  'Suceava','Teleorman','Timiș','Tulcea','Vâlcea','Vaslui','Vrancea',
]

export default function CheckoutPage() {
  const { items, total, clearCart } = useCartStore()
  const { settings } = useSettingsStore()
  const { freeShippingThreshold, shippingCost: shippingCostSetting } = settings
  const { addOrder } = useOrdersStore()
  const { decrementStock } = useProductsStore()
  const [searchParams] = useSearchParams()

  const cartTotal = total()
  const shippingCost = cartTotal >= freeShippingThreshold ? 0 : shippingCostSetting
  const orderTotal = cartTotal + shippingCost

  const [step, setStep] = useState<Step>('shipping')
  const [shipping, setShipping] = useState({
    name: '', email: '', phone: '',
    street: '', city: '', county: '', postal_code: '',
  })
  const [confirmedOrderId, setConfirmedOrderId] = useState('')
  const [confirmedEmail, setConfirmedEmail] = useState('')
  const [phoneError, setPhoneError] = useState('')
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'ramburs'>('card')
  const [processing, setProcessing] = useState(false)
  const [paymentError, setPaymentError] = useState('')

  // Handle return from Netopia redirect (e.g. /checkout/confirmare?orderId=xxx)
  useEffect(() => {
    const orderId = searchParams.get('orderId')
    const status = searchParams.get('status')
    if (orderId && status === 'success') {
      setConfirmedOrderId(orderId)
      setStep('confirmation')
    }
  }, [searchParams])

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (shipping.phone && !isValidRomanianPhone(shipping.phone)) {
      setPhoneError('Număr de telefon invalid. Exemplu: 07xx xxx xxx')
      return
    }
    setPhoneError('')
    setStep('payment')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handlePayment = async (e: React.FormEvent) => {
    e.preventDefault()
    setProcessing(true)
    setPaymentError('')

    const orderId = `ORD-${crypto.randomUUID().split('-')[0].toUpperCase()}`

    const orderData: Order = {
      id: orderId,
      customer_email: shipping.email,
      customer_name: shipping.name,
      customer_phone: shipping.phone,
      shipping_address: {
        name: shipping.name,
        street: shipping.street,
        city: shipping.city,
        county: shipping.county,
        postal_code: shipping.postal_code,
        country: 'România',
      },
      items: items.map((item, idx) => ({
        id: `${orderId}-${idx}`,
        order_id: orderId,
        product_id: item.product.id,
        product_name: item.product.name,
        quantity: item.quantity,
        unit_price: item.product.price,
      })),
      total: orderTotal,
      shipping_cost: shippingCost,
      payment_status: 'pending',
      order_status: 'Nouă',
      payment_method: paymentMethod,
      created_at: new Date().toISOString(),
    }

    try {
      if (paymentMethod === 'ramburs') {
        // Save order directly — no payment gateway needed
        await addOrder(orderData)
        items.forEach(({ product, quantity }) => decrementStock(product.id, quantity))
        setConfirmedOrderId(orderId)
        setConfirmedEmail(shipping.email)
        clearCart()
        setStep('confirmation')
        window.scrollTo({ top: 0, behavior: 'smooth' })
      } else {
        // Card payment via Netopia Edge Function
        const { data, error } = await supabase.functions.invoke('netopia-start', {
          body: { order: orderData },
        })

        if (error || !data?.paymentURL) {
          throw new Error(data?.error ?? error?.message ?? 'Eroare la inițierea plății.')
        }

        // Decrement stock optimistically before redirect
        items.forEach(({ product, quantity }) => decrementStock(product.id, quantity))
        clearCart()

        // Redirect to Netopia hosted payment page
        window.location.href = data.paymentURL
      }
    } catch (err) {
      setPaymentError(err instanceof Error ? err.message : 'A apărut o eroare. Încearcă din nou.')
      setProcessing(false)
    }
  }

  const stepConfig = [
    { id: 'shipping', label: 'Livrare', icon: Truck },
    { id: 'payment', label: 'Plată', icon: CreditCard },
    { id: 'confirmation', label: 'Confirmare', icon: CheckCircle },
  ]

  if (items.length === 0 && step !== 'confirmation') {
    return (
      <div className="min-h-screen pt-20 flex flex-col items-center justify-center gap-4">
        <Package size={48} className="text-gray-300" />
        <p className="text-[#6B7280] font-medium">Coșul tău este gol</p>
        <Link to="/magazin" className="btn-primary">Mergi la magazin</Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-20 bg-gray-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Stepper */}
        <div className="flex items-center justify-center gap-0 mb-10">
          {stepConfig.map((s, i) => {
            const isActive = s.id === step
            const isDone = stepConfig.findIndex((x) => x.id === step) > i
            return (
              <div key={s.id} className="flex items-center">
                <div className="flex flex-col items-center">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    isDone ? 'bg-green-500 text-white' : isActive ? 'bg-[#5BC4C0] text-white' : 'bg-gray-200 text-gray-400'
                  }`}>
                    {isDone ? <CheckCircle size={18} /> : <s.icon size={18} />}
                  </div>
                  <span className={`text-xs mt-1.5 font-medium ${isActive ? 'text-[#5BC4C0]' : isDone ? 'text-green-600' : 'text-gray-400'}`}>
                    {s.label}
                  </span>
                </div>
                {i < stepConfig.length - 1 && (
                  <div className={`w-16 sm:w-24 h-0.5 mx-2 mb-4 transition-colors ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
                )}
              </div>
            )
          })}
        </div>

        {/* Confirmation */}
        {step === 'confirmation' && (
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-8 shadow-card text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-green-500" />
            </div>
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Comandă plasată cu succes!</h2>
            <p className="text-[#6B7280] mb-4">
              Comanda <strong className="text-[#5BC4C0]">{confirmedOrderId}</strong> a fost înregistrată.
            </p>
            {confirmedEmail && (
              <p className="text-sm text-[#6B7280] mb-8">
                Vei primi un email de confirmare la <strong>{confirmedEmail}</strong> cu detaliile comenzii.
              </p>
            )}
            <Link to="/" className="btn-primary w-full justify-center">
              Înapoi la pagina principală
            </Link>
          </div>
        )}

        {/* Steps */}
        {step !== 'confirmation' && (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              {/* Shipping step */}
              {step === 'shipping' && (
                <div className="bg-white rounded-3xl p-6 shadow-card">
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-6 flex items-center gap-2">
                    <Truck size={20} className="text-[#5BC4C0]" />
                    Informații livrare
                  </h2>
                  <form onSubmit={handleShippingSubmit} className="space-y-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="ship-name" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Nume complet <span className="text-[#E86B9E]">*</span>
                        </label>
                        <input
                          id="ship-name" type="text" required
                          value={shipping.name}
                          onChange={(e) => setShipping({ ...shipping, name: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                          placeholder="Maria Ionescu"
                        />
                      </div>
                      <div>
                        <label htmlFor="ship-email" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Email <span className="text-[#E86B9E]">*</span>
                        </label>
                        <input
                          id="ship-email" type="email" required
                          value={shipping.email}
                          onChange={(e) => setShipping({ ...shipping, email: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                          placeholder="maria@email.ro"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="ship-phone" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                        Telefon <span className="text-[#E86B9E]">*</span>
                      </label>
                      <input
                        id="ship-phone" type="tel" required
                        value={shipping.phone}
                        onChange={(e) => {
                          setShipping({ ...shipping, phone: e.target.value })
                          if (phoneError) setPhoneError('')
                        }}
                        className={`w-full px-4 py-3 rounded-xl border outline-none focus:border-[#5BC4C0] text-sm ${phoneError ? 'border-red-400 bg-red-50' : 'border-gray-200'}`}
                        placeholder="07xx xxx xxx"
                      />
                      {phoneError && <p className="text-xs text-red-500 mt-1">{phoneError}</p>}
                    </div>

                    <div>
                      <label htmlFor="ship-street" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                        Adresă <span className="text-[#E86B9E]">*</span>
                      </label>
                      <input
                        id="ship-street" type="text" required
                        value={shipping.street}
                        onChange={(e) => setShipping({ ...shipping, street: e.target.value })}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                        placeholder="Str. Florilor 12, Ap. 4"
                      />
                    </div>

                    <div className="grid sm:grid-cols-3 gap-4">
                      <div>
                        <label htmlFor="ship-city" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Oraș <span className="text-[#E86B9E]">*</span>
                        </label>
                        <input
                          id="ship-city" type="text" required
                          value={shipping.city}
                          onChange={(e) => setShipping({ ...shipping, city: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                          placeholder="Cluj-Napoca"
                        />
                      </div>
                      <div>
                        <label htmlFor="ship-county" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Județ <span className="text-[#E86B9E]">*</span>
                        </label>
                        <select
                          id="ship-county" required
                          value={shipping.county}
                          onChange={(e) => setShipping({ ...shipping, county: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm bg-white"
                        >
                          <option value="">Alege</option>
                          {counties.map((c) => <option key={c} value={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label htmlFor="ship-postal" className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                          Cod Poștal <span className="text-[#E86B9E]">*</span>
                        </label>
                        <input
                          id="ship-postal" type="text" required
                          value={shipping.postal_code}
                          onChange={(e) => setShipping({ ...shipping, postal_code: e.target.value })}
                          className="w-full px-4 py-3 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                          placeholder="400001"
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      <Link to="/magazin" className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#5BC4C0] transition-colors">
                        <ArrowLeft size={14} />
                        Înapoi la magazin
                      </Link>
                      <button type="submit" className="btn-primary">
                        Continuă la plată
                        <CreditCard size={16} />
                      </button>
                    </div>
                  </form>
                </div>
              )}

              {/* Payment step */}
              {step === 'payment' && (
                <div className="bg-white rounded-3xl p-6 shadow-card">
                  <h2 className="text-xl font-bold text-[#2D2D2D] mb-6 flex items-center gap-2">
                    <CreditCard size={20} className="text-[#5BC4C0]" />
                    Metodă de plată
                  </h2>

                  <form onSubmit={handlePayment} className="space-y-4">
                    <div className="space-y-3 mb-6">
                      {/* Card via Netopia */}
                      <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'card' ? 'border-[#5BC4C0] bg-[#5BC4C0]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input
                          type="radio" name="payment" value="card"
                          checked={paymentMethod === 'card'}
                          onChange={() => setPaymentMethod('card')}
                          className="accent-[#5BC4C0]"
                        />
                        <CreditCard size={20} className="text-[#5BC4C0]" />
                        <div>
                          <p className="font-semibold text-[#2D2D2D] text-sm">Plată cu cardul</p>
                          <p className="text-xs text-[#6B7280]">Visa, Mastercard — securizat prin Netopia Payments</p>
                        </div>
                      </label>

                      {/* Ramburs */}
                      <label className={`flex items-center gap-4 p-4 rounded-2xl border-2 cursor-pointer transition-all ${paymentMethod === 'ramburs' ? 'border-[#5BC4C0] bg-[#5BC4C0]/5' : 'border-gray-100 hover:border-gray-200'}`}>
                        <input
                          type="radio" name="payment" value="ramburs"
                          checked={paymentMethod === 'ramburs'}
                          onChange={() => setPaymentMethod('ramburs')}
                          className="accent-[#5BC4C0]"
                        />
                        <Package size={20} className="text-[#6B7280]" />
                        <div>
                          <p className="font-semibold text-[#2D2D2D] text-sm">Ramburs la livrare</p>
                          <p className="text-xs text-[#6B7280]">Plătești la primirea coletului</p>
                        </div>
                      </label>
                    </div>

                    {paymentMethod === 'card' && (
                      <div className="bg-[#5BC4C0]/5 border border-[#5BC4C0]/20 rounded-2xl p-4 text-sm text-[#2D2D2D]">
                        Vei fi redirecționat către pagina securizată Netopia Payments pentru a introduce datele cardului.
                      </div>
                    )}

                    {paymentError && (
                      <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                        {paymentError}
                      </div>
                    )}

                    <div className="flex items-center justify-between pt-2">
                      <button
                        type="button"
                        onClick={() => setStep('shipping')}
                        className="flex items-center gap-1.5 text-sm text-[#6B7280] hover:text-[#5BC4C0] transition-colors"
                      >
                        <ArrowLeft size={14} />
                        Înapoi
                      </button>
                      <button type="submit" disabled={processing} className="btn-primary">
                        {processing ? (
                          <span className="flex items-center gap-2">
                            <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                            </svg>
                            Se procesează...
                          </span>
                        ) : (
                          <>Plasează comanda — {orderTotal} RON</>
                        )}
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </div>

            {/* Order summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl p-6 shadow-card sticky top-24">
                <h3 className="font-bold text-[#2D2D2D] mb-4">Sumar comandă</h3>
                <div className="space-y-3 mb-4">
                  {items.map(({ product, quantity }) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0">
                        <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-[#2D2D2D] line-clamp-1">{product.name}</p>
                        <p className="text-xs text-[#6B7280]">x{quantity}</p>
                      </div>
                      <p className="text-sm font-bold shrink-0">{product.price * quantity} RON</p>
                    </div>
                  ))}
                </div>
                <div className="border-t border-gray-100 pt-4 space-y-2 text-sm">
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Subtotal</span>
                    <span>{cartTotal} RON</span>
                  </div>
                  <div className="flex justify-between text-[#6B7280]">
                    <span>Transport</span>
                    <span className={shippingCost === 0 ? 'text-green-600 font-medium' : ''}>
                      {shippingCost === 0 ? 'Gratuit' : `${shippingCost} RON`}
                    </span>
                  </div>
                  <div className="flex justify-between font-bold text-[#2D2D2D] text-base border-t border-gray-100 pt-2 mt-2">
                    <span>Total</span>
                    <span>{orderTotal} RON</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
