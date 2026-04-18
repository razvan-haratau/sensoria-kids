import { ArrowRight, Check, Heart, Star, Users, Leaf, ShieldCheck, MapPin } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'

const improvements = [
  {
    problem: 'Folia se rupea la dezlipire',
    solution: 'Am testat zeci de tipuri de folie până am găsit una care se dezlipește ușor, chiar și pentru un copil de 3 ani.',
  },
  {
    problem: 'Nisipul se împrăștia peste tot',
    solution: 'Am trecut de la pungi la tuburi. Copilul toarnă exact cât trebuie, controlat, fără să răstoarne accidental.',
  },
  {
    problem: 'Designurile arătau slab la final',
    solution: 'Am refăcut fiecare desen. Fiecare planșă trebuie să arate bine și înainte de activitate, și după.',
  },
  {
    problem: 'Rezultatul final nu merita păstrat',
    solution: 'Acum fiecare planșă finalizată poate fi înrămată. E ceva de care copilul e mândru, nu ceva de aruncat.',
  },
  {
    problem: 'Instrucțiunile erau neclare',
    solution: 'Am scris instrucțiuni clare, vizuale, pe care un copil de 4 ani le poate urmări singur.',
  },
]

const values = [
  {
    icon: Heart,
    title: 'Experiența contează',
    desc: 'Nu ne interesează doar cum arată produsul în cutie. Ne interesează cum se simte când îl folosești.',
    color: 'text-[#E86B9E]',
  },
  {
    icon: Star,
    title: 'Calitate reală',
    desc: 'Materiale de calitate, testate și sigure pentru copii. Fiecare detaliu a trecut printr-o întrebare simplă: funcționează?',
    color: 'text-[#5BC4C0]',
  },
  {
    icon: Users,
    title: 'Creat de părinți',
    desc: 'Am construit Sensoria Kids ca părinți, nu ca brand. Știm exact ce frustrări apar și ce ne dorim noi înșine de la un kit.',
    color: 'text-[#B07CC6]',
  },
  {
    icon: Leaf,
    title: 'Responsabilitate',
    desc: 'Ambalaje eco, producție locală, materiale din România și UE. Facem lucrurile cu grijă față de copii și față de mediu.',
    color: 'text-[#5BC4C0]',
  },
]

