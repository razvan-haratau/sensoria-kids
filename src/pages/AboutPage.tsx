import { ArrowRight, Heart, Star, Users, Leaf, ClipboardList, Search, Pencil, Palette, Award, GraduationCap, UserRound, Check } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useMeta } from '../hooks/useMeta'

const steps = [
  {
    num: 1,
    title: 'Pregătire',
    desc: 'Copilul alege planșa preferată și culorile de nisip. Pregătim spațiul de lucru împreună.',
    icon: ClipboardList,
    color: 'bg-[#F4A68F]',
  },
  {
    num: 2,
    title: 'Explorare',
    desc: 'Atingem nisipul, descoperim texturile și culorile. Lăsăm curiozitatea să ghideze.',
    icon: Search,
    color: 'bg-[#5BC4C0]',
  },
  {
    num: 3,
    title: 'Ghidare',
    desc: 'Urmărim liniile planșei, aplicăm nisipul pas cu pas. Atenția crește natural.',
    icon: Pencil,
    color: 'bg-[#B07CC6]',
  },
  {
    num: 4,
    title: 'Creație',
    desc: 'Tabloul prinde culoare. Copilul vede cum munca sa transformă imaginea.',
    icon: Palette,
    color: 'bg-[#E86B9E]',
  },
  {
    num: 5,
    title: 'Împărtășire',
    desc: 'Prezentăm creația cu mândrie. Un moment de validare și bucurie autentică.',
    icon: Award,
    color: 'bg-[#5BC4C0]',
  },
]

const reasons_educators = [
  'Activitate structurată, ușor de integrat în orar',
  'Materiale sigure, non-toxice, certificate CE',
  'Dezvoltă motricitatea fină și concentrarea',
  'Poate fi practicată individual sau în grup',
  'Curățare rapidă — nisipul este ușor de strâns',
  'Rezultat vizual motivant pentru copii',
]

const reasons_parents = [
  'O alternativă sănătoasă la ecrane',
  'Moment de calm și liniște în familia ta',
  'Activitate la care poți participa alături de copil',
  'Construiește rutine creative pozitive',
  'Produs românesc, cu livrare rapidă în toată țara',
  'Retur simplu în 30 de zile dacă nu ești mulțumit',
]

const values = [
  { icon: Heart, title: 'Blândețe', desc: 'Credem că jocul trebuie să fie liniștitor, nu stimulant excesiv.', color: 'text-[#E86B9E]' },
  { icon: Star, title: 'Calitate', desc: 'Materiale premium, non-toxice, testate și sigure pentru copii.', color: 'text-[#5BC4C0]' },
  { icon: Users, title: 'Comunitate', desc: 'Construim o rețea de părinți și educatori care valorizează jocul conștient.', color: 'text-[#B07CC6]' },
  { icon: Leaf, title: 'Sustenabilitate', desc: 'Ambalaje eco, producție responsabilă, materiale reciclabile.', color: 'text-[#5BC4C0]' },
]

