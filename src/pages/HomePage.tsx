import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Star, Sparkles, Brain, Hand, Heart, Zap,
  ChevronLeft, ChevronRight, Mail,
  ClipboardList, Search, Pencil, Palette, Award,
  Baby, Home, BookOpen, Building2,
  ShieldCheck, Check,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { testimonials } from '../lib/mockData'
import { useProductsStore } from '../store/productsStore'
import { useNewsletterStore } from '../store/newsletterStore'
import { useMeta } from '../hooks/useMeta'

const benefits = [
  {
    icon: Brain,
    title: 'Concentrare',
    description: 'Copiii stau focalizați 30–60 de minute fără ecrane. Nisipul îi ancorează în prezent și antrenează atenția susținută.',
    color: 'bg-[#5BC4C0]/10 text-[#5BC4C0]',
  },
  {
    icon: Sparkles,
    title: 'Creativitate',
    description: 'Nu există greșeli — fiecare planșă iese diferit. Copilul alege culorile și ritmul, iar rezultatul e mereu al lui.',
    color: 'bg-[#E86B9E]/10 text-[#E86B9E]',
  },
  {
    icon: Hand,
    title: 'Motricitate Fină',
    description: 'Gesturile mici și precise de aplicare a nisipului pregătesc mâna pentru scris și antrenează coordonarea mână-ochi.',
    color: 'bg-[#B07CC6]/10 text-[#B07CC6]',
  },
  {
    icon: Heart,
    title: 'Calm Emoțional',
    description: 'Textura fină a nisipului are efect aproape meditativ. Ideal după o zi agitată sau în momentele de anxietate.',
    color: 'bg-[#F4A68F]/10 text-[#E08870]',
  },
  {
    icon: Zap,
    title: 'Stimulare Senzorială',
    description: 'Culorile vii și textura nisipului activează simțurile tactil și vizual, sprijinind dezvoltarea neurologică timpurie.',
    color: 'bg-[#5BC4C0]/10 text-[#5BC4C0]',
  },
]

const audiences = [
  {
    title: 'Copii 2–6 ani',
    desc: 'Primele experiențe cu culorile și textura. Modele mari, simple, care dau un sentiment de reușită rapid.',
    icon: Baby,
    iconColor: 'text-[#E08870]',
    iconBg: 'bg-[#F4A68F]/15',
    color: 'border-[#F4A68F]',
    bg: 'bg-[#F4A68F]/5',
  },
  {
    title: 'Joacă acasă',
    desc: 'Înlocuiește tableta cu o activitate liniștitoare. Copilul se joacă singur sau alături de tine — fără haos, fără ecrane.',
    icon: Home,
    iconColor: 'text-[#3EA8A4]',
    iconBg: 'bg-[#5BC4C0]/15',
    color: 'border-[#5BC4C0]',
    bg: 'bg-[#5BC4C0]/5',
  },
  {
    title: 'Grădiniță & Școală',
    desc: 'Activitate educativă recomandată de educatori pentru dezvoltarea motricității fine și a atenției.',
    icon: BookOpen,
    iconColor: 'text-[#D04D82]',
    iconBg: 'bg-[#E86B9E]/15',
    color: 'border-[#E86B9E]',
    bg: 'bg-[#E86B9E]/5',
  },
  {
    title: 'Centre & Afterschool',
    desc: 'Seturi pentru grupuri mici, ușor de pregătit și de gestionat. Nisipul nu se împrăștie, spațiul rămâne curat.',
    icon: Building2,
    iconColor: 'text-[#8A5EAA]',
    iconBg: 'bg-[#B07CC6]/15',
    color: 'border-[#B07CC6]',
    bg: 'bg-[#B07CC6]/5',
  },
]

