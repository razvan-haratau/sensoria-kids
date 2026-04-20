import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight, Star, Sparkles, Hand, Heart, Brain,
  ChevronLeft, ChevronRight, Mail,
  ShieldCheck, Check, Package, Palette, Award, MapPin, Gift,
  Baby, Home, BookOpen,
} from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { testimonials } from '../lib/mockData'
import { useProductsStore } from '../store/productsStore'
import { useNewsletterStore } from '../store/newsletterStore'
import { useMeta } from '../hooks/useMeta'

const howItWorksSteps = [
  {
    num: 1,
    title: 'Dezlipești folia',
    desc: 'Pe o zonă mică, pas cu pas. Planșa are deja adeziv — nu trebuie lipici separat.',
    color: 'bg-[#F4A68F]',
  },
  {
    num: 2,
    title: 'Alegi culoarea',
    desc: 'Fiecare zonă are culoarea ei. Copilul alege ce segment să coloreze prima dată.',
    color: 'bg-[#E86B9E]',
  },
  {
    num: 3,
    title: 'Presari nisipul',
    desc: 'Din eprubetă sau punguță direct pe zonă. Controlat, fără să se verse.',
    color: 'bg-[#5BC4C0]',
  },
  {
    num: 4,
    title: 'Scuturi excesul',
    desc: 'Nisipul în plus cade ușor. Se strânge pe o coală pusă dedesubt.',
    color: 'bg-[#B07CC6]',
  },
  {
    num: 5,
    title: 'Admiri rezultatul',
    desc: 'O planșă completă, frumoasă — 100% creată de el.',
    color: 'bg-[#5BC4C0]',
  },
]

const differentiators = [
  {
    title: 'Folia se dezlipește ușor',
    desc: 'Am testat zeci de variante până am găsit folia potrivită. Se dezlipește bine chiar și pentru un copil de 3 ani — fără să se rupă, fără să se lipească înapoi.',
    icon: Hand,
    color: 'text-[#5BC4C0]',
    bg: 'bg-[#5BC4C0]/10',
  },
  {
    title: 'Nisipul vine în eprubete și pungi mici',
    desc: 'Nu în cutii sau recipiente pe care copilul să le răstoarne accidental. Eprubetele sunt mai ușor de controlat — nisipul se așează exact unde trebuie.',
    icon: Package,
    color: 'text-[#E86B9E]',
    bg: 'bg-[#E86B9E]/10',
  },
  {
    title: 'Designuri realiste',
    desc: 'Fiecare planșă arată bine și înainte, și după. Nu forme vagi și generice — desene pe care copilul vrea să le termine.',
    icon: Palette,
    color: 'text-[#B07CC6]',
    bg: 'bg-[#B07CC6]/10',
  },
  {
    title: 'Rezultatul se poate înrăma',
    desc: 'Planșa finalizată nu e o joacă de aruncat. Poate fi înrămată, pusă pe perete, dusă la bunici. E ceva de care copilul e mândru.',
    icon: Award,
    color: 'text-[#E08870]',
    bg: 'bg-[#F4A68F]/10',
  },
  {
    title: 'Produs în România',
    desc: 'Materiale verificate, standarde europene. Nu un kit copiat dintr-un catalog. Un brand căruia îi poți scrie dacă ai o problemă.',
    icon: MapPin,
    color: 'text-[#5BC4C0]',
    bg: 'bg-[#5BC4C0]/10',
  },
]