export default function AboutPage() {
  useMeta('Povestea Noastră', 'Cum a apărut Sensoria Kids — un brand românesc de planșe cu nisip, creat din frustrarea unui kit dezamăgitor și dorința de a face ceva mai bun.')

  return (
    <div className="min-h-screen pt-20">

      {/* ═══ HERO ═══ */}
      <section className="bg-gradient-to-br from-[#5BC4C0]/10 via-white to-[#E86B9E]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Povestea noastră
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] leading-tight mb-6">
                Creat de părinți pentru părinți,{' '}
                <span className="text-[#5BC4C0]">ales de copii pentru copii.</span>
              </h1>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-4">
                Sensoria Kids a apărut dintr-o experiență concretă, neplăcută, pe care o cunoaște orice părinte care a cumpărat vreodată un kit de planșe cu nisip importat.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Nu am vrut să construim un brand. Am vrut să facem o activitate care chiar funcționează — pentru copilul nostru, și pentru toți ceilalți.
              </p>
            </div>
            <div className="relative">
              <img
                src="/hero-family.png"
                alt="Familia Sensoria Kids — fondatorii cu fiul Filip"
                className="w-full rounded-3xl shadow-hover"
              />
              <div className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-5 shadow-hover">
                <p className="font-bold text-2xl text-[#5BC4C0]">2025</p>
                <p className="text-sm text-[#6B7280]">Anul fondării</p>
              </div>
              <div className="absolute -top-6 -right-6 bg-white rounded-2xl p-5 shadow-hover">
                <p className="font-bold text-2xl text-[#E86B9E]">100%</p>
                <p className="text-sm text-[#6B7280]">Produs în România</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ EXPERIENȚA PROASTĂ ═══ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="inline-flex items-center gap-2 bg-gray-100 text-[#6B7280] px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
            De unde a început
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#2D2D2D] mb-8 leading-tight">
            Filip a renunțat la jumătate. Atunci ne-am dat seama că problema e kitul, nu el.
          </h2>

          <div className="grid md:grid-cols-2 gap-8 mb-10">
            <div>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Eram entuziasmați când am cumpărat primul kit de planșe cu nisip pentru Filip. Părea simplu, frumos, o activitate perfectă pentru o după-amiază acasă.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Realitatea a fost alta. Folia nu se dezlipea — se rupea în bucăți mici și lăsa adezivul expus la praf. Nisipul venea într-o pungă pe care Filip a răsturnat-o accidental în 30 de secunde. Designul arăta vag și nesatisfăcător.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                La jumătatea planșei, Filip s-a plictisit și a renunțat. Nu era atenția lui scurtă. Era kitul prost gândit.
              </p>
            </div>
            <div>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Ceea ce ne-a frustrat cel mai mult nu a fost că am dat bani degeaba. A fost că o idee bună fusese executată atât de neglijent.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Planșele cu nisip pot fi o activitate extraordinară pentru copii. Textura, culorile, concentrarea, rezultatul final — toate sunt reale. Dar un kit prost transforma toate astea în frustrare.
              </p>
              <p className="text-[#2D2D2D] font-semibold leading-relaxed">
                Atunci am luat decizia: construim kitul pe care ni l-am fi dorit noi.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ PROCESUL DE ÎMBUNĂTĂȚIRE ═══ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              Cum am construit
            </div>
            <h2 className="text-3xl font-bold text-[#2D2D2D] mb-4">
              Fiecare problemă din kitul original a primit un răspuns concret.
            </h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">
              Nu am schimbat ambalajul și am chemat-o îmbunătățire. Am luat fiecare punct de frustrare și am găsit o soluție reală.
            </p>
          </div>

          <div className="space-y-4">
            {improvements.map((item, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 shadow-card grid md:grid-cols-2 gap-4 items-center">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-red-400 text-xs font-bold">✕</span>
                  </div>
                  <p className="text-sm text-[#6B7280] italic">"{item.problem}"</p>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#5BC4C0] flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={12} className="text-white" />
                  </div>
                  <p className="text-sm text-[#2D2D2D] font-medium">{item.solution}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10 rounded-2xl p-6 text-center">
            <p className="text-[#2D2D2D] font-semibold text-lg">
              La fiecare decizie de produs, o singură întrebare:{' '}
              <span className="text-[#5BC4C0]">face asta experiența mai bună?</span>
            </p>
          </div>
        </div>
      </section>

      {/* ═══ MISIUNEA AZI ═══ */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E86B9E]/10 text-[#E86B9E] px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
                Misiunea noastră
              </div>
              <h2 className="text-3xl font-bold text-[#2D2D2D] mb-6">
                Nu vindem un board cu nisip. Vindem o experiență care merită trăită.
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Sensoria Kids este un brand românesc, construit de o familie care a înțeles că cel mai bun test pentru un produs e propria ta experientă cu el.
              </p>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Filip a continuat să ne ajute — să ne arate ce merge, ce nu, ce e plictisitor și ce îl ține concentrat mai mult de 10 minute. El e cel mai sincer tester pe care l-am putut avea.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Azi, fiecare kit Sensoria Kids e gândit cu aceeași întrebare: dacă Filip ar deschide cutia asta mâine dimineață, ar termina planșa?
              </p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#5BC4C0]/10 rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#5BC4C0] flex items-center justify-center mx-auto mb-3">
                  <MapPin size={18} className="text-white" />
                </div>
                <p className="font-bold text-[#2D2D2D] text-sm mb-1">Produs în România</p>
                <p className="text-xs text-[#6B7280]">Materiale locale și europene</p>
              </div>
              <div className="bg-[#E86B9E]/10 rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#E86B9E] flex items-center justify-center mx-auto mb-3">
                  <ShieldCheck size={18} className="text-white" />
                </div>
                <p className="font-bold text-[#2D2D2D] text-sm mb-1">Standarde europene</p>
                <p className="text-xs text-[#6B7280]">Sigur pentru copii de la 2 ani</p>
              </div>
              <div className="bg-[#B07CC6]/10 rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#B07CC6] flex items-center justify-center mx-auto mb-3">
                  <Users size={18} className="text-white" />
                </div>
                <p className="font-bold text-[#2D2D2D] text-sm mb-1">Testat cu copii reali</p>
                <p className="text-xs text-[#6B7280]">Inclusiv cu Filip, de la început</p>
              </div>
              <div className="bg-[#F4A68F]/10 rounded-2xl p-6 text-center">
                <div className="w-10 h-10 rounded-xl bg-[#F4A68F] flex items-center justify-center mx-auto mb-3">
                  <Heart size={18} className="text-white" />
                </div>
                <p className="font-bold text-[#2D2D2D] text-sm mb-1">Experiență înainte de toate</p>
                <p className="text-xs text-[#6B7280]">Fiecare detaliu are un motiv</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ VALORILE NOASTRE ═══ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Ce ne ghidează</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              Principiile care stau în spatele fiecărei decizii de produs
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((v) => (
              <div key={v.title} className="card p-6 text-center">
                <v.icon size={32} className={`${v.color} mx-auto mb-4`} />
                <h3 className="font-bold text-lg text-[#2D2D2D] mb-2">{v.title}</h3>
                <p className="text-sm text-[#6B7280] leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CITAT ECHIPĂ ═══ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-20 h-20 rounded-full bg-gradient-to-br from-[#5BC4C0] to-[#E86B9E] mx-auto mb-6 flex items-center justify-center text-white text-2xl font-bold shadow-soft">
            SK
          </div>
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Echipa Sensoria Kids</h2>
          <p className="text-[#6B7280] text-sm mb-8">Fondatori & Creatori — România</p>
          <blockquote className="text-xl text-[#2D2D2D] leading-relaxed max-w-2xl mx-auto mb-6">
            "Am creat Sensoria Kids pentru că am trăit exact ce trăiesc clienții noștri. Știm cum arată dezamăgirea unui copil care renunță la o activitate. Și știm cum arată bucuria unuia care termină ceva singur și e mândru de el."
          </blockquote>
          <p className="text-sm text-[#6B7280]">
            Suntem o echipă mică din România. Fiecare produs e gândit cu grijă — pentru că știm că în spatele fiecărei comenzi e un copil care merită o experiență mai bună.
          </p>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Asta e povestea noastră.</h2>
          <p className="section-subtitle mb-8">
            Acum e rândul copilului tău să o trăiască pe a lui.
          </p>
          <Link to="/magazin" className="btn-primary text-base px-8 py-4">
            Descoperă kiturile noastre
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
