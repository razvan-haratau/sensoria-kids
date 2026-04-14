# Sensoria Kids — Context proiect

Site e-commerce pentru brandul românesc **Sensoria Kids** (planșe de nisip colorate pentru copii 2–10 ani).

## Stack
- React 18 + TypeScript + Tailwind CSS + Vite
- Zustand cu `persist` middleware (localStorage)
- React Router v6 (nested routes pentru admin)
- Lucide React pentru toate iconițele (fără emoji)

## Structura
```
src/
  pages/          — HomePage, ShopPage, ProductDetailPage, AboutPage, ContactPage
  pages/admin/    — AdminLayout, AdminDashboard, AdminProducts, AdminOrders, AdminCustomers, AdminReports
  components/     — Navbar, Footer, ProductCard, CartDrawer
  store/          — cartStore.ts, productsStore.ts (ambele cu persist)
  lib/            — mockData.ts (seed inițial), supabase.ts (neconectat)
  types/          — index.ts
public/
  logo.png        — logo vector complet (navbar/footer/admin)
  favicon.png     — logo MIC.png, doar iconița floare (tab browser)
```

## Reguli importante
- Tot textul în **română**, prețuri în **RON**
- **Fără emoji** — doar Lucide React SVG icons
- Produsele sunt în Zustand `persist` (key: `sensoria-products`) — nu se pierd la refresh
- `Product` are câmpul `show_compare_price?: boolean` pentru toggle discount
- Admin la `/admin` (fără autentificare deocamdată)
- Supabase pregătit dar neconectat (env vars placeholder în .env)
- Logo dual: `public/logo.png` pe site, `public/favicon.png` în tab browser

## Logo
- Navbar: `<img src="/logo.png" className="h-12 w-auto object-contain" />`
- Footer: `<img src="/logo.png" className="h-12 w-auto object-contain" />`
- Admin sidebar: `<img src="/logo.png" className="h-10 w-auto object-contain" />`
- Browser tab (index.html): `<link rel="icon" type="image/png" href="/favicon.png" />`