export default function AboutPage() {
  useMeta('Despre Noi', 'Aflați povestea Sensoria Kids — brand românesc de planșe de nisip pentru copii, fondat din pasiunea pentru joacă blândă și creativitate.')
  return (
    <div className="min-h-screen pt-20">
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#5BC4C0]/10 via-white to-[#E86B9E]/10 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-[#5BC4C0]/10 text-[#5BC4C0] px-4 py-2 rounded-full text-sm font-semibold mb-6">
                Povestea noastră
              </div>
              <h1 className="text-4xl md:text-5xl font-bold text-[#2D2D2D] leading-tight mb-6">
                Credem că fiecare copil merită să crească prin{' '}
                <span className="text-[#5BC4C0]">joc liniștit</span>
              </h1>
              <p className="text-[#6B7280] text-lg leading-relaxed mb-6">
                Sensoria Kids s-a născut din dorința de a oferi copiilor activități creative care hrănesc sufletul — liniștitoare, frumoase și pline de sens.
              </p>
              <p className="text-[#6B7280] leading-relaxed">
                Am văzut cum copiii de astăzi sunt suprastimulați de ecrane și zgomot. Am vrut să creăm ceva diferit — un refugiu de creativitate, concentrare și liniște. Planșele noastre de nisip sunt răspunsul.
              </p>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1596464716127-f2a82984de30?w=700&q=80"
                alt="Sensoria Kids - povestea noastră"
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

      {/* Values */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="section-title mb-4">Valorile noastre</h2>
            <p className="section-subtitle max-w-xl mx-auto">Principiile care ghidează tot ce facem</p>
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

      {/* Process steps */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">Cum se desfășoară o activitate</h2>
            <p className="section-subtitle max-w-xl mx-auto">
              5 pași simpli de la cutia cu kit până la opera de artă finalizată
            </p>
          </div>

          {/* Steps — horizontal on desktop */}
          <div className="relative">
            {/* Connecting line */}
            <div className="hidden lg:block absolute top-[52px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-[#F4A68F] via-[#5BC4C0] to-[#E86B9E]" />

            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-8">
              {steps.map((step) => (
                <div key={step.num} className="flex flex-col items-center text-center relative">
                  <div
                    className={`w-16 h-16 rounded-full ${step.color} text-white flex items-center justify-center mb-4 z-10 shadow-card`}
                  >
                    <step.icon size={26} />
                  </div>
                  <div className="w-7 h-7 rounded-full border-4 border-white bg-gray-100 flex items-center justify-center text-xs font-bold text-[#6B7280] mb-3 -mt-2">
                    {step.num}
                  </div>
                  <h3 className="font-bold text-[#2D2D2D] mb-2">{step.title}</h3>
                  <p className="text-sm text-[#6B7280] leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why choose us — split for educators and parents */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="section-title mb-4">De ce să alegi Sensoria Kids?</h2>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* For educators */}
            <div className="bg-gradient-to-br from-[#5BC4C0]/10 to-[#5BC4C0]/5 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#5BC4C0] flex items-center justify-center">
                  <GraduationCap size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#5BC4C0] font-semibold uppercase tracking-wide">Pentru</p>
                  <h3 className="text-xl font-bold text-[#2D2D2D]">Educatori</h3>
                </div>
              </div>
              <ul className="space-y-3">
                {reasons_educators.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#5BC4C0] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-sm text-[#2D2D2D]">{r}</span>
                  </li>
                ))}
              </ul>
              <Link to="/contact" className="btn-outline mt-6 inline-flex" style={{ borderColor: '#5BC4C0', color: '#5BC4C0' }}>
                Contactați-ne pentru instituții
                <ArrowRight size={14} />
              </Link>
            </div>

            {/* For parents */}
            <div className="bg-gradient-to-br from-[#E86B9E]/10 to-[#E86B9E]/5 rounded-3xl p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-[#E86B9E] flex items-center justify-center">
                  <UserRound size={22} className="text-white" />
                </div>
                <div>
                  <p className="text-xs text-[#E86B9E] font-semibold uppercase tracking-wide">Pentru</p>
                  <h3 className="text-xl font-bold text-[#2D2D2D]">Părinți</h3>
                </div>
              </div>
              <ul className="space-y-3">
                {reasons_parents.map((r, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <div className="w-5 h-5 rounded-full bg-[#E86B9E] flex items-center justify-center shrink-0 mt-0.5">
                      <Check size={11} className="text-white" />
                    </div>
                    <span className="text-sm text-[#2D2D2D]">{r}</span>
                  </li>
                ))}
              </ul>
              <Link to="/magazin" className="btn-secondary mt-6 inline-flex">
                Explorează produsele
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Founder */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="w-24 h-24 rounded-full bg-gradient-to-br from-[#5BC4C0] to-[#E86B9E] mx-auto mb-6 flex items-center justify-center text-white text-3xl font-bold shadow-soft">
            SK
          </div>
          <h2 className="text-2xl font-bold text-[#2D2D2D] mb-2">Echipa Sensoria Kids</h2>
          <p className="text-[#6B7280] text-sm mb-6">Fondatori & Creatori</p>
          <blockquote className="text-xl text-[#2D2D2D] italic leading-relaxed max-w-2xl mx-auto mb-6">
            "Am creat Sensoria Kids pentru că am văzut câtă bucurie și calm aduce un moment simplu de creativitate. Vrem ca fiecare copil din România să aibă acces la jocul blând."
          </blockquote>
          <p className="text-sm text-[#6B7280]">
            Suntem o echipă mică, pasionată, din România. Fiecare produs este gândit cu grijă pentru copii și familiile lor.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h2 className="section-title mb-4">Gata să descoperi magia?</h2>
          <p className="section-subtitle mb-8">
            Prima comandă vine cu satisfacție garantată sau rambursăm integral.
          </p>
          <Link to="/magazin" className="btn-primary text-base px-8 py-4">
            Descoperă produsele noastre
            <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  )
}