const ageGroups = [
  {
    label: 'Preșcolari',
    age: '2–5 ani',
    desc: 'La această vârstă, succesul rapid contează. Planșele noastre au forme mari și clare — copilul termină o planșă în 20 de minute și e mândru de rezultat.',
    features: ['Modele mari, ușor de colorat', 'Culori vii, primare', 'Nisip fin, 100% non-toxic, sigur la atingere'],
    color: 'bg-[#F4A68F]',
  },
  {
    label: 'Școlari',
    age: '6–10 ani',
    desc: 'La această vârstă copiii vor provocări. Planșele mai complexe îi țin concentrați mai mult și îi ajută să-și dezvolte răbdarea și precizia.',
    features: ['Detalii fine, multiple zone de culoare', 'Teme: spațiu, animale, artă, natură', 'Combinații de culori și tehnici avansate'],
    color: 'bg-[#5BC4C0]',
  },
  {
    label: 'Activitate de familie',
    age: 'Părinți & copii',
    desc: 'Cel mai bun lucru pe care îl poți oferi unui copil e timpul tău. Kiturile de familie vin cu două planșe — una pentru el, una pentru tine.',
    features: ['Planșe perechi, pentru adult și copil', 'Activitate de 45–60 minute împreună', 'Fără ecrane, fără distracții — doar voi doi'],
    color: 'bg-[#E86B9E]',
  },
]

const steps = [
  { num: 1, title: 'Alege planșa', desc: 'Copilul alege tema preferată din kit', icon: ClipboardList },
  { num: 2, title: 'Descoperă nisipul', desc: 'Atinge, simte — experiența senzorială începe', icon: Search },
  { num: 3, title: 'Aplică cu grijă', desc: 'Urmează liniile și umple zona cu culoarea aleasă', icon: Pencil },
  { num: 4, title: 'Creează', desc: 'Fiecare culoare adăugată aduce desenul la viață', icon: Palette },
  { num: 5, title: 'Prezintă cu mândrie', desc: 'Lucrarea e gata — și e 100% a lui', icon: Award },
]

