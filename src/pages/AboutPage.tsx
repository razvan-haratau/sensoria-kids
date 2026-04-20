import { ArrowRight, Heart, MapPin, ShieldCheck, Palette, Package } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'

const madeInRomania = [
  {
    icon: Palette,
    title: 'Planșele, create de noi',
    desc: 'Avem propria mașinărie de design. Fiecare planșă este gândită și personalizată de noi, în România.',
  },
  {
    icon: MapPin,
    title: 'Nisipul, produs local',
    desc: 'Nisipul colorat folosit în fiecare kit este produs în România. Nu importăm ce găsim mai ieftin — alegem ce e mai bun.',
  },
  {
    icon: Package,
    title: 'Ambalajele, realizate local',
    desc: 'Până și pungile cu clapetă în care ajung lucrările copiilor sunt realizate de furnizori din țară. Fiecare detaliu are sens.',
  },
  {
    icon: ShieldCheck,
    title: 'Materiale sigure',
    desc: 'Nisipul este porționat în pungi mici sau eprubete — ușor de folosit, ușor de gestionat, fără să se reverse accidental.',
  },
]

export default function AboutPage() {
  useMeta(
    'Povestea Noastră',
    'Sensoria Kids a apărut din bucuria unui copil și din dorința de a duce mai departe acea magie. Aflați povestea din spatele brandului.'
  )

  return (
    <div className="min-h-screen pt-20">

      {/* ═══ HERO ═══ */}
      <section className="bg-gradient-to-br from-[#5BC4C0]/10 via-white to-[#E86B9E]/10 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-4 py-2 rounded-full text-sm font-semibold mb-6">
            Povestea noastră
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] leading-tight mb-6">
            Doi părinți, doi copii<br />
            <span className="text-[#5BC4C0]">și multă culoare.</span>
          </h1>
          <p className="text-[#6B7280] text-lg leading-relaxed max-w-2xl mx-auto">
            Sensoria Kids nu a început cu un plan de afaceri. A început cu Filip, cu bucuria lui
            și cu convingerea că o activitate simplă poate fi cu adevărat frumoasă — dacă e gândită cu grijă.
          </p>
        </div>
      </section>

      {/* ═══ POVESTEA REALĂ ═══ */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Intro */}
          <p className="text-[#6B7280] text-lg leading-relaxed mb-8">
            Suntem Irina și Răzvan, doi părinți care au descoperit, prin ochii copiilor lor, cât de multă
            bucurie poate aduce o activitate simplă, dar plină de culoare.
          </p>

          {/* Filip */}
          <div className="bg-[#5BC4C0]/8 border border-[#5BC4C0]/20 rounded-3xl p-8 mb-8">
            <p className="text-[#2D2D2D] leading-relaxed mb-4">
              Totul a început acasă, cu <strong>Filip</strong>. A fost atât de încântat de planșele cu nisip
              încât ne-a făcut să vedem magia din ele — magia pe care noi, adulții, o ratăm uneori
              prea repede.
            </p>
            <p className="text-[#6B7280] leading-relaxed">
              Apoi a venit și <strong>Iris</strong>. Și acum îi privim zilnic cum creează împreună —
              cum Filip o ajută pe surioara lui mai mică, cum aleg culorile împreună, cum, la final,
              sunt mândri de ce au făcut cu mânuțele lor.
            </p>
          </div>

          {/* Decizia */}
          <p className="text-[#6B7280] leading-relaxed mb-6">
            Așa s-a născut Sensoria Kids — din dorința noastră de a duce mai departe această bucurie
            către cât mai mulți copii. Nu ca un proiect, ci ca un act firesc: dacă asta ne-a bucurat
            pe noi atât de mult, de ce să nu existe ceva la fel de îngrijit pentru toți ceilalți?
          </p>

          {/* Citat */}
          <blockquote className="border-l-4 border-[#E86B9E] pl-6 my-10">
            <p className="text-xl text-[#2D2D2D] font-medium leading-relaxed italic">
              "Ne dorim ca părinții să aibă 30–40 de minute de liniște, iar copiii — un moment
              de creație de care să fie cu adevărat mândri."
            </p>
            <footer className="mt-3 text-sm text-[#6B7280]">Irina &amp; Răzvan, fondatori Sensoria Kids</footer>
          </blockquote>

          {/* Personalizare */}
          <p className="text-[#6B7280] leading-relaxed mb-6">
            Avem propria mașinărie de design și personalizăm fiecare planșă în funcție de eveniment —
            fie că vorbim de o zi de naștere, un atelier sau un moment special. Pentru noi, fiecare
            copil merită ceva unic, nu un design generic.
          </p>

          <p className="text-[#6B7280] leading-relaxed">
            Știm că bucuria copiilor vine la pachet cu grija părinților. De aceea am gândit totul
            astfel încât experiența să fie cât mai curată și relaxantă. Nisipul este porționat în pungi
            mici sau eprubete — ușor de folosit, ușor de gestionat, fără haos.
          </p>
        </div>
      </section>

      {/* ═══ MADE IN ROMANIA ═══ */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-3 py-1.5 rounded-full text-xs font-semibold mb-4">
              Facut cu sens, în România
            </div>
            <h2 className="text-3xl font-bold text-[#2D2D2D] mb-4">
              Facem totul de la 0, cu grijă și implicare.
            </h2>
            <p className="text-[#6B7280] max-w-xl mx-auto">
              Credem în lucrurile făcute cu sens și în valoarea lucrurilor din țara noastră.
              Nu externalizăm esența — o construim noi.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {madeInRomania.map((item) => (
              <div key={item.title} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm">
                <div className="w-10 h-10 rounded-xl bg-[#5BC4C0]/10 flex items-center justify-center mb-4">
                  <item.icon size={18} className="text-[#5BC4C0]" />
                </div>
                <h3 className="font-semibold text-[#2D2D2D] mb-2 text-sm">{item.title}</h3>
                <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CE INSEAMNA PENTRU NOI ═══ */}
      <section className="py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#E86B9E]/10 text-[#E86B9E] px-3 py-1.5 rounded-full text-xs font-semibold mb-6">
                Despre ce e Sensoria Kids, cu adevărat
              </div>
              <h2 className="text-3xl font-bold text-[#2D2D2D] mb-6 leading-tight">
                Familie, joacă și amintiri frumoase create împreună.
              </h2>
              <p className="text-[#6B7280] leading-relaxed mb-4">
                Asta e Sensoria Kids, în esență. Nu un produs. Nu un kit. Un moment.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Un moment în care copilul creează ceva cu mâinile lui, în care nu se simte ajutat
                sau corectat, în care rezultatul e al lui — și el știe asta. Și e mândru.
              </p>
            </div>
            <div className="flex flex-col gap-5">
              <div className="bg-gradient-to-br from-[#5BC4C0]/10 to-[#5BC4C0]/5 rounded-2xl p-6">
                <p className="text-3xl font-bold text-[#5BC4C0] mb-1">30–40 min</p>
                <p className="text-sm text-[#6B7280]">de liniște pentru părinți, în timp ce copilul creează</p>
              </div>
              <div className="bg-gradient-to-br from-[#E86B9E]/10 to-[#E86B9E]/5 rounded-2xl p-6">
                <Heart size={22} className="text-[#E86B9E] mb-2" />
                <p className="text-sm font-semibold text-[#2D2D2D] mb-1">Fiecare copil termină</p>
                <p className="text-xs text-[#6B7280]">Și pleacă cu ceva de care e mândru cu adevărat</p>
              </div>
              <div className="bg-gradient-to-br from-[#B07CC6]/10 to-[#B07CC6]/5 rounded-2xl p-6">
                <MapPin size={22} className="text-[#B07CC6] mb-2" />
                <p className="text-sm font-semibold text-[#2D2D2D] mb-1">100% produs în România</p>
                <p className="text-xs text-[#6B7280]">De la planșă la pungă — totul e local</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-20 bg-gradient-to-br from-[#5BC4C0]/10 to-[#E86B9E]/10">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-[#2D2D2D] mb-4">
            Asta e povestea noastră.
          </h2>
          <p className="text-[#6B7280] text-lg mb-8">
            Acum e rândul copilului tău să o trăiască pe a lui.
          </p>
          <Link
            to="/magazin"
            className="inline-flex items-center gap-2 bg-[#5BC4C0] hover:bg-[#4aadaa] text-white font-semibold px-8 py-4 rounded-2xl transition-colors shadow-lg"
          >
            Descoperă kiturile noastre
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