const audiences = [
  {
    title: 'Copii 2–10 ani',
    desc: 'Modele mari, simple, care dau un sentiment de reușită rapid. Primele experiențe cu culorile și textura.',
    icon: Baby,
    iconColor: 'text-[#E08870]',
    iconBg: 'bg-[#F4A68F]/15',
    border: 'border-[#F4A68F]',
    bg: 'bg-[#F4A68F]/5',
  },
  {
    title: 'Joacă acasă',
    desc: 'Înlocuiește tableta cu o activitate liniștitoare. Copilul se joacă singur sau alături de tine — fără haos, fără ecrane.',
    icon: Home,
    iconColor: 'text-[#3EA8A4]',
    iconBg: 'bg-[#5BC4C0]/15',
    border: 'border-[#5BC4C0]',
    bg: 'bg-[#5BC4C0]/5',
  },
  {
    title: 'Grădiniță & Școală',
    desc: 'Activitate recomandată de educatori. Copiii stau liniștiți, sunt implicați și se bucură de ce fac.',
    icon: BookOpen,
    iconColor: 'text-[#D04D82]',
    iconBg: 'bg-[#E86B9E]/15',
    border: 'border-[#E86B9E]',
    bg: 'bg-[#E86B9E]/5',
  },
  {
    title: 'Cadou original',
    desc: 'Un cadou care se vede, se folosește și se ține minte. Pentru orice copil între 2 și 8 ani.',
    icon: Gift,
    iconColor: 'text-[#8A5EAA]',
    iconBg: 'bg-[#B07CC6]/15',
    border: 'border-[#B07CC6]',
    bg: 'bg-[#B07CC6]/5',
  },
]

const antiMessPoints = [
  {
    title: 'Nisipul vine în eprubete',
    desc: 'Nu în pungi deschise. Copilul toarnă exact cât trebuie, fără să răstoarne accidental tot nisipul pe masă.',
  },
  {
    title: 'Scuturi planșa și nisipul cade',
    desc: 'Excesul se desprinde ușor. Pui o coală dedesubt și strângi tot în 30 de secunde.',
  },
  {
    title: 'Nisipul în exces se reutilizează',
    desc: 'Îl pui înapoi în eprubetă. Nu se pierde, nu se risipește — e gândit să dureze.',
  },
  {
    title: 'Activitate pe masă sau pe podea',
    desc: 'Se poate face oriunde. Nu trebuie un spațiu special pregătit sau echipament de curățenie.',
  },
]

const benefitsChild = [
  'Stă concentrat 30–60 de minute fără să ceară telefonul',
  'Își controlează mai bine mâna — util și când va scrie',
  'Termină ceva singur și e mândru de rezultat',
  'Se calmează prin mișcarea repetitivă cu nisipul',
  'Alege culorile și ritmul — e activitatea lui',
]

const benefitsParent = [
  '30–60 de minute de liniște — el e fericit, tu respiri',
  'Nu trebuie să stai lângă el tot timpul',
  'Activitate fără ecran pe care tu o propui',
  'Un rezultat frumos pe care îl puteți pune pe perete',
  'Un moment de creat împreună, nu de consumat separat',
]

