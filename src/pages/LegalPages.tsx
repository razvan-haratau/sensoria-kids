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
            <p>Site-ul <strong className="text-[#2D2D2D]">sensoriakids.ro</strong> este deținut și operat de:</p>
            <div className="mt-3 bg-gray-50 rounded-xl px-5 py-4 text-sm space-y-1">
              <p><strong className="text-[#2D2D2D]">CONSEVENT DUO SRL</strong></p>
              <p>CUI: 53864288</p>
              <p>Sediul social: Șoseaua Mihai Bravu, Nr. 110, Bloc D2, Sc. A, Et. 4, Ap. 2, București, Sector 2</p>
              <p>Email: contact@sensoriakids.ro</p>
            </div>
            <p className="mt-3">Prin accesarea și utilizarea acestui site, ești de acord cu termenii și condițiile prezentate mai jos.</p>
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
            <p>Ai dreptul de a returna produsele în 30 de zile de la primire, fără a oferi o justificare. Produsele trebuie să fie în starea originală, nefolosite și în ambalajul original. Detalii complete în <a href="/retur" className="text-[#5BC4C0] underline">Politica de Retur</a>.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">5. Contact</h2>
            <p>Pentru întrebări legate de acești termeni, ne poți contacta la <a href="mailto:contact@sensoriakids.ro" className="text-[#5BC4C0] underline">contact@sensoriakids.ro</a>.</p>
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
            <p className="text-sm">Nu ești mulțumit? Returnezi și îți rambursăm integral, fără întrebări suplimentare.</p>
          </div>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Condiții de retur</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Produsul să fie nefolosit și în ambalajul original, sigilat</li>
              <li>Returnarea să fie inițiată în termen de 30 de zile calendaristice de la data primirii</li>
              <li>Să dispui de dovada achiziției (email de confirmare a comenzii)</li>
              <li>Produsul să nu prezinte deteriorări cauzate de utilizare sau depozitare necorespunzătoare</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Cum inițiezi un retur — pas cu pas</h2>
            <div className="space-y-4">

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#5BC4C0]/15 text-[#5BC4C0] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">1</div>
                <div>
                  <p className="font-semibold text-[#2D2D2D] text-sm mb-1">Trimite un email la contact@sensoriakids.ro</p>
                  <p className="text-sm">Subiectul emailului: <span className="font-medium text-[#2D2D2D]">„Cerere retur — Comanda #[numărul comenzii]"</span></p>
                  <div className="mt-2 bg-gray-50 rounded-xl px-4 py-3 text-xs space-y-1">
                    <p className="font-semibold text-[#2D2D2D] mb-2">Includeți în email:</p>
                    <p>— Numele complet și adresa de livrare</p>
                    <p>— Numărul comenzii (din emailul de confirmare)</p>
                    <p>— Produsul / produsele pe care dorești să le returnezi</p>
                    <p>— Motivul returului (opțional, dar ne ajută să ne îmbunătățim)</p>
                    <p>— IBAN-ul contului bancar pentru rambursare (sau specificați că doriți rambursarea pe card)</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#5BC4C0]/15 text-[#5BC4C0] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">2</div>
                <div>
                  <p className="font-semibold text-[#2D2D2D] text-sm mb-1">Aștepți confirmarea noastră</p>
                  <p className="text-sm">Îți răspundem în maximum 24-48 de ore lucrătoare cu confirmarea cererii și adresa de returnare a coletului.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#5BC4C0]/15 text-[#5BC4C0] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">3</div>
                <div>
                  <p className="font-semibold text-[#2D2D2D] text-sm mb-1">Trimiți coletul</p>
                  <p className="text-sm">Ambalezi produsul în ambalajul original și îl trimiți la adresa indicată prin orice serviciu de curierat. Costurile de transport la retur sunt suportate de client, cu excepția cazurilor în care produsul este defect sau livrat eronat.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-[#5BC4C0]/15 text-[#5BC4C0] font-bold text-sm flex items-center justify-center shrink-0 mt-0.5">4</div>
                <div>
                  <p className="font-semibold text-[#2D2D2D] text-sm mb-1">Rambursarea</p>
                  <p className="text-sm">După recepționarea și verificarea produsului, procesăm rambursarea în termen de <strong className="text-[#2D2D2D]">5-10 zile lucrătoare</strong>. Rambursarea se face pe același mijloc de plată folosit la comandă (card bancar sau transfer bancar).</p>
                </div>
              </div>

            </div>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Produse care nu pot fi returnate</h2>
            <ul className="list-disc list-inside space-y-2 text-sm">
              <li>Produse deschise sau cu ambalajul deteriorat</li>
              <li>Produse personalizate la cererea clientului</li>
              <li>Produse deteriorate ca urmare a utilizării necorespunzătoare</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-bold text-[#2D2D2D] mb-3">Produs defect sau livrat greșit?</h2>
            <p className="text-sm">Dacă ai primit un produs defect sau diferit față de ce ai comandat, costurile de retur sunt integral suportate de noi. Trimite-ne un email la <a href="mailto:contact@sensoriakids.ro" className="text-[#5BC4C0] underline">contact@sensoriakids.ro</a> cu o fotografie a produsului și rezolvăm situația prioritar.</p>
          </section>

          <div className="bg-gray-50 rounded-2xl px-5 py-4 text-sm">
            <p className="font-semibold text-[#2D2D2D] mb-1">Contact retur</p>
            <p>Email: <a href="mailto:contact@sensoriakids.ro" className="text-[#5BC4C0] underline">contact@sensoriakids.ro</a></p>
            <p className="mt-1 text-xs">Program răspuns: Luni – Vineri, 9:00 – 18:00</p>
          </div>
        </div>
      </div>
    </div>
  )
}