export default function HomePage() {
  useMeta('', 'Planșe de nisip colorate pentru copii de 2–10 ani. Joacă blândă, liniște, creativitate.')
  const { products } = useProductsStore()
  const { subscribe } = useNewsletterStore()
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)
  const [activeAge, setActiveAge] = useState(0)

  const featuredProducts = products.filter((p) => p.status === 'active').slice(0, 4)

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      subscribe(email)
      setSubscribed(true)
      setEmail('')
    }
  }

  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-br from-[#5BC4C0]/10 via-white to-[#E86B9E]/10"
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage: `radial-gradient(circle at 20% 50%, #5BC4C0 0%, transparent 50%),
                              radial-gradient(circle at 80% 50%, #E86B9E 0%, transparent 50%)`,
          }}
        />

        {/* Decorative shapes */}
        <div className="absolute top-20 right-10 w-64 h-64 rounded-full bg-[#B07CC6]/10 blur-3xl float-animation" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-[#F4A68F]/20 blur-3xl float-animation" style={{ animationDelay: '1.5s' }} />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={14} />
              Fără ecrane. Fără haos. Doar creativitate.
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#2D2D2D] leading-tight mb-6">
              Activitatea care îl{' '}
              <span className="text-[#5BC4C0]">ține concentrat</span>
              {' '}o oră întreagă
            </h1>
            <p className="text-xl text-[#6B7280] mb-8 leading-relaxed max-w-lg">
              Planșe de nisip colorat pentru copii de 2–10 ani. Copilul creează, se liniștește și se dezvoltă — tu te bucuri de liniște.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/magazin" className="btn-primary text-base px-8 py-4">
                Descoperă Produsele
                <ArrowRight size={18} />
              </Link>
              <Link to="/despre-noi" className="btn-outline text-base px-8 py-4">
                Despre Noi
              </Link>
            </div>
            <div className="flex items-center gap-6 mt-8">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2D2D2D]">100%</p>
                <p className="text-xs text-[#6B7280]">Non-toxic, sigur</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2D2D2D]">2–10</p>
                <p className="text-xs text-[#6B7280]">Ani recomandat</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2D2D2D]">60 min</p>
                <p className="text-xs text-[#6B7280]">Concentrare medie</p>
              </div>
            </div>
          </div>

          <div className="relative hidden lg:block">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5BC4C0]/20 to-[#E86B9E]/20" />
              <img
                src="https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?w=800&q=80"
                alt="Copil creativ cu planșă de nisip"
                width={800}
                height={800}
                className="w-full h-full object-cover rounded-3xl shadow-hover"
                loading="eager"
                fetchPriority="high"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-hover">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5BC4C0]/10 flex items-center justify-center">
                    <Star size={18} className="text-[#5BC4C0] fill-[#5BC4C0]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Recomandat de educatori</p>
                    <p className="text-xs text-[#6B7280]">Activitate educativă certificată</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-hover">
                <div className="w-8 h-8 rounded-xl bg-[#E86B9E]/10 flex items-center justify-center mb-1.5">
                  <ShieldCheck size={18} className="text-[#E86B9E]" />
                </div>
                <p className="font-bold text-sm">100% non-toxic</p>
                <p className="text-xs text-[#6B7280]">Sigur pentru copii</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What are sand art kits */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-4">
                Cum funcționează?
              </h2>
              <p className="section-subtitle mb-6">
                Fiecare planșă are suprafața acoperită cu adeziv transparent. Copilul aplică nisipul colorat pe zonele marcate și — în câteva minute — apare o imagine completă.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-6">
                Nu e nevoie de apă, pensule sau pregătire specială. Kitul conține tot: planșe gata de folosit, nisip colorat non-toxic în mai multe culori și instrumente de aplicare. Se poate face pe masă, pe podea, oriunde.
              </p>
              <div className="flex flex-col gap-3">
                {steps.map((step) => (
                  <div key={step.num} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-card">
                    <div className="w-10 h-10 rounded-xl bg-[#5BC4C0] text-white flex items-center justify-center font-bold shrink-0">
                      {step.num}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#2D2D2D]">{step.title}</p>
                      <p className="text-xs text-[#6B7280]">{step.desc}</p>
                    </div>
                    <div className="ml-auto w-8 h-8 rounded-lg bg-[#5BC4C0]/10 flex items-center justify-center shrink-0">
                      <step.icon size={16} className="text-[#5BC4C0]" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516981442399-a91139e20ff8?w=700&q=80"
                alt="Activitate cu planșe de nisip"
                className="w-full rounded-3xl shadow-hover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">De ce funcționează atât de bine?</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Nu e doar o joacă frumoasă — e o activitate cu beneficii concrete, validate de educatori și psihologi pentru copii.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="card p-6 text-center group hover:-translate-y-1 transition-transform">
                <div className={`w-14 h-14 rounded-2xl ${b.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                  <b.icon size={24} />
                </div>
                <h3 className="font-bold text-[#2D2D2D] mb-2">{b.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Audience */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Potrivit pentru orice context</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Acasă, la grădiniță sau la afterschool — kiturile Sensoria Kids se adaptează ușor oricărui mediu
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((a) => (
              <div
                key={a.title}
                className={`${a.bg} border-2 ${a.color} rounded-2xl p-6 hover:shadow-card transition-shadow`}
              >
                <div className={`w-12 h-12 ${a.iconBg} rounded-2xl flex items-center justify-center mb-4`}>
                  <a.icon size={24} className={a.iconColor} />
                </div>
                <h3 className="font-bold text-lg text-[#2D2D2D] mb-2">{a.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{a.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Age groups */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Câte un kit potrivit pentru fiecare vârstă</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Nu toate kiturile sunt la fel — le-am gândit diferit pentru fiecare etapă de dezvoltare
            </p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap justify-center gap-3 mb-10">
            {ageGroups.map((ag, i) => (
              <button
                key={i}
                onClick={() => setActiveAge(i)}
                className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition-all ${
                  activeAge === i
                    ? 'text-white shadow-card scale-105'
                    : 'bg-gray-100 text-[#6B7280] hover:bg-gray-200'
                }`}
                style={activeAge === i ? { backgroundColor: ageGroups[i].color } : undefined}
              >
                {ag.label} · {ag.age}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="grid lg:grid-cols-2 gap-10 items-center">
            <div>
              <div
                className="inline-block px-4 py-1.5 rounded-full text-white text-sm font-semibold mb-4"
                style={{ backgroundColor: ageGroups[activeAge].color }}
              >
                {ageGroups[activeAge].age}
              </div>
              <h3 className="text-2xl font-bold text-[#2D2D2D] mb-4">
                {ageGroups[activeAge].label}
              </h3>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-6">
                {ageGroups[activeAge].desc}
              </p>
              <ul className="space-y-3">
                {ageGroups[activeAge].features.map((f, i) => (
                  <li key={i} className="flex items-center gap-3">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center shrink-0"
                      style={{ backgroundColor: `${ageGroups[activeAge].color}20` }}
                    >
                      <Check size={12} style={{ color: ageGroups[activeAge].color }} />
                    </div>
                    <span className="text-[#2D2D2D] font-medium">{f}</span>
                  </li>
                ))}
              </ul>
              <Link to="/magazin" className="btn-primary mt-8 inline-flex">
                Găsește produse potrivite
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {products.slice(activeAge * 2, activeAge * 2 + 2).length > 0
                ? products.slice(activeAge * 2, activeAge * 2 + 2).map((p) => (
                    <ProductCard key={p.id} product={p} />
                  ))
                : (
                  <div className="col-span-2 text-center py-12 text-[#6B7280]">
                    <p className="font-medium mb-2">Nu există produse în această categorie momentan.</p>
                    <Link to="/magazin" className="btn-outline text-sm">
                      Vezi toate produsele
                      <ArrowRight size={14} />
                    </Link>
                  </div>
                )
              }
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-gradient-to-br from-[#5BC4C0]/5 to-[#E86B9E]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Cele mai iubite kituri</h2>
              <p className="section-subtitle">Alegerile preferate ale familiilor Sensoria Kids</p>
            </div>
            <Link to="/magazin" className="btn-outline hidden sm:inline-flex">
              Vezi toate
              <ArrowRight size={16} />
            </Link>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="text-center mt-8 sm:hidden">
            <Link to="/magazin" className="btn-outline">
              Vezi toate produsele
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Ce spun părinții și educatorii</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Părinți, bunici, educatoare — toți au găsit ceva valoros în kiturile Sensoria Kids
            </p>
          </div>

          <div className="relative">
            <div className="grid md:grid-cols-2 gap-6">
              {testimonials.slice(testimonialIdx, testimonialIdx + 2).map((t, _, arr) => (
                <div key={t.id} className={`card p-8 ${arr.length === 1 ? 'md:col-span-2 md:max-w-xl md:mx-auto' : ''}`}>
                  <div className="flex gap-1 mb-4">
                    {Array.from({ length: t.rating }).map((_, i) => (
                      <Star key={i} size={16} className="text-yellow-400 fill-yellow-400" />
                    ))}
                  </div>
                  <p className="text-[#2D2D2D] leading-relaxed mb-6 italic">
                    "{t.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#5BC4C0] to-[#E86B9E] flex items-center justify-center text-white text-sm font-bold">
                      {t.avatar}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#2D2D2D]">{t.name}</p>
                      <p className="text-xs text-[#6B7280]">{t.role}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex justify-center gap-3 mt-8">
              <button
                onClick={() => setTestimonialIdx(Math.max(0, testimonialIdx - 2))}
                disabled={testimonialIdx === 0}
                className="p-2 rounded-xl border border-gray-200 hover:border-[#5BC4C0] hover:text-[#5BC4C0] disabled:opacity-40 transition-colors"
              >
                <ChevronLeft size={20} />
              </button>
              <button
                onClick={() => setTestimonialIdx(Math.min(testimonials.length - 1, testimonialIdx + 2))}
                disabled={testimonialIdx + 2 >= testimonials.length}
                className="p-2 rounded-xl border border-gray-200 hover:border-[#5BC4C0] hover:text-[#5BC4C0] disabled:opacity-40 transition-colors"
              >
                <ChevronRight size={20} />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-br from-[#5BC4C0] to-[#3EA8A4]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Mail size={32} className="text-white" />
          </div>
          <h2 className="text-3xl font-bold text-white mb-4">
            Idei, oferte și noutăți — direct pe email
          </h2>
          <p className="text-white/80 mb-8 text-lg">
            Înscrie-te și primești primul idei creative gratuite, oferte exclusive și notificări când lansăm produse noi.
          </p>
          {subscribed ? (
            <div className="bg-white/20 rounded-2xl p-6 text-white">
              <p className="text-xl font-bold mb-1">Mulțumim!</p>
              <p>Te-ai abonat cu succes. Verifică-ți email-ul.</p>
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <div className="flex-1 flex items-center gap-2 bg-white rounded-xl px-4 py-3">
                <Mail size={18} className="text-gray-400 shrink-0" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Adresa ta de email"
                  required
                  className="flex-1 outline-none text-sm text-[#2D2D2D] placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                className="bg-[#E86B9E] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#D04D82] transition-colors shrink-0"
              >
                Abonează-te
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  )
}