export default function HomePage() {
  useMeta('', 'Planșe de nisip colorate pentru copii de 2–8 ani. Activitate creativă fără ecrane, gândită să funcționeze.')
  const { products } = useProductsStore()
  const { subscribe } = useNewsletterStore()
  const [testimonialIdx, setTestimonialIdx] = useState(0)
  const [email, setEmail] = useState('')
  const [subscribed, setSubscribed] = useState(false)

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

      {/* ═══ HERO ═══ */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10">

        {/* MOBILE */}
        <div className="lg:hidden flex flex-col items-center text-center px-4 sm:px-6 pt-20 pb-0 w-full">
          <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-4 py-2 rounded-full text-sm font-semibold mb-5">
            <Sparkles size={14} />
            Fără ecrane. Fără haos. Doar creativitate.
          </div>
          <h1 className="text-3xl font-bold text-[#2D2D2D] leading-tight mb-3">
            O activitate creativă pe care copilul{' '}
            <span className="text-[#5BC4C0]">o face singur — și de care e mândru.</span>
          </h1>
          <p className="text-base text-[#6B7280] mb-6 leading-relaxed max-w-sm">
            Planșe cu nisip gândite să funcționeze. Fără mizerie imposibilă. Cu un rezultat frumos la final.
          </p>
          <div className="flex gap-3 mb-8 flex-wrap justify-center">
            <Link to="/magazin" className="btn-primary text-sm px-6 py-3">
              Descoperă kiturile
              <ArrowRight size={16} />
            </Link>
            <Link to="/cum-functioneaza" className="btn-outline text-sm px-6 py-3">
              Cum funcționează?
            </Link>
          </div>
          <div className="relative w-full -mx-4 sm:-mx-6 overflow-hidden" style={{ borderRadius: '24px 24px 0 0' }}>
            <img
              src="/hero-family.png"
              alt="Copil creând o planșă cu nisip colorat"
              className="w-full object-cover object-top"
              style={{ aspectRatio: '4/5' }}
              loading="eager"
            />
            <div className="absolute bottom-4 left-4 right-4 flex justify-between">
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-card">
                <p className="font-bold text-xs">100% sigur</p>
                <p className="text-[10px] text-[#6B7280]">Testat pentru copii</p>
              </div>
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl px-3 py-2 shadow-card">
                <p className="font-bold text-xs">Produs în România</p>
                <p className="text-[10px] text-[#6B7280]">Materiale verificate</p>
              </div>
            </div>
          </div>
        </div>

        {/* DESKTOP */}
        <div className="hidden lg:grid max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-4 py-2 rounded-full text-sm font-semibold mb-6">
              <Sparkles size={14} />
              Fără ecrane. Fără haos. Doar creativitate.
            </div>
            <h1 className="text-5xl lg:text-6xl font-bold text-[#2D2D2D] leading-tight mb-6">
              O activitate creativă pe care copilul{' '}
              <span className="text-[#5BC4C0]">o face singur — și de care e mândru.</span>
            </h1>
            <p className="text-xl text-[#6B7280] mb-8 leading-relaxed max-w-lg">
              Planșe cu nisip gândite să funcționeze. Fără mizerie imposibilă. Cu un rezultat frumos pe care îl puteți pune pe perete.
            </p>
            <div className="flex flex-wrap gap-4 mb-10">
              <Link to="/magazin" className="btn-primary text-base px-8 py-4">
                Descoperă kiturile
                <ArrowRight size={18} />
              </Link>
              <Link to="/cum-functioneaza" className="btn-outline text-base px-8 py-4">
                Cum funcționează?
              </Link>
            </div>
            <div className="flex items-center gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2D2D2D]">2–10</p>
                <p className="text-xs text-[#6B7280]">Ani recomandați</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2D2D2D]">60 min</p>
                <p className="text-xs text-[#6B7280]">Concentrare medie</p>
              </div>
              <div className="w-px h-10 bg-gray-200" />
              <div className="text-center">
                <p className="text-2xl font-bold text-[#2D2D2D]">100%</p>
                <p className="text-xs text-[#6B7280]">Produs în România</p>
              </div>
            </div>
          </div>
          <div className="relative">
            <div className="relative w-full aspect-square max-w-lg mx-auto">
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-[#5BC4C0]/20 to-[#E86B9E]/20" />
              <img
                src="/hero-family.png"
                alt="Copil creând o planșă cu nisip colorat"
                className="w-full h-full object-cover rounded-3xl shadow-hover"
                loading="eager"
              />
              <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl p-4 shadow-hover">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#5BC4C0]/10 flex items-center justify-center">
                    <Star size={18} className="text-[#5BC4C0] fill-[#5BC4C0]" />
                  </div>
                  <div>
                    <p className="font-bold text-sm">Recomandat de educatori</p>
                    <p className="text-xs text-[#6B7280]">Activitate structurată</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 bg-white rounded-2xl p-4 shadow-hover">
                <div className="w-8 h-8 rounded-xl bg-[#E86B9E]/10 flex items-center justify-center mb-1.5">
                  <ShieldCheck size={18} className="text-[#E86B9E]" />
                </div>
                <p className="font-bold text-sm">100% sigur</p>
                <p className="text-xs text-[#6B7280]">Testat pentru copii</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CUM FUNCȚIONEAZĂ ═══ */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-4">Cum funcționează?</h2>
              <p className="section-subtitle mb-8">
                Fiecare planșă are suprafața acoperită cu adeziv transparent. Copilul dezlipește folia pe zone mici, presară nisipul colorat și — pas cu pas — apare o imagine completă.
              </p>
              <div className="space-y-3">
                {howItWorksSteps.map((step) => (
                  <div key={step.num} className="flex items-center gap-4 bg-white rounded-xl p-4 shadow-card">
                    <div className={`w-10 h-10 rounded-xl ${step.color} text-white flex items-center justify-center font-bold text-sm shrink-0`}>
                      {step.num}
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#2D2D2D]">{step.title}</p>
                      <p className="text-xs text-[#6B7280]">{step.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <Link to="/cum-functioneaza" className="btn-outline mt-6 inline-flex">
                Ghid complet pas cu pas
                <ArrowRight size={16} />
              </Link>
            </div>
            <div className="relative">
              <img
                src="/hero-event.png"
                alt="Copii lucrând la planșe cu nisip"
                className="w-full rounded-3xl shadow-hover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ POVESTEA (preview) ═══ */}
      <section className="py-10 md:py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#2D2D2D] to-[#3D3D3D] rounded-3xl p-8 md:p-12 text-white">
            <div className="max-w-3xl">
              <div className="inline-flex items-center gap-2 bg-white/10 text-white/80 px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
                Povestea noastră
              </div>
              <h2 className="text-2xl md:text-3xl font-bold mb-5 leading-tight">
                A început acasă, cu Filip — și cu bucuria lui.
              </h2>
              <p className="text-white/75 leading-relaxed mb-4">
                Suntem o familie care a descoperit, prin ochii copiilor, cât de multă bucurie poate aduce o activitate simplă, dar plină de culoare. Filip a fost atât de încântat de planșele cu nisip încât ne-a făcut să vedem magia din ele.
              </p>
              <p className="text-white/75 leading-relaxed mb-8">
                Apoi a venit și Iris. Îi privim cum creează împreună — cum Filip o ajută pe surioara lui, cum aleg culorile, cum, la final, sunt mândri de ce au făcut cu mânuțele lor. Sensoria Kids s-a născut din dorința de a duce mai departe această bucurie.
              </p>
              <Link
                to="/despre-noi"
                className="inline-flex items-center gap-2 bg-[#5BC4C0] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#3EA8A4] transition-colors"
              >
                Citește povestea completă
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ DE CE E DIFERIT ═══ */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Am testat fiecare detaliu. Apoi l-am îmbunătățit.</h2>
            <p className="section-subtitle max-w-2xl mx-auto">
              Fiecare detaliu al kitului are un motiv concret — venit din ore petrecute cu copiii noștri.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-5">
            {differentiators.map((d) => (
              <div key={d.title} className="card p-6 hover:-translate-y-1 transition-transform">
                <div className={`w-12 h-12 rounded-2xl ${d.bg} flex items-center justify-center mb-4`}>
                  <d.icon size={22} className={d.color} />
                </div>
                <h3 className="font-bold text-[#2D2D2D] mb-2 text-sm leading-snug">{d.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{d.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ ANTI-MESS ═══ */}
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="section-title mb-4">
                Știm că primul gând e{' '}
                <em className="text-[#6B7280] not-italic">"o să se facă dezastru"</em>.{' '}
                Nu e chiar așa.
              </h2>
              <p className="section-subtitle mb-8">
                Am gândit fiecare detaliu al kitului ca să reducem mizeria — nu să o ascundem sub fotografii frumoase.
              </p>
              <div className="space-y-5">
                {antiMessPoints.map((p) => (
                  <div key={p.title} className="flex items-start gap-4">
                    <div className="w-8 h-8 rounded-xl bg-[#5BC4C0] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={14} className="text-white" />
                    </div>
                    <div>
                      <p className="font-semibold text-sm text-[#2D2D2D] mb-0.5">{p.title}</p>
                      <p className="text-sm text-[#6B7280]">{p.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-8 p-4 bg-[#5BC4C0]/10 rounded-2xl border border-[#5BC4C0]/20">
                <p className="font-bold text-[#2D2D2D] text-center text-sm">
                  Podeaua rămâne curată. Copilul rămâne ocupat.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="/hero-event.png"
                alt="Activitate cu planșe de nisip — ordonată și liniștitoare"
                className="w-full rounded-3xl shadow-hover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PENTRU CINE E ═══ */}
      <section className="py-10 md:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Potrivit pentru orice context</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Acasă, la grădiniță sau ca idee de cadou — kiturile Sensoria Kids se adaptează ușor
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {audiences.map((a) => (
              <div key={a.title} className={`${a.bg} border-2 ${a.border} rounded-2xl p-6 hover:shadow-card transition-shadow`}>
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

      {/* ═══ BENEFICII ═══ */}
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Ce câștigă copilul. Ce câștigi tu.</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Nu e doar joacă frumoasă — e o activitate cu beneficii concrete, pentru amândoi.
            </p>
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="bg-gradient-to-br from-[#5BC4C0]/10 to-[#5BC4C0]/5 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#5BC4C0] flex items-center justify-center">
                  <Brain size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#5BC4C0] font-semibold uppercase tracking-wide">Pentru</p>
                  <h3 className="text-xl font-bold text-[#2D2D2D]">Copilul tău</h3>
                </div>
              </div>
              <ul className="space-y-3">
                {benefitsChild.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#5BC4C0] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-sm text-[#2D2D2D]">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-gradient-to-br from-[#E86B9E]/10 to-[#E86B9E]/5 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E86B9E] flex items-center justify-center">
                  <Heart size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#E86B9E] font-semibold uppercase tracking-wide">Pentru</p>
                  <h3 className="text-xl font-bold text-[#2D2D2D]">Tine, ca părinte</h3>
                </div>
              </div>
              <ul className="space-y-3">
                {benefitsParent.map((b, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E86B9E] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-sm text-[#2D2D2D]">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PRODUSE ═══ */}
      <section className="py-20 bg-gradient-to-br from-[#5BC4C0]/5 to-[#E86B9E]/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-10">
            <div>
              <h2 className="section-title mb-2">Cele mai alese kituri</h2>
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

      {/* ═══ TESTIMONIALE ═══ */}
      <section className="py-10 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Ce spun părinții</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Experiențe reale, de la părinți care au deschis deja primul kit.
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
                  <p className="text-[#2D2D2D] leading-relaxed mb-6 italic">"{t.text}"</p>
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

      {/* ═══ TRUST + ROMÂNIA ═══ */}
      <section className="py-10 md:py-16 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#5BC4C0]/10 flex items-center justify-center mx-auto mb-3">
                <MapPin size={22} className="text-[#5BC4C0]" />
              </div>
              <h3 className="font-bold text-[#2D2D2D] mb-2">Produs în România</h3>
              <p className="text-sm text-[#6B7280]">Materiale din România și UE. Standarde europene de siguranță. Un brand la care poți ajunge.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E86B9E]/10 flex items-center justify-center mx-auto mb-3">
                <ShieldCheck size={22} className="text-[#E86B9E]" />
              </div>
              <h3 className="font-bold text-[#2D2D2D] mb-2">Nisip sigur</h3>
              <p className="text-sm text-[#6B7280]">Testat și verificat. Sigur la atingere pentru copii de la 2 ani. Fără substanțe nocive.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#B07CC6]/10 flex items-center justify-center mx-auto mb-3">
                <Heart size={22} className="text-[#B07CC6]" />
              </div>
              <h3 className="font-bold text-[#2D2D2D] mb-2">Retur simplu</h3>
              <p className="text-sm text-[#6B7280]">30 de zile pentru retur dacă nu ești mulțumit. Fără întrebări complicate.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA FINAL + NEWSLETTER ═══ */}
      <section className="py-20 bg-gradient-to-br from-[#5BC4C0] to-[#3EA8A4]">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Gata să încerci?</h2>
          <p className="text-white/80 mb-6 text-lg">
            Livrare rapidă în toată România. Retur simplu în 30 de zile. Fiecare kit vine cu tot ce e nevoie.
          </p>
          <Link
            to="/magazin"
            className="inline-flex items-center gap-2 bg-white text-[#5BC4C0] font-bold px-8 py-4 rounded-xl hover:bg-gray-50 transition-colors text-base mb-12"
          >
            Descoperă kiturile
            <ArrowRight size={18} />
          </Link>

          <div className="border-t border-white/20 pt-10">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-3">
              <Mail size={24} className="text-white" />
            </div>
            <p className="text-white font-semibold mb-2">Vrei să fii primul care află?</p>
            <p className="text-white/70 text-sm mb-6">Idei de activități, oferte și produse noi — direct pe email.</p>
            {subscribed ? (
              <div className="bg-white/20 rounded-2xl p-4 text-white">
                <p className="font-bold">Mulțumim! Te-ai abonat cu succes.</p>
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
        </div>
      </section>
    </div>
  )
}
