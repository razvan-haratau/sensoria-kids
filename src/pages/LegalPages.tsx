import { useMeta } from '../hooks/useMeta'

export function TermeniPage() {
  useMeta('Termeni și Condiții', 'Termenii și condițiile de utilizare ale site-ului Sensoria Kids și de achiziționare a produselor noastre.')
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">Termeni și Condiții</h1>
        <p className="text-[#6B7280] text-sm mb-10">Ultima actualizare: Ianuarie 2024</p>
        <div className="prose prose-gray max-w-none space-y-6 text-[#6B7280] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">1. Informații generale</h2>
            <p>Sensoria Kids este un brand deținut și operat în România. Prin accesarea și utilizarea acestui site, ești de acord cu termenii și condițiile prezentate mai jos.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">2. Produse și prețuri</h2>
            <p>Toate prețurile afișate sunt în RON și includ TVA. Ne rezervăm dreptul de a modifica prețurile în orice moment. Prețul aplicat comenzii este cel afișat la momentul plasării comenzii.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">3. Comenzi și livrare</h2>
            <p>Comenzile sunt procesate în 1-2 zile lucrătoare. Livrarea se efectuează în 3-5 zile lucrătoare prin curier rapid. Livrarea este gratuită pentru comenzile de peste 150 RON.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">4. Retur și rambursare</h2>
            <p>Ai dreptul de a returna produsele în 30 de zile de la primire, fără a oferi o justificare. Produsele trebuie să fie în starea originală, nefolosite și în ambalajul original.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">5. Contact</h2>
            <p>Pentru întrebări legate de acești termeni, ne poți contacta la contact@sensoriakids.ro.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export function ConfidentialitiatePage() {
  useMeta('Politica de Confidențialitate', 'Politica de confidențialitate și GDPR a Sensoria Kids. Cum colectăm, procesăm și protejăm datele tale personale.')
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">Politica de Confidențialitate</h1>
        <p className="text-[#6B7280] text-sm mb-10">Ultima actualizare: Ianuarie 2024</p>
        <div className="space-y-6 text-[#6B7280] leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">1. Date colectate</h2>
            <p>Colectăm informații pe care ni le furnizezi direct: nume, email, adresă de livrare, număr de telefon — exclusiv în scopul procesării comenzilor și comunicărilor comerciale.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">2. Utilizarea datelor</h2>
            <p>Datele tale sunt utilizate pentru: procesarea comenzilor, comunicarea cu tine despre statusul comenzii, îmbunătățirea experienței pe site.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">3. Cookie-uri</h2>
            <p>Folosim cookie-uri esențiale pentru funcționarea site-ului și cookie-uri analitice pentru înțelegerea comportamentului utilizatorilor. Poți gestiona preferințele de cookie-uri din setările browserului.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">4. Drepturile tale (GDPR)</h2>
            <p>Conform GDPR, ai dreptul de acces, rectificare, ștergere, portabilitate și opoziție. Pentru exercitarea acestor drepturi, contactează-ne la contact@sensoriakids.ro.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">5. Securitate</h2>
            <p>Implementăm măsuri tehnice și organizatorice pentru protejarea datelor tale personale împotriva accesului neautorizat.</p>
          </section>
        </div>
      </div>
    </div>
  )
}

export function ReturPage() {
  useMeta('Politica de Retur', 'Politica de retur și înlocuire a produselor Sensoria Kids. Returnezi simplu în 14 zile de la primirea comenzii.')
  return (
    <div className="min-h-screen pt-20">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
        <h1 className="text-3xl font-bold text-[#2D2D2D] mb-2">Politica de Retur</h1>
        <p className="text-[#6B7280] text-sm mb-10">Ultima actualizare: Ianuarie 2024</p>
        <div className="space-y-6 text-[#6B7280] leading-relaxed">
          <div className="bg-[#5BC4C0]/10 rounded-2xl p-5">
            <p className="font-semibold text-[#5BC4C0] text-lg mb-1">Retur simplu în 30 de zile</p>
            <p className="text-sm">Nu ești mulțumit? Returnezi și îți rambursăm integral.</p>
          </div>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Condiții de retur</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Produsul să fie nefolosit și în ambalajul original</li>
              <li>Returnarea să fie inițiată în 30 de zile de la primire</li>
              <li>Să ai dovada achiziției (email confirmare comandă)</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Cum inițiezi un retur</h2>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>Contactează-ne la contact@sensoriakids.ro</li>
              <li>Menționează numărul comenzii și motivul returnării</li>
              <li>Vei primi instrucțiunile de returnare în 24 de ore</li>
              <li>Rambursarea se efectuează în 5-10 zile lucrătoare</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  )
}
