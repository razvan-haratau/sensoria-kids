import { ArrowRight, Check, AlertCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'

const steps = [
  {
    num: 1,
    title: 'Pregătești spațiul',
    desc: 'Pune o coală mare de hârtie sau o tavă sub planșă. Asta e tot ce ai nevoie — nisipul în exces va cădea pe ea și îl strângi ușor la final.',
    tip: 'Nu e nevoie de o masă specială. Merge pe orice suprafață plată.',
    color: 'bg-[#F4A68F]',
  },
  {
    num: 2,
    title: 'Alegi prima zonă',
    desc: 'Uită-te la planșă și alege o zonă mică — de preferință una cu contur clar. Dezlipești folia doar de pe acea zonă, nu de pe toată planșa.',
    tip: 'Important: dezlipești doar o zonă mică odată. Dacă lași adezivul expus prea mult, prinde praf.',
    color: 'bg-[#E86B9E]',
  },
  {
    num: 3,
    title: 'Presari nisipul',
    desc: 'Iei tubul cu culoarea potrivită și presari nisipul peste zona dezlipită. Acoperi tot adezivul expus — nu trebuie să fie uniform perfect.',
    tip: 'Copilul poate folosi și degetul să împingă ușor nisipul spre margini.',
    color: 'bg-[#5BC4C0]',
  },
  {
    num: 4,
    title: 'Scuturi excesul',
    desc: 'Ții planșa ușor înclinată și o scuturi ușor — nisipul în exces cade pe coala de dedesubt. Ce rămâne pe planșă e exact ce trebuie.',
    tip: 'Nisipul căzut îl poți strânge înapoi în tub. Nu se pierde.',
    color: 'bg-[#B07CC6]',
  },
  {
    num: 5,
    title: 'Repeți pe culori',
    desc: 'Treci la următoarea zonă și culoare. Lucrezi zonă cu zonă, culoare cu culoare — la final desenul e complet.',
    tip: 'Nu e nevoie să urmezi o ordine anume. Copilul poate alege el ordinea culorilor.',
    color: 'bg-[#5BC4C0]',
  },
  {
    num: 6,
    title: 'Verifici și finalizezi',
    desc: 'Când crezi că ai terminat, uită-te atent dacă mai sunt zone neacoperite. Completezi cu o cantitate mică de nisip acolo unde e nevoie.',
    tip: 'Lasă planșa câteva minute înainte să o muți — nisipul se așează mai bine.',
    color: 'bg-[#E86B9E]',
  },
]

const antiMessTips = [
  'Pune întotdeauna o coală sau o tavă sub planșă — strângi tot nisipul în 30 de secunde',
  'Dezlipește folia doar pe o zonă mică odată — adezivul expus prinde praf rapid',
  'Folosește tuburile cu grijă — toarnă puțin, nu mult. Poți adăuga, nu poți lua înapoi',
  'Strânge nisipul în exces înapoi în tub după fiecare zonă — nu se pierde',
  'Dacă nisipul ajunge pe o zonă greșită, suflă ușor cu gura — se îndepărtează ușor',
]

const mistakes = [
  {
    mistake: 'Dezlipești toată folia deodată',
    why: 'Adezivul expus prinde praf, mâini, orice — și zona nu mai e curată. Lucrul pe zone mici e esențial.',
  },
  {
    mistake: 'Torni prea mult nisip dintr-o dată',
    why: 'Se risipește și e greu de controlat. Mai bine puțin de două ori decât mult o dată.',
  },
  {
    mistake: 'Alegi o planșă prea dificilă pentru vârsta copilului',
    why: 'Dacă zonele sunt prea mici sau prea multe, copilul se frustrează și renunță. Verifică vârsta recomandată.',
  },
]

const ageGuide = [
  {
    age: '2–4 ani',
    color: '#F4A68F',
    tips: [
      'Planșe cu zone mari și contur gros',
      'Maximum 4 culori pe planșă',
      'Stai lângă copil și dezlipești tu folia',
      'El aplică nisipul — asta e partea lui',
    ],
  },
  {
    age: '4–6 ani',
    color: '#5BC4C0',
    tips: [
      'Poate dezlipi singur folia pe zone mai mari',
      'Planșe cu 6–8 culori și detalii medii',
      'Poate lucra singur cu puțină supraveghere',
      'Durata activității: 30–50 minute',
    ],
  },
  {
    age: '6–10 ani',
    color: '#B07CC6',
    tips: [
      'Lucrează complet independent',
      'Planșe cu detalii fine și mai multe culori',
      'Poate combina tehnici și face variații',
      'Durata activității: 45–60+ minute',
    ],
  },
]

export default function CumFunctioneazaPage() {
  useMeta(
    'Cum Funcționează',
    'Ghid complet pas cu pas pentru planșele cu nisip Sensoria Kids — cum se folosesc, sfaturi anti-mizerie și greșeli de evitat.'
  )

  return (
    <div className="min-h-screen pt-20">

      {/* ═══ HERO ═══ */}
      <section className="bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10 py-16">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Ghid de utilizare
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] mb-4 leading-tight">
            Cum se folosesc planșele cu nisip
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed">
            Un ghid complet — de la deschiderea cutiei până la planșa finalizată, gata de pus pe perete.
          </p>
        </div>
      </section>

      {/* ═══ CE CONȚINE KITUL ═══ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4 text-center">Ce găsești în cutie</h2>
          <p className="section-subtitle text-center mb-10">
            Fiecare kit Sensoria Kids conține tot ce e necesar. Nu trebuie să cumperi nimic separat.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 max-w-2xl mx-auto">
            {[
              { item: 'Planșele cu desen', detail: 'Cu adeziv gata aplicat sub folie protectoare' },
              { item: 'Eprubete de nisip colorat', detail: 'Câte o culoare per eprubetă, ușor de controlat' },
              { item: 'Instrucțiuni clare', detail: 'Pagina A4 cu pași vizuali — o pui dedesubt ca foaie de lucru' },
              { item: 'Folie de protecție', detail: 'Pungă cu clapetă în care introduci planșa finalizată' },
            ].map((c) => (
              <div key={c.item} className="flex items-start gap-3 bg-gray-50 rounded-2xl p-4">
                <div className="w-6 h-6 rounded-full bg-[#5BC4C0] flex items-center justify-center shrink-0 mt-0.5">
                  <Check size={12} className="text-white" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2D2D2D]">{c.item}</p>
                  <p className="text-xs text-[#6B7280] mt-0.5">{c.detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ PAȘI ═══ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4 text-center">Ghid pas cu pas</h2>
          <p className="section-subtitle text-center mb-12">
            6 pași simpli, pe care un copil de 4 ani îi poate urma singur.
          </p>
          <div className="space-y-6">
            {steps.map((step) => (
              <div key={step.num} className="bg-white rounded-2xl p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl ${step.color} text-white flex items-center justify-center font-bold text-lg shrink-0`}>
                    {step.num}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-bold text-[#2D2D2D] mb-2">{step.title}</h3>
                    <p className="text-[#6B7280] text-sm leading-relaxed mb-3">{step.desc}</p>
                    <div className="flex items-start gap-2 bg-[#5BC4C0]/5 rounded-xl px-3 py-2">
                      <span className="text-[#5BC4C0] text-xs font-bold shrink-0 mt-0.5">Sfat</span>
                      <p className="text-xs text-[#6B7280]">{step.tip}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SFATURI ANTI-MIZERIE ═══ */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#5BC4C0]/10 to-[#5BC4C0]/5 rounded-3xl p-8 md:p-10">
            <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Cum păstrezi ordinea</h2>
            <p className="text-[#6B7280] mb-8">
              Nisipul nu trebuie să fie o problemă. Dacă urmezi aceste sfaturi, curățenia durează sub un minut.
            </p>
            <div className="space-y-3">
              {antiMessTips.map((tip, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-[#5BC4C0] flex items-center justify-center shrink-0 mt-0.5">
                    <Check size={11} className="text-white" />
                  </div>
                  <p className="text-sm text-[#2D2D2D]">{tip}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 p-4 bg-white rounded-2xl text-center">
              <p className="font-bold text-[#2D2D2D]">
                Podeaua rămâne curată. Copilul rămâne ocupat.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ GREȘELI DE EVITAT ═══ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4 text-center">Greșeli de evitat</h2>
          <p className="section-subtitle text-center mb-10">
            Cele mai frecvente probleme și de ce apar — ca să nu le trăiești tu.
          </p>
          <div className="space-y-4">
            {mistakes.map((m, i) => (
              <div key={i} className="bg-white rounded-2xl p-5 shadow-card flex items-start gap-4">
                <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center shrink-0 mt-0.5">
                  <AlertCircle size={16} className="text-orange-400" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#2D2D2D] mb-1">{m.mistake}</p>
                  <p className="text-sm text-[#6B7280]">{m.why}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ GHID PE VÂRSTE ═══ */}
      <section className="py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4 text-center">Ghid pe vârste</h2>
          <p className="section-subtitle text-center mb-10">
            Cum se adaptează activitatea în funcție de vârsta copilului
          </p>
          <div className="grid md:grid-cols-3 gap-6">
            {ageGuide.map((ag) => (
              <div key={ag.age} className="rounded-2xl p-6 border-2" style={{ borderColor: ag.color, backgroundColor: `${ag.color}08` }}>
                <div className="inline-block px-3 py-1 rounded-full text-white text-sm font-bold mb-4" style={{ backgroundColor: ag.color }}>
                  {ag.age}
                </div>
                <ul className="space-y-2">
                  {ag.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <div className="w-4 h-4 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ backgroundColor: ag.color }}>
                        <Check size={9} className="text-white" />
                      </div>
                      <span className="text-xs text-[#2D2D2D]">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CUM PĂSTREZI PLANȘA ═══ */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="section-title mb-4 text-center">Cum păstrezi planșa finalizată</h2>
          <p className="section-subtitle text-center mb-10">
            Planșa nu e o joacă de aruncat. Poate fi ținută minte mult timp.
          </p>
          <div className="grid sm:grid-cols-3 gap-6">
            <div className="bg-white rounded-2xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#5BC4C0]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">1</span>
              </div>
              <h3 className="font-bold text-[#2D2D2D] mb-2">Lasă să se așeze</h3>
              <p className="text-sm text-[#6B7280]">Câteva minute după finalizare, ca nisipul să se stabilizeze pe adeziv.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#E86B9E]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">2</span>
              </div>
              <h3 className="font-bold text-[#2D2D2D] mb-2">Introduci desenul în pungă</h3>
              <p className="text-sm text-[#6B7280]">Introduci planșa în punga cu clapetă primită în kit — o protejează și e gata de dăruit sau expus.</p>
            </div>
            <div className="bg-white rounded-2xl p-6 shadow-card text-center">
              <div className="w-12 h-12 rounded-2xl bg-[#B07CC6]/10 flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">3</span>
              </div>
              <h3 className="font-bold text-[#2D2D2D] mb-2">Pune în ramă</h3>
              <p className="text-sm text-[#6B7280]">Orice ramă standard se potrivește. Planșa finalizată arată bine pe perete.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Gata să începi?</h2>
          <p className="section-subtitle mb-8">
            Alege kitul potrivit pentru vârsta copilului tău și deschideți-l împreună.
          </p>
          <Link to="/magazin" className="btn-primary text-base px-8 py-4">
            Descoperă kiturile
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
