import { useState, useMemo } from 'react'
import { Search, SlidersHorizontal, X, ChevronDown, SearchX } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { useProductsStore } from '../store/productsStore'
import { Product } from '../types'
import { useMeta } from '../hooks/useMeta'

const categories = ['Toate', 'Planșe Simple', 'Kit Complet', 'Nisip Colorat', 'Accesorii']
const ageRanges = ['Toate', '2-4', '4-6', '6-8', '8-10']
const difficulties = ['Toate', 'Ușor', 'Mediu', 'Avansat']
const sortOptions = [
  { label: 'Recomandate', value: 'recommended' },
  { label: 'Preț crescător', value: 'price_asc' },
  { label: 'Preț descrescător', value: 'price_desc' },
  { label: 'Cele mai noi', value: 'newest' },
]

export default function ShopPage() {
  useMeta('Magazin — Kituri cu nisip colorat', 'Cumpără kituri cu planșe de nisip colorat pentru copii. Colecția Sensoria Kids — activitate creativă, sigură, 100% produsă în România. Livrare rapidă.')
  const { products: allProducts } = useProductsStore()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('Toate')
  const [ageRange, setAgeRange] = useState('Toate')
  const [difficulty, setDifficulty] = useState('Toate')
  const [sort, setSort] = useState('recommended')
  const [priceMax, setPriceMax] = useState(200)
  const [filtersOpen, setFiltersOpen] = useState(false)

  const filtered = useMemo(() => {
    let products: Product[] = [...allProducts]

    if (search) {
      products = products.filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    }
    if (category !== 'Toate') products = products.filter((p) => p.category === category)
    if (ageRange !== 'Toate') products = products.filter((p) => p.age_range === ageRange)
    if (difficulty !== 'Toate') products = products.filter((p) => p.difficulty === difficulty)
    products = products.filter((p) => p.price <= priceMax)

    switch (sort) {
      case 'price_asc': products.sort((a, b) => a.price - b.price); break
      case 'price_desc': products.sort((a, b) => b.price - a.price); break
      case 'newest': products.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()); break
    }

    return products
  }, [allProducts, search, category, ageRange, difficulty, sort, priceMax])

  const minPrice = useMemo(
    () => (allProducts.length > 0 ? Math.floor(Math.min(...allProducts.map((p) => p.price))) : 0),
    [allProducts]
  )

  const maxPrice = useMemo(
    () => Math.max(200, ...allProducts.map((p) => p.price)),
    [allProducts]
  )

  const hasFilters = category !== 'Toate' || ageRange !== 'Toate' || difficulty !== 'Toate' || priceMax < maxPrice

  const clearFilters = () => {
    setCategory('Toate')
    setAgeRange('Toate')
    setDifficulty('Toate')
    setPriceMax(maxPrice)
    setSearch('')
  }

  return (
    <div className="min-h-screen pt-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl font-bold text-[#2D2D2D] mb-3">Magazin</h1>
          <p className="text-[#6B7280] text-lg">
            {filtered.length} produse disponibile
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Search + Sort bar */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          <div className="flex-1 flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-4 py-3 focus-within:border-[#5BC4C0] transition-colors shadow-card">
            <Search size={18} className="text-gray-400 shrink-0" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Caută produse..."
              className="flex-1 outline-none text-sm text-[#2D2D2D] placeholder-gray-400"
            />
            {search && (
              <button onClick={() => setSearch('')} className="text-gray-400 hover:text-gray-600">
                <X size={16} />
              </button>
            )}
          </div>

          <div className="flex gap-3">
            <div className="relative">
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="appearance-none bg-white border border-gray-200 rounded-xl px-4 py-3 pr-8 text-sm font-medium text-[#2D2D2D] outline-none cursor-pointer shadow-card"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400" />
            </div>

            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl border text-sm font-medium shadow-card transition-colors ${
                filtersOpen || hasFilters
                  ? 'bg-[#5BC4C0] text-white border-[#5BC4C0]'
                  : 'bg-white border-gray-200 text-[#2D2D2D] hover:border-[#5BC4C0]'
              }`}
            >
              <SlidersHorizontal size={16} />
              Filtre
              {hasFilters && (
                <span className="w-5 h-5 bg-white text-[#5BC4C0] rounded-full text-xs font-bold flex items-center justify-center">
                  !
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="bg-white border border-gray-100 rounded-2xl p-6 mb-6 shadow-card">
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Category */}
              <div>
                <p className="text-sm font-semibold text-[#2D2D2D] mb-3">Categorie</p>
                <div className="flex flex-col gap-1.5">
                  {categories.map((c) => (
                    <button
                      key={c}
                      onClick={() => setCategory(c)}
                      className={`text-left px-3 py-2 rounded-xl text-sm transition-colors ${
                        category === c
                          ? 'bg-[#5BC4C0] text-white font-semibold'
                          : 'hover:bg-gray-100 text-[#6B7280]'
                      }`}
                    >
                      {c}
                    </button>
                  ))}
                </div>
              </div>

              {/* Age range */}
              <div>
                <p className="text-sm font-semibold text-[#2D2D2D] mb-3">Vârstă</p>
                <div className="flex flex-wrap gap-2">
                  {ageRanges.map((a) => (
                    <button
                      key={a}
                      onClick={() => setAgeRange(a)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                        ageRange === a
                          ? 'bg-[#5BC4C0] text-white'
                          : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                      }`}
                    >
                      {a === 'Toate' ? 'Toate' : `${a} ani`}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty */}
              <div>
                <p className="text-sm font-semibold text-[#2D2D2D] mb-3">Dificultate</p>
                <div className="flex flex-wrap gap-2">
                  {difficulties.map((d) => (
                    <button
                      key={d}
                      onClick={() => setDifficulty(d)}
                      className={`px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
                        difficulty === d
                          ? 'bg-[#5BC4C0] text-white'
                          : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price */}
              <div>
                <p className="text-sm font-semibold text-[#2D2D2D] mb-3">
                  Preț maxim: <span className="text-[#5BC4C0]">{priceMax} RON</span>
                </p>
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  step={5}
                  value={priceMax}
                  onChange={(e) => setPriceMax(Number(e.target.value))}
                  className="w-full accent-[#5BC4C0]"
                />
                <div className="flex justify-between text-xs text-gray-400 mt-1">
                  <span>{minPrice} RON</span>
                  <span>{maxPrice} RON</span>
                </div>
              </div>
            </div>

            {hasFilters && (
              <button
                onClick={clearFilters}
                className="flex items-center gap-1.5 text-sm text-[#E86B9E] hover:text-[#D04D82] mt-4 font-medium"
              >
                <X size={14} />
                Șterge toate filtrele
              </button>
            )}
          </div>
        )}

        {/* Active filter chips */}
        {hasFilters && (
          <div className="flex flex-wrap gap-2 mb-6">
            {category !== 'Toate' && (
              <span className="flex items-center gap-1.5 bg-[#5BC4C0]/10 text-[#5BC4C0] text-xs font-semibold px-3 py-1.5 rounded-full">
                {category}
                <button onClick={() => setCategory('Toate')}><X size={12} /></button>
              </span>
            )}
            {ageRange !== 'Toate' && (
              <span className="flex items-center gap-1.5 bg-[#E86B9E]/10 text-[#E86B9E] text-xs font-semibold px-3 py-1.5 rounded-full">
                {ageRange} ani
                <button onClick={() => setAgeRange('Toate')}><X size={12} /></button>
              </span>
            )}
            {difficulty !== 'Toate' && (
              <span className="flex items-center gap-1.5 bg-[#B07CC6]/10 text-[#B07CC6] text-xs font-semibold px-3 py-1.5 rounded-full">
                {difficulty}
                <button onClick={() => setDifficulty('Toate')}><X size={12} /></button>
              </span>
            )}
          </div>
        )}

        {/* Products grid */}
        {filtered.length > 0 ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filtered.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24">
            <SearchX size={48} className="text-gray-300 mb-4 mx-auto" />
            <h3 className="text-xl font-bold text-[#2D2D2D] mb-2">Niciun produs găsit</h3>
            <p className="text-[#6B7280] mb-6">Încearcă să modifici filtrele sau căutarea</p>
            <button onClick={clearFilters} className="btn-primary">
              Resetează filtrele
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
