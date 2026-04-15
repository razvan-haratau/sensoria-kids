import { useState, useRef } from 'react'
import { Plus, Search, Edit2, Trash2, AlertTriangle, X, Check, Upload, ImagePlus, Star, Link as LinkIcon } from 'lucide-react'
import { Product } from '../../types'
import { useProductsStore } from '../../store/productsStore'
import { supabase } from '../../lib/supabase'

const STATUS_COLORS: Record<string, string> = {
  active: 'bg-green-100 text-green-700',
  draft: 'bg-gray-100 text-gray-600',
  out_of_stock: 'bg-red-100 text-red-600',
}
const STATUS_LABELS: Record<string, string> = {
  active: 'Activ',
  draft: 'Ciornă',
  out_of_stock: 'Stoc Epuizat',
}

const emptyProduct: Omit<Product, 'id' | 'created_at' | 'updated_at'> = {
  name: '',
  description: '',
  price: 0,
  compare_price: undefined,
  show_compare_price: false,
  sku: '',
  stock_qty: 0,
  category: 'Planșe Simple',
  age_range: '2-4',
  difficulty: 'Ușor',
  images: [],
  status: 'active',
  weight: 0,
}

// ─── Image Manager Component ─────────────────────────────────────────────────
function ImageManager({
  images,
  onChange,
}: {
  images: string[]
  onChange: (imgs: string[]) => void
}) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [urlInput, setUrlInput] = useState('')
  const [urlMode, setUrlMode] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const [urlError, setUrlError] = useState('')

  const MAX_FILE_SIZE_MB = 10
  const [uploading, setUploading] = useState(false)

  const addFromFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return
    setUploading(true)
    const newUrls: string[] = []
    for (const file of Array.from(files)) {
      if (!file.type.startsWith('image/')) continue
      if (file.size > MAX_FILE_SIZE_MB * 1024 * 1024) {
        alert(`Imaginea "${file.name}" depășește limita de ${MAX_FILE_SIZE_MB}MB.`)
        continue
      }
      const ext = file.name.split('.').pop() ?? 'jpg'
      const path = `products/${crypto.randomUUID()}.${ext}`
      const { error } = await supabase.storage.from('product-images').upload(path, file)
      if (error) {
        alert(`Eroare upload "${file.name}": ${error.message}`)
        continue
      }
      const { data: { publicUrl } } = supabase.storage.from('product-images').getPublicUrl(path)
      newUrls.push(publicUrl)
    }
    if (newUrls.length > 0) onChange([...images, ...newUrls])
    setUploading(false)
  }

  const addFromUrl = () => {
    const url = urlInput.trim()
    if (!url) return
    if (!url.startsWith('http://') && !url.startsWith('https://') && !url.startsWith('data:')) {
      setUrlError('URL-ul trebuie să înceapă cu http:// sau https://')
      return
    }
    setUrlError('')
    onChange([...images, url])
    setUrlInput('')
    setUrlMode(false)
  }

  const removeImage = (idx: number) => {
    onChange(images.filter((_, i) => i !== idx))
  }

  const setPrimary = (idx: number) => {
    const reordered = [...images]
    const [selected] = reordered.splice(idx, 1)
    reordered.unshift(selected)
    onChange(reordered)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    addFromFiles(e.dataTransfer.files)
  }

  return (
    <div className="sm:col-span-2">
      <div className="flex items-center justify-between mb-2">
        <label className="text-sm font-medium text-[#2D2D2D]">
          Imagini produs
          <span className="ml-1 text-xs text-[#6B7280] font-normal">(prima imagine = principală)</span>
        </label>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={() => { setUrlMode(!urlMode); setUrlError('') }}
            className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium transition-colors ${
              urlMode ? 'bg-[#5BC4C0] text-white' : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
            }`}
          >
            <LinkIcon size={12} />
            URL
          </button>
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg font-medium bg-gray-100 text-[#6B7280] hover:bg-gray-200 transition-colors disabled:opacity-50"
          >
            {uploading ? (
              <svg className="animate-spin h-3 w-3" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : <Upload size={12} />}
            {uploading ? 'Se încarcă...' : 'Upload fișier'}
          </button>
        </div>
      </div>

      {/* URL input */}
      {urlMode && (
        <div className="mb-3">
          <div className="flex gap-2">
            <input
              type="url"
              value={urlInput}
              onChange={(e) => { setUrlInput(e.target.value); setUrlError('') }}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addFromUrl())}
              placeholder="https://example.com/imagine.jpg"
              className="flex-1 px-3 py-2 text-sm rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0]"
            />
            <button
              type="button"
              onClick={addFromUrl}
              className="px-4 py-2 bg-[#5BC4C0] text-white text-sm font-medium rounded-xl hover:bg-[#3EA8A4] transition-colors"
            >
              Adaugă
            </button>
          </div>
          {urlError && <p className="text-xs text-red-500 mt-1">{urlError}</p>}
        </div>
      )}

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => addFromFiles(e.target.files)}
      />

      {/* Drop zone + previews */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-2xl p-4 transition-all min-h-[120px] ${
          dragOver
            ? 'border-[#5BC4C0] bg-[#5BC4C0]/5'
            : 'border-gray-200 hover:border-gray-300 bg-gray-50'
        }`}
      >
        {images.length === 0 ? (
          <div
            className="flex flex-col items-center justify-center py-6 cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            <div className="w-12 h-12 rounded-2xl bg-white shadow-card flex items-center justify-center mb-3">
              <ImagePlus size={22} className="text-[#5BC4C0]" />
            </div>
            <p className="text-sm font-medium text-[#2D2D2D]">Trage imagini aici</p>
            <p className="text-xs text-[#6B7280] mt-1">sau click pentru a selecta fișiere</p>
            <p className="text-xs text-gray-400 mt-1">PNG, JPG, WEBP — max 10MB fiecare</p>
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
            {images.map((img, i) => (
              <div key={i} className="relative group aspect-square">
                <img
                  src={img}
                  alt={`Imagine ${i + 1}`}
                  className={`w-full h-full object-cover rounded-xl border-2 transition-all ${
                    i === 0 ? 'border-[#5BC4C0]' : 'border-transparent'
                  }`}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />

                {/* Primary badge */}
                {i === 0 && (
                  <div className="absolute top-1 left-1 bg-[#5BC4C0] text-white text-xs font-bold px-1.5 py-0.5 rounded-lg flex items-center gap-0.5">
                    <Star size={9} fill="white" />
                    Principal
                  </div>
                )}

                {/* Hover actions */}
                <div className="absolute inset-0 bg-black/50 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  {i !== 0 && (
                    <button
                      type="button"
                      onClick={() => setPrimary(i)}
                      title="Setează ca principală"
                      className="w-7 h-7 bg-[#5BC4C0] rounded-lg flex items-center justify-center hover:bg-[#3EA8A4] transition-colors"
                    >
                      <Star size={13} className="text-white" />
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    title="Șterge imaginea"
                    className="w-7 h-7 bg-red-500 rounded-lg flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    <Trash2 size={13} className="text-white" />
                  </button>
                </div>
              </div>
            ))}

            {/* Add more button */}
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="aspect-square border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center gap-1 hover:border-[#5BC4C0] hover:bg-[#5BC4C0]/5 transition-all group"
            >
              <Plus size={18} className="text-gray-400 group-hover:text-[#5BC4C0]" />
              <span className="text-xs text-gray-400 group-hover:text-[#5BC4C0]">Adaugă</span>
            </button>
          </div>
        )}
      </div>

      {images.length > 0 && (
        <p className="text-xs text-[#6B7280] mt-1.5">
          {images.length} {images.length === 1 ? 'imagine' : 'imagini'} · Hover pe imagine pentru opțiuni
        </p>
      )}
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function AdminProducts() {
  const { products, addProduct, updateProduct, deleteProduct } = useProductsStore()
  const [search, setSearch] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [form, setForm] = useState<typeof emptyProduct>({ ...emptyProduct })
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.sku.toLowerCase().includes(search.toLowerCase())
  )

  const openAdd = () => {
    setEditingProduct(null)
    setForm({ ...emptyProduct })
    setModalOpen(true)
  }

  const openEdit = (product: Product) => {
    setEditingProduct(product)
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      compare_price: product.compare_price,
      show_compare_price: product.show_compare_price ?? false,
      sku: product.sku,
      stock_qty: product.stock_qty,
      category: product.category,
      age_range: product.age_range,
      difficulty: product.difficulty,
      images: [...product.images],
      status: product.status,
      weight: product.weight,
    })
    setModalOpen(true)
  }

  const [formError, setFormError] = useState('')
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setFormError('')
    if (!form.name.trim()) { setFormError('Numele produsului este obligatoriu.'); return }
    if (!form.sku.trim()) { setFormError('SKU-ul este obligatoriu.'); return }
    if (form.price <= 0) { setFormError('Prețul trebuie să fie mai mare decât 0.'); return }
    if (form.show_compare_price && form.compare_price !== undefined && form.compare_price <= form.price) {
      setFormError('Prețul original trebuie să fie mai mare decât prețul curent.')
      return
    }
    setSaving(true)
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, form)
      } else {
        await addProduct(form)
      }
      setSaved(true)
      setTimeout(() => { setSaved(false); setModalOpen(false) }, 1000)
    } catch (err) {
      setFormError(err instanceof Error ? err.message : 'Eroare la salvare.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteProduct(id)
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Eroare la ștergere.')
    }
    setDeleteConfirm(null)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-[#2D2D2D]">Produse</h2>
          <p className="text-sm text-[#6B7280]">{products.length} produse în total</p>
        </div>
        <button onClick={openAdd} className="btn-primary">
          <Plus size={16} />
          Adaugă produs
        </button>
      </div>

      {/* Search */}
      <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 shadow-card focus-within:border-[#5BC4C0] transition-colors">
        <Search size={16} className="text-gray-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Caută după nume sau SKU..."
          className="flex-1 outline-none text-sm text-[#2D2D2D] placeholder-gray-400"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Produs</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">SKU</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Preț</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Stoc</th>
                <th className="text-left px-6 py-3 text-xs font-semibold text-[#6B7280] uppercase tracking-wide">Status</th>
                <th className="px-6 py-3"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((product) => (
                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-gray-100 shrink-0 relative">
                        {product.images[0] ? (
                          <img src={product.images[0]} alt={product.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImagePlus size={18} className="text-gray-300" />
                          </div>
                        )}
                        {product.images.length > 1 && (
                          <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-1 rounded-tl-lg leading-4">
                            +{product.images.length - 1}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2D2D2D]">{product.name}</p>
                        <p className="text-xs text-[#6B7280]">{product.category} · {product.age_range} ani</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-mono text-[#6B7280]">{product.sku}</td>
                  <td className="px-6 py-4">
                    <p className="text-sm font-bold text-[#2D2D2D]">{product.price} RON</p>
                    {product.show_compare_price && product.compare_price && (
                      <p className="text-xs text-gray-400 line-through">{product.compare_price} RON</p>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-2 h-2 rounded-full ${product.stock_qty === 0 ? 'bg-red-400' : product.stock_qty <= 5 ? 'bg-orange-400' : 'bg-green-400'}`} />
                      <span className={`text-sm font-medium ${product.stock_qty === 0 ? 'text-red-600' : product.stock_qty <= 5 ? 'text-orange-600' : 'text-[#2D2D2D]'}`}>
                        {product.stock_qty}
                      </span>
                      {product.stock_qty <= 5 && product.stock_qty > 0 && (
                        <AlertTriangle size={14} className="text-orange-400" />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${STATUS_COLORS[product.status]}`}>
                      {STATUS_LABELS[product.status]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEdit(product)}
                        className="p-2 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => setDeleteConfirm(product.id)}
                        className="p-2 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Delete confirmation */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-sm w-full shadow-hover">
            <h3 className="font-bold text-[#2D2D2D] mb-2">Șterge produsul?</h3>
            <p className="text-sm text-[#6B7280] mb-5">Această acțiune nu poate fi anulată.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="flex-1 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
              >
                Anulează
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="flex-1 py-2.5 bg-red-500 text-white rounded-xl text-sm font-medium hover:bg-red-600 transition-colors"
              >
                Șterge
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-hover">
            <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white z-10 rounded-t-3xl">
              <h3 className="font-bold text-lg text-[#2D2D2D]">
                {editingProduct ? 'Editează produs' : 'Adaugă produs nou'}
              </h3>
              <button onClick={() => setModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                <X size={18} />
              </button>
            </div>

            <div className="p-6 space-y-5">
              {/* ── IMAGINI ── */}
              <div className="grid sm:grid-cols-2 gap-4">
                <ImageManager
                  images={form.images}
                  onChange={(imgs) => setForm({ ...form, images: imgs })}
                />
              </div>

              <div className="border-t border-gray-100 pt-5">
                <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wide mb-4">Detalii produs</p>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Nume produs</label>
                    <input
                      type="text"
                      value={form.name}
                      onChange={(e) => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                      placeholder="Ex: Planșă Nisip - Fluturi Colorați"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">SKU</label>
                    <input
                      type="text"
                      value={form.sku}
                      onChange={(e) => setForm({ ...form, sku: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                      placeholder="SNS-001"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Categorie</label>
                    <select
                      value={form.category}
                      onChange={(e) => setForm({ ...form, category: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm bg-white"
                    >
                      {['Planșe Simple', 'Kit Complet', 'Nisip Colorat', 'Accesorii'].map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Preț (RON)</label>
                    <input
                      type="number"
                      value={form.price}
                      onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                      min={0}
                    />
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="text-sm font-medium text-[#2D2D2D]">
                        Preț original (RON)
                      </label>
                      {/* Toggle afișare reducere */}
                      <button
                        type="button"
                        onClick={() => setForm({ ...form, show_compare_price: !form.show_compare_price })}
                        className={`relative inline-flex h-5 w-9 items-center rounded-full transition-colors shrink-0 ${
                          form.show_compare_price ? 'bg-[#5BC4C0]' : 'bg-gray-200'
                        }`}
                        title={form.show_compare_price ? 'Reducere vizibilă pe site' : 'Reducere ascunsă pe site'}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white shadow transition-transform ${
                            form.show_compare_price ? 'translate-x-[18px]' : 'translate-x-[3px]'
                          }`}
                        />
                      </button>
                    </div>
                    <input
                      type="number"
                      value={form.compare_price || ''}
                      onChange={(e) => setForm({ ...form, compare_price: e.target.value ? Number(e.target.value) : undefined })}
                      className={`w-full px-4 py-2.5 rounded-xl border text-sm outline-none transition-colors ${
                        form.show_compare_price
                          ? 'border-[#5BC4C0] focus:border-[#5BC4C0] bg-white'
                          : 'border-gray-200 focus:border-gray-300 bg-gray-50 text-gray-400'
                      }`}
                      min={0}
                      placeholder="Ex: 110"
                    />
                    <p className={`text-xs mt-1 ${form.show_compare_price ? 'text-[#5BC4C0]' : 'text-gray-400'}`}>
                      {form.show_compare_price
                        ? '✓ Prețul tăiat și badge-ul de reducere sunt vizibile pe site'
                        : 'Prețul tăiat este salvat dar nu apare pe site'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Stoc</label>
                    <input
                      type="number"
                      value={form.stock_qty}
                      onChange={(e) => setForm({ ...form, stock_qty: Number(e.target.value) })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                      min={0}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Greutate (g)</label>
                    <input
                      type="number"
                      value={form.weight || ''}
                      onChange={(e) => setForm({ ...form, weight: e.target.value ? Number(e.target.value) : undefined })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm"
                      min={0}
                      placeholder="Ex: 350"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Vârstă</label>
                    <select
                      value={form.age_range}
                      onChange={(e) => setForm({ ...form, age_range: e.target.value })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm bg-white"
                    >
                      {['2-4', '4-6', '6-8', '8-10'].map((a) => (
                        <option key={a} value={a}>{a} ani</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Dificultate</label>
                    <select
                      value={form.difficulty}
                      onChange={(e) => setForm({ ...form, difficulty: e.target.value as 'Ușor' | 'Mediu' | 'Avansat' })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm bg-white"
                    >
                      {['Ușor', 'Mediu', 'Avansat'].map((d) => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Status</label>
                    <select
                      value={form.status}
                      onChange={(e) => setForm({ ...form, status: e.target.value as Product['status'] })}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm bg-white"
                    >
                      <option value="active">Activ</option>
                      <option value="draft">Draft</option>
                      <option value="out_of_stock">Stoc Epuizat</option>
                    </select>
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">Descriere</label>
                    <textarea
                      value={form.description}
                      onChange={(e) => setForm({ ...form, description: e.target.value })}
                      rows={3}
                      className="w-full px-4 py-2.5 rounded-xl border border-gray-200 outline-none focus:border-[#5BC4C0] text-sm resize-none"
                      placeholder="Descrierea produsului..."
                    />
                  </div>
                </div>
              </div>

              {formError && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  <AlertTriangle size={15} className="shrink-0" />
                  {formError}
                </div>
              )}

              <div className="flex justify-end gap-3 pt-2 border-t border-gray-100">
                <button
                  onClick={() => setModalOpen(false)}
                  className="px-5 py-2.5 border border-gray-200 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors"
                >
                  Anulează
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition-all disabled:opacity-60 ${
                    saved ? 'bg-green-500' : 'bg-[#5BC4C0] hover:bg-[#3EA8A4]'
                  }`}
                >
                  {saved ? <><Check size={14} /> Salvat!</> : saving ? 'Se salvează...' : 'Salvează produsul'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
