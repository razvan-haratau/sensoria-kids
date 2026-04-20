import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  Check,
  Building2,
  Users,
  Clock,
  Package,
  Star,
  Phone,
  Mail,
  ChevronDown,
  Heart,
  Shield,
  Smile,
  MapPin,
  Sparkles,
  Award,
  CalendarCheck,
} from 'lucide-react'

const problemCards = [
  {
    icon: Clock,
    title: 'Evenimentele "family friendly" devin logistice',
    text: 'Animatori care nu se prezintă, activități neadaptate, copii plictisiți — tot stresul cade pe organizator.',
  },
  {
    icon: Users,
    title: 'Angajații vin cu copiii, dar nu știu cu ce să îi ocupe',
    text: 'Zona de copii devine haos. Părinții nu se pot relaxa. Evenimentul e un efort, nu o bucurie.',
  },
  {
    icon: Building2,
    title: 'HR-ul vrea impact, nu doar "am bifat family day"',
    text: 'Angajații compară. Un eveniment generic nu construiește loialitate — un moment memorabil, da.',
  },
]

const howItWorksSteps = [
  {
    number: '01',
    title: 'Noi aducem tot',
    text: 'Planșe, nisip colorat, ghiduri vizuale, mănuși, protecție pentru masă. Zero achiziții din partea ta.',
  },
  {
    number: '02',
    title: 'Montăm înainte de eveniment',
    text: 'Echipa Sensoria Kids sosește cu 30–45 minute înainte și pregătește complet stația de creație.',
  },
  {
    number: '03',
    title: 'Ghidăm copiii pas cu pas',
    text: 'Fiecare copil creează propria sa planșă de nisip colorat, ghidat de echipa noastră. Fără frustrare, fără haos.',
  },
  {
    number: '04',
    title: 'Copilul pleacă cu opera lui',
    text: 'La final, fiecare copil are o planșă terminată, personalizată, un suvenir concret de acasă.',
  },
  {
    number: '05',
    title: 'Noi strângem tot',
    text: 'La finalul activității, curățăm complet zona. Tu nu te ocupi de nimic după.',
  },
]

const whyItWorksCards = [
  {
    icon: Shield,
    title: 'Structurată și controlabilă',
    text: 'Activitatea are un flux clar: deschidere, nisip, culori, final. Copiii știu la orice moment ce urmează.',
  },
  {
    icon: Package,
    title: 'Fără mizerie real',
    text: 'Nisipul este conținut în ramă. Protecția de masă, mănușile și ghidajul elimină 95% din potențialul haos.',
  },
  {
    icon: Smile,
    title: 'Potrivit pentru vârste mixte',
    text: 'Funcționează pentru copii de 2–8 ani, simultan, cu dificultate adaptată. Nu ai nevoie de activități diferite pe grupe.',
  },
  {
    icon: Heart,
    title: 'Copiii sunt mândri',
    text: 'Fiecare copil termină. Nu există eșec. Rezultatul e vizibil, concret, frumos — și al lor.',
  },
]

const hrBenefits = [
  { text: 'Angajații simt că firma se gândește și la familia lor' },
  { text: 'Evenimentul devine un subiect de conversație după' },
  { text: 'Zero stres logistic pentru organizator' },
  { text: 'Moment memorabil, nu doar "am mers la team building"' },
  { text: 'Copiii plecă fericiți → părinții pleacă relaxați' },
  { text: 'Brandul de angajator câștigă un punct real de diferențiere' },
]

const logisticsItems = [
  { icon: Users, label: 'Capacitate', value: '10–80 copii per sesiune' },
  { icon: Clock, label: 'Durată activitate', value: '60–90 minute' },
  { icon: MapPin, label: 'Locație', value: 'Noi venim la tine (birou, sală, hotel)' },
  { icon: CalendarCheck, label: 'Disponibilitate', value: 'Weekday & weekend, inclusiv sărbători legale' },
  { icon: Package, label: 'Setup', value: 'Asigurăm tot — adusul, montajul, strânsul' },
  { icon: Award, label: 'Vârste', value: 'Copii 2–8 ani, adaptabil' },
]

