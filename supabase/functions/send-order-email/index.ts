/**
 * Supabase Edge Function: send-order-email
 *
 * Trimite email de confirmare clientului după plasarea comenzii.
 * Folosește Resend API.
 *
 * Required Supabase secrets:
 *   RESEND_API_KEY  — API key din Resend dashboard
 *   FROM_EMAIL      — ex: comenzi@sensoriakids.ro (domeniu verificat în Resend)
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface OrderItem {
  product_name: string
  quantity: number
  unit_price: number
}

interface OrderData {
  id: string
  customer_name: string
  customer_email: string
  items: OrderItem[]
  total: number
  shipping_cost: number
  payment_method: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order }: { order: OrderData } = await req.json()

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev'

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY lipsește din secrets')
    }

    const itemsHtml = order.items
      .map(
        (item) => `
        <tr>
          <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #374151;">${item.product_name}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #374151; text-align: center;">×${item.quantity}</td>
          <td style="padding: 10px 0; border-bottom: 1px solid #f3f4f6; color: #374151; text-align: right; font-weight: 600;">${item.unit_price * item.quantity} RON</td>
        </tr>`
      )
      .join('')

    const paymentLabel = order.payment_method === 'card' ? 'Card bancar (Netopia)' : 'Ramburs la livrare'

    const html = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:'Segoe UI', Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <!-- Header -->
    <div style="background:linear-gradient(135deg, #5BC4C0, #E86B9E); padding:40px 32px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:700;">Sensoria Kids</h1>
      <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">Planșe de nisip colorate pentru copii</p>
    </div>

    <!-- Body -->
    <div style="padding:40px 32px;">
      <h2 style="color:#2D2D2D; font-size:20px; margin:0 0 8px;">Comandă confirmată!</h2>
      <p style="color:#6B7280; margin:0 0 24px;">Bună, <strong style="color:#2D2D2D;">${order.customer_name}</strong>! Comanda ta a fost plasată cu succes.</p>

      <!-- Order ID -->
      <div style="background:#f0fdf9; border:1px solid #5BC4C0; border-radius:12px; padding:16px 20px; margin-bottom:28px;">
        <p style="margin:0; color:#6B7280; font-size:13px;">Număr comandă</p>
        <p style="margin:4px 0 0; color:#5BC4C0; font-size:18px; font-weight:700; font-family:monospace;">${order.id}</p>
      </div>

      <!-- Products -->
      <h3 style="color:#2D2D2D; font-size:15px; margin:0 0 12px;">Produse comandate</h3>
      <table style="width:100%; border-collapse:collapse; margin-bottom:24px;">
        <thead>
          <tr>
            <th style="text-align:left; color:#9CA3AF; font-size:12px; font-weight:600; padding-bottom:8px; border-bottom:2px solid #f3f4f6; text-transform:uppercase;">Produs</th>
            <th style="text-align:center; color:#9CA3AF; font-size:12px; font-weight:600; padding-bottom:8px; border-bottom:2px solid #f3f4f6; text-transform:uppercase;">Cant.</th>
            <th style="text-align:right; color:#9CA3AF; font-size:12px; font-weight:600; padding-bottom:8px; border-bottom:2px solid #f3f4f6; text-transform:uppercase;">Preț</th>
          </tr>
        </thead>
        <tbody>${itemsHtml}</tbody>
      </table>

      <!-- Totals -->
      <div style="background:#f9fafb; border-radius:12px; padding:16px 20px; margin-bottom:28px;">
        <div style="display:flex; justify-content:space-between; margin-bottom:8px;">
          <span style="color:#6B7280; font-size:14px;">Transport</span>
          <span style="color:#6B7280; font-size:14px;">${order.shipping_cost === 0 ? 'Gratuit' : `${order.shipping_cost} RON`}</span>
        </div>
        <div style="display:flex; justify-content:space-between; border-top:1px solid #e5e7eb; padding-top:12px; margin-top:4px;">
          <span style="color:#2D2D2D; font-size:16px; font-weight:700;">Total</span>
          <span style="color:#5BC4C0; font-size:16px; font-weight:700;">${order.total} RON</span>
        </div>
      </div>

      <!-- Payment -->
      <p style="color:#6B7280; font-size:14px; margin:0 0 28px;">
        <strong style="color:#2D2D2D;">Metodă de plată:</strong> ${paymentLabel}
      </p>

      <p style="color:#6B7280; font-size:14px; line-height:1.6; margin:0 0 8px;">
        Te vom contacta în cel mai scurt timp pentru confirmarea și livrarea comenzii.
      </p>
      <p style="color:#6B7280; font-size:14px; margin:0;">Mulțumim că ai ales Sensoria Kids!</p>
    </div>

    <!-- Footer -->
    <div style="background:#f9fafb; padding:24px 32px; text-align:center; border-top:1px solid #f3f4f6;">
      <p style="color:#9CA3AF; font-size:12px; margin:0;">
        © ${new Date().getFullYear()} Sensoria Kids · <a href="https://www.sensoriakids.ro" style="color:#5BC4C0; text-decoration:none;">sensoriakids.ro</a>
      </p>
    </div>
  </div>
</body>
</html>`

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: order.customer_email,
        subject: `Confirmare comandă ${order.id} — Sensoria Kids`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Resend error: ${err}`)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-order-email error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