const trustPoints = [
  'Creat de părinți care au testat zeci de kituri și au văzut ce funcționează',
  'Testat cu sute de copii din Romania înainte de lansare',
  'Materiale sigure, certificate, fără chimicale periculoase',
  'Echipă cu experiență în lucrul cu copii de diferite vârste',
  'Recenzii verificate de la părinți reali',
]

type FormState = {
  nume: string
  companie: string
  email: string
  telefon: string
  tipEveniment: string
  nrCopii: string
  mesaj: string
}

const initialForm: FormState = {
  nume: '',
  companie: '',
  email: '',
  telefon: '',
  tipEveniment: '',
  nrCopii: '',
  mesaj: '',
}

export default function PetreceriCorporatePage() {
  const [form, setForm] = useState<FormState>(initialForm)
  const [errors, setErrors] = useState<Partial<FormState>>({})
  const [submitted, setSubmitted] = useState(false)
  const [sending, setSending] = useState(false)

  const validate = () => {
    const e: Partial<FormState> = {}
    if (!form.nume.trim()) e.nume = 'Numele este obligatoriu.'
    if (!form.companie.trim()) e.companie = 'Compania este obligatorie.'
    if (!form.email.trim() || !/\S+@\S+\.\S+/.test(form.email)) e.email = 'Email valid obligatoriu.'
    if (!form.tipEveniment) e.tipEveniment = 'Selectează tipul evenimentului.'
    if (!form.nrCopii.trim()) e.nrCopii = 'Estimarea numărului de copii este utilă.'
    return e
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
    setErrors(prev => ({ ...prev, [e.target.name]: undefined }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const e2 = validate()
    if (Object.keys(e2).length > 0) { setErrors(e2); return }
    setSending(true)
    // Simulate send — replace with actual Supabase Edge Function call
    await new Promise(r => setTimeout(r, 1200))
    setSending(false)
    setSubmitted(true)
  }

  return (
    <div className="min-h-screen bg-white">

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-[#1a3a4a] via-[#1e4d5e] to-[#2a6070] text-white pt-32 pb-24 overflow-hidden">
        {/* decorative blobs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#5BC4C0]/10 rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-[#E86B9E]/10 rounded-full translate-y-1/2 -translate-x-1/2 pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block bg-[#5BC4C0]/20 text-[#5BC4C0] text-xs font-semibold uppercase tracking-widest px-4 py-1.5 rounded-full mb-6">
            Activitate pentru Family Day & Petreceri Corporate
          </span>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
            O activitate pentru copii pe care<br />
            <span className="text-[#5BC4C0]">angajații tăi nu o vor uita</span>
          </h1>
          <p className="text-lg sm:text-xl text-white/75 max-w-2xl mx-auto mb-10">
            Sensoria Kids aduce o stație de creație ghidată direct la evenimentul tău corporativ.
            Copiii creează. Părinții se relaxează. Tu bifezi un eveniment reușit — fără stres logistic.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="#formular"
              className="inline-flex items-center gap-2 bg-[#E86B9E] hover:bg-[#d45c8e] text-white font-semibold px-8 py-4 rounded-2xl transition-colors shadow-lg"
            >
              Solicită ofertă
              <ArrowRight size={18} />
            </a>
            <a
              href="#cum-functioneaza"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-2xl transition-colors"
            >
              Cum funcționează
              <ChevronDown size={18} />
            </a>
          </div>
          <div className="mt-12 flex flex-wrap justify-center gap-6 text-sm text-white/60">
            <span className="flex items-center gap-2"><Check size={14} className="text-[#5BC4C0]" /> Noi aducem tot</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-[#5BC4C0]" /> 10–80 copii per sesiune</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-[#5BC4C0]" /> Vârste 2–8 ani</span>
            <span className="flex items-center gap-2"><Check size={14} className="text-[#5BC4C0]" /> Fără haos</span>
          </div>
        </div>
      </section>

      {/* ── 2. PROBLEMA HR ──────────────────────────────────────────── */}
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
              Family Day-ul care a costat mult și a dezamăgit
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Îl cunoști. L-ai organizat sau l-ai văzut organizat. Iată de ce se întâmplă de obicei.
            </p>
          </div>
          <div className="grid sm:grid-cols-3 gap-6">
            {problemCards.map((card) => (
              <div key={card.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-11 h-11 rounded-xl bg-[#E86B9E]/10 flex items-center justify-center mb-4">
                  <card.icon size={20} className="text-[#E86B9E]" />
                </div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2">{card.title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. CE ESTE SENSORIA KIDS ────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5BC4C0] mb-3">Ce este</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-6">
                O stație de creație ghidată,<br />adusă la tine
              </h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                Sensoria Kids este o activitate de creație cu nisip colorat, proiectată special pentru copii de 2–8 ani.
                Fiecare copil primește o planșă, nisip colorat și ghidaj pas cu pas din partea echipei noastre.
              </p>
              <p className="text-gray-600 leading-relaxed mb-8">
                La finalul activității, fiecare copil are în mână propria operă de artă — un suvenir pe care îl va lua acasă.
                Tu nu mai organizezi nimic. Noi ne ocupăm de tot, de la transport până la curățenie.
              </p>
              <div className="flex flex-col gap-3">
                {[
                  'Activitate cu rezultat vizibil, nu joc liber',
                  'Echipa noastră ghidează fiecare copil',
                  'Durată controlabilă: 60–90 minute',
                  'Funcționează simultan pentru vârste mixte',
                ].map(item => (
                  <div key={item} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#5BC4C0]/20 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-[#5BC4C0]" />
                    </div>
                    <span className="text-sm text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10 rounded-3xl p-8 flex flex-col gap-5">
              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                <Sparkles size={22} className="text-[#5BC4C0] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-[#2D2D2D]">Copilul creează singur</div>
                  <div className="text-xs text-gray-500">Ghidat, dar cu rezultat propriu</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                <Heart size={22} className="text-[#E86B9E] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-[#2D2D2D]">Părintele se relaxează</div>
                  <div className="text-xs text-gray-500">Copilul e în mâini bune</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                <Award size={22} className="text-[#5BC4C0] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-[#2D2D2D]">Fiecare copil termină</div>
                  <div className="text-xs text-gray-500">Niciun copil nu pleacă fără planșa lui</div>
                </div>
              </div>
              <div className="flex items-center gap-4 bg-white rounded-2xl p-4 shadow-sm">
                <Building2 size={22} className="text-[#E86B9E] shrink-0" />
                <div>
                  <div className="text-sm font-semibold text-[#2D2D2D]">Tu ieși bine</div>
                  <div className="text-xs text-gray-500">Eveniment memorabil, zero stres</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 4. CUM FUNCȚIONEAZĂ ─────────────────────────────────────── */}
      <section id="cum-functioneaza" className="py-20 bg-[#fafafa]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5BC4C0] mb-3">Procesul</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
              Tu nu faci nimic — noi facem tot
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              De la confirmare până la curățenie, ne ocupăm noi. Tot ce trebuie să faci tu este să confirmi data.
            </p>
          </div>
          <div className="flex flex-col gap-6">
            {howItWorksSteps.map((step, i) => (
              <div key={step.number} className="flex gap-6 items-start">
                <div className="flex-shrink-0 w-14 h-14 rounded-2xl bg-[#5BC4C0] flex items-center justify-center text-white font-bold text-lg">
                  {step.number}
                </div>
                <div className="flex-1 bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
                  <h3 className="font-semibold text-[#2D2D2D] mb-1">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.text}</p>
                </div>
                {i < howItWorksSteps.length - 1 && (
                  <div className="hidden sm:block" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 5. DE CE FUNCȚIONEAZĂ ───────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E86B9E] mb-3">De ce funcționează</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
              Activitate creativă fără haos
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Știm că "mizerie" și "corporativ" nu merg împreună. De aceea am proiectat activitatea să fie controlabilă, curată și plăcută pentru toată lumea.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyItWorksCards.map((card) => (
              <div key={card.title} className="text-center p-6 rounded-2xl border border-gray-100 hover:border-[#5BC4C0]/30 hover:shadow-md transition-all">
                <div className="w-12 h-12 rounded-2xl bg-[#5BC4C0]/10 flex items-center justify-center mx-auto mb-4">
                  <card.icon size={22} className="text-[#5BC4C0]" />
                </div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2 text-sm">{card.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{card.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 6. BENEFICII HR ─────────────────────────────────────────── */}
      <section className="py-20 bg-gradient-to-br from-[#1a3a4a] to-[#2a6070] text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-14 items-center">
            <div>
              <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5BC4C0] mb-3">Valoare HR</span>
              <h2 className="text-3xl sm:text-4xl font-bold mb-6">
                Ce câștigă compania ta
              </h2>
              <p className="text-white/70 leading-relaxed mb-8">
                Un eveniment corporativ cu copii nu este doar un beneficiu — este un semnal clar că firma se gândește la familia angajatului, nu doar la angajat.
                Asta construiește loialitate reală.
              </p>
              <div className="flex flex-col gap-4">
                {hrBenefits.map((b) => (
                  <div key={b.text} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#5BC4C0]/20 flex items-center justify-center shrink-0">
                      <Check size={12} className="text-[#5BC4C0]" />
                    </div>
                    <span className="text-sm text-white/85">{b.text}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white/10 rounded-3xl p-8 backdrop-blur-sm border border-white/10">
              <div className="flex items-center gap-3 mb-6">
                <Star size={20} className="text-[#5BC4C0] fill-[#5BC4C0]" />
                <span className="font-semibold text-white">Ce spun organizatorii</span>
              </div>
              <blockquote className="text-white/85 text-base italic leading-relaxed mb-6">
                "Am organizat Family Day-ul anual și, pentru prima dată, nimeni nu s-a plâns că nu are cu ce ocupa copiii.
                Echipa Sensoria a gestionat totul — eu n-am intervenit deloc în zona lor."
              </blockquote>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5BC4C0]/20 flex items-center justify-center">
                  <Users size={16} className="text-[#5BC4C0]" />
                </div>
                <div>
                  <div className="text-sm font-semibold text-white">Andreea M.</div>
                  <div className="text-xs text-white/50">HR Manager, București</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 7. LOGISTICĂ ────────────────────────────────────────────── */}
      <section className="py-20 bg-[#fafafa]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5BC4C0] mb-3">Logistică</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
              Tot ce trebuie să știi
            </h2>
            <p className="text-gray-500 max-w-xl mx-auto">
              Detalii practice pentru ca tu să poți lua o decizie rapid și cu încredere.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {logisticsItems.map((item) => (
              <div key={item.label} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[#5BC4C0]/10 flex items-center justify-center shrink-0">
                  <item.icon size={18} className="text-[#5BC4C0]" />
                </div>
                <div>
                  <div className="text-xs text-gray-400 font-medium uppercase tracking-wide mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-[#2D2D2D]">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
          <p className="text-center text-sm text-gray-400 mt-8">
            Ai nevoie de un număr mai mare de copii sau de mai multe sesiuni paralele?
            <a href="#formular" className="text-[#5BC4C0] hover:underline ml-1">Scrie-ne și personalizăm oferta.</a>
          </p>
        </div>
      </section>

      {/* ── 8. ÎNCREDERE ────────────────────────────────────────────── */}
      <section className="py-20 bg-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#E86B9E] mb-3">De ce Sensoria Kids</span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-10">
            Construit de părinți, testat de copii
          </h2>
          <div className="flex flex-col gap-4 text-left max-w-2xl mx-auto">
            {trustPoints.map((point) => (
              <div key={point} className="flex items-start gap-4 bg-[#fafafa] rounded-2xl p-4">
                <div className="w-6 h-6 rounded-full bg-[#5BC4C0]/20 flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={13} className="text-[#5BC4C0]" />
                </div>
                <span className="text-sm text-gray-700 leading-relaxed">{point}</span>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap justify-center gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-[#5BC4C0]">500+</div>
              <div className="text-xs text-gray-500 mt-1">Copii care au creat cu Sensoria</div>
            </div>
            <div className="w-px bg-gray-200 hidden sm:block" />
            <div>
              <div className="text-3xl font-bold text-[#5BC4C0]">4.9</div>
              <div className="text-xs text-gray-500 mt-1">Rating mediu de la părinți</div>
            </div>
            <div className="w-px bg-gray-200 hidden sm:block" />
            <div>
              <div className="text-3xl font-bold text-[#5BC4C0]">100%</div>
              <div className="text-xs text-gray-500 mt-1">Copii care termină activitatea</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 9. CTA INTERMEDIAR ──────────────────────────────────────── */}
      <section className="py-16 bg-[#E86B9E]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">
            Gata să organizezi un Family Day pe care angajații îl vor ține minte?
          </h2>
          <p className="text-white/80 mb-8 max-w-xl mx-auto">
            Completează formularul de mai jos și îți trimitem o ofertă personalizată în 24 de ore.
          </p>
          <a
            href="#formular"
            className="inline-flex items-center gap-2 bg-white text-[#E86B9E] font-semibold px-8 py-4 rounded-2xl hover:bg-white/90 transition-colors shadow-lg"
          >
            Solicită ofertă gratuită
            <ArrowRight size={18} />
          </a>
        </div>
      </section>

      {/* ── 10. FORMULAR ────────────────────────────────────────────── */}
      <section id="formular" className="py-24 bg-[#fafafa]">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-[#5BC4C0] mb-3">Contact</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#2D2D2D] mb-4">
              Solicită oferta ta
            </h2>
            <p className="text-gray-500">
              Completează formularul și te contactăm în maximum 24 de ore cu o ofertă adaptată evenimentului tău.
            </p>
          </div>

          {submitted ? (
            <div className="bg-white rounded-3xl border border-[#5BC4C0]/30 p-12 text-center shadow-sm">
              <div className="w-16 h-16 rounded-full bg-[#5BC4C0]/10 flex items-center justify-center mx-auto mb-6">
                <Check size={28} className="text-[#5BC4C0]" />
              </div>
              <h3 className="text-2xl font-bold text-[#2D2D2D] mb-3">Cerere trimisă cu succes!</h3>
              <p className="text-gray-500 mb-8">
                Am primit solicitarea ta. Un coleg din echipa Sensoria Kids te va contacta în cel mult 24 de ore.
              </p>
              <Link
                to="/"
                className="inline-flex items-center gap-2 bg-[#5BC4C0] hover:bg-[#4aadaa] text-white font-semibold px-6 py-3 rounded-xl transition-colors"
              >
                Înapoi acasă
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-8 flex flex-col gap-5">
              {/* Row 1: Nume + Companie */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                    Nume <span className="text-[#E86B9E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="nume"
                    value={form.nume}
                    onChange={handleChange}
                    placeholder="Andreea Popescu"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#5BC4C0] ${errors.nume ? 'border-[#E86B9E]' : 'border-gray-200'}`}
                  />
                  {errors.nume && <p className="text-xs text-[#E86B9E] mt-1">{errors.nume}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                    Companie <span className="text-[#E86B9E]">*</span>
                  </label>
                  <input
                    type="text"
                    name="companie"
                    value={form.companie}
                    onChange={handleChange}
                    placeholder="Compania SRL"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#5BC4C0] ${errors.companie ? 'border-[#E86B9E]' : 'border-gray-200'}`}
                  />
                  {errors.companie && <p className="text-xs text-[#E86B9E] mt-1">{errors.companie}</p>}
                </div>
              </div>

              {/* Row 2: Email + Telefon */}
              <div className="grid sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                    Email <span className="text-[#E86B9E]">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    placeholder="andreea@companie.ro"
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#5BC4C0] ${errors.email ? 'border-[#E86B9E]' : 'border-gray-200'}`}
                  />
                  {errors.email && <p className="text-xs text-[#E86B9E] mt-1">{errors.email}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                    Telefon <span className="text-gray-400 text-xs font-normal">(opțional)</span>
                  </label>
                  <input
                    type="tel"
                    name="telefon"
                    value={form.telefon}
                    onChange={handleChange}
                    placeholder="07xx xxx xxx"
                    className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#5BC4C0]"
                  />
                </div>
              </div>

              {/* Tip eveniment */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                  Tip eveniment <span className="text-[#E86B9E]">*</span>
                </label>
                <div className="relative">
                  <select
                    name="tipEveniment"
                    value={form.tipEveniment}
                    onChange={handleChange}
                    className={`w-full border rounded-xl px-4 py-3 text-sm outline-none appearance-none transition-colors focus:border-[#5BC4C0] bg-white ${errors.tipEveniment ? 'border-[#E86B9E]' : 'border-gray-200'}`}
                  >
                    <option value="">Selectează tipul evenimentului</option>
                    <option value="family-day">Family Day corporativ</option>
                    <option value="petrecere-copii">Petrecere pentru copiii angajaților</option>
                    <option value="craciun">Petrecere de Crăciun</option>
                    <option value="teambuilding-familii">Team building cu familii</option>
                    <option value="zi-de-nastere">Zi de naștere corporativă</option>
                    <option value="altul">Altul</option>
                  </select>
                  <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                </div>
                {errors.tipEveniment && <p className="text-xs text-[#E86B9E] mt-1">{errors.tipEveniment}</p>}
              </div>

              {/* Nr copii */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                  Număr estimativ de copii <span className="text-[#E86B9E]">*</span>
                </label>
                <input
                  type="text"
                  name="nrCopii"
                  value={form.nrCopii}
                  onChange={handleChange}
                  placeholder="ex. 20–30 copii"
                  className={`w-full border rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#5BC4C0] ${errors.nrCopii ? 'border-[#E86B9E]' : 'border-gray-200'}`}
                />
                {errors.nrCopii && <p className="text-xs text-[#E86B9E] mt-1">{errors.nrCopii}</p>}
              </div>

              {/* Mesaj */}
              <div>
                <label className="block text-sm font-medium text-[#2D2D2D] mb-1.5">
                  Detalii suplimentare <span className="text-gray-400 text-xs font-normal">(opțional)</span>
                </label>
                <textarea
                  name="mesaj"
                  value={form.mesaj}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Dată estimativă, locație, alte detalii relevante..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none transition-colors focus:border-[#5BC4C0] resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full bg-[#E86B9E] hover:bg-[#d45c8e] disabled:opacity-60 text-white font-semibold py-4 rounded-2xl transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                {sending ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Se trimite...
                  </>
                ) : (
                  <>
                    Trimite cererea
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              <p className="text-xs text-gray-400 text-center">
                Datele tale sunt confidențiale și nu vor fi utilizate în alte scopuri.
                <Link to="/confidentialitate" className="text-[#5BC4C0] hover:underline ml-1">Politica de confidențialitate</Link>
              </p>
            </form>
          )}

          {/* Alternate contact */}
          <div className="mt-8 text-center text-sm text-gray-400">
            Preferi să vorbești direct?
            <a href="tel:+40700000000" className="text-[#2D2D2D] font-medium hover:text-[#5BC4C0] transition-colors ml-1 inline-flex items-center gap-1">
              <Phone size={14} />
              Sună-ne
            </a>
            <span className="mx-2">sau</span>
            <a href="mailto:contact@sensoriakids.ro" className="text-[#2D2D2D] font-medium hover:text-[#5BC4C0] transition-colors inline-flex items-center gap-1">
              <Mail size={14} />
              Scrie-ne
            </a>
          </div>
        </div>
      </section>
    </div>
  )
}
