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

const LOGO_URL = 'https://www.sensoriakids.ro/logo.png'

interface OrderItem {
  product_id: string
  product_name: string
  quantity: number
  unit_price: number
}

interface ShippingAddress {
  name: string
  street: string
  city: string
  county: string
  postal_code: string
  country: string
}

interface OrderData {
  id: string
  customer_name: string
  customer_email: string
  items: OrderItem[]
  total: number
  shipping_cost: number
  payment_method: string
  shipping_address?: ShippingAddress
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order }: { order: OrderData } = await req.json()

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev'
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY lipsește din secrets')
    }

    const itemsHtml = order.items
      .map(
        (item, idx) => `
        <tr>
          <td style="padding:12px 0; border-bottom:${idx === order.items.length - 1 ? 'none' : '1px solid #F0F0F0'}; color:#2D2D2D; font-size:14px;">
            <a href="https://www.sensoriakids.ro/produs/${item.product_id}" style="color:#2D2D2D; text-decoration:none; font-weight:600;">${item.product_name}</a>
          </td>
          <td style="padding:12px 0; border-bottom:${idx === order.items.length - 1 ? 'none' : '1px solid #F0F0F0'}; color:#6B7280; font-size:14px; text-align:center;">×${item.quantity}</td>
          <td style="padding:12px 0; border-bottom:${idx === order.items.length - 1 ? 'none' : '1px solid #F0F0F0'}; color:#2D2D2D; font-size:14px; text-align:right; font-weight:600;">${item.unit_price * item.quantity} RON</td>
        </tr>`
      )
      .join('')

    const paymentLabel = order.payment_method === 'card' ? 'Card bancar (Netopia)' : 'Ramburs la livrare'

    const html = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#F3F4F6; font-family:'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding:32px 32px 20px;">
              <img src="${LOGO_URL}" alt="Sensoria Kids" width="170" style="display:block; max-width:170px; height:auto; border:0;" />
            </td>
          </tr>

          <!-- Title banner -->
          <tr>
            <td align="center" bgcolor="#5BC4C0" style="background-color:#5BC4C0; background-image:linear-gradient(135deg,#5BC4C0,#E86B9E); padding:28px 32px;">
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">Comandă confirmată!</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">Planșe creative cu nisip colorat</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 24px; color:#6B7280; font-size:15px; line-height:1.6;">
                Bună, <strong style="color:#2D2D2D;">${order.customer_name}</strong>! Comanda ta a fost plasată cu succes.
              </p>

              <!-- Order ID -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF9; border:1px solid #5BC4C0; border-radius:14px; margin-bottom:16px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; color:#6B7280; font-size:13px;">Număr comandă</p>
                    <p style="margin:4px 0 0; color:#5BC4C0; font-size:18px; font-weight:700; font-family:monospace;">${order.id}</p>
                  </td>
                </tr>
              </table>

              <!-- Delivery estimate -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF1F5; border-radius:14px; margin-bottom:28px;">
                <tr>
                  <td style="border-left:4px solid #E86B9E; padding:14px 20px; border-radius:0 14px 14px 0;">
                    <p style="margin:0; color:#2D2D2D; font-size:14px; line-height:1.6;">
                      <strong>Comanda ta este în procesare.</strong> Vei primi confirmarea expedierii ei în <strong>24–72 de ore</strong> de la efectuarea comenzii.
                    </p>
                  </td>
                </tr>
              </table>

              ${order.shipping_address ? `
              <!-- Shipping address -->
              <h3 style="color:#2D2D2D; font-size:14px; font-weight:700; margin:0 0 12px; text-transform:uppercase; letter-spacing:0.5px;">Adresă de livrare</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB; border-radius:14px; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px; color:#2D2D2D; font-size:14px; font-weight:600;">${order.shipping_address.name}</p>
                    <p style="margin:0; color:#6B7280; font-size:14px; line-height:1.7;">
                      ${order.shipping_address.street}<br>
                      ${order.shipping_address.city}, ${order.shipping_address.county}, ${order.shipping_address.postal_code}<br>
                      ${order.shipping_address.country}
                    </p>
                  </td>
                </tr>
              </table>
              ` : ''}

              <!-- Products -->
              <h3 style="color:#2D2D2D; font-size:14px; font-weight:700; margin:0 0 12px; text-transform:uppercase; letter-spacing:0.5px;">Produse comandate</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB; border-radius:14px; margin-bottom:16px;">
                <tr>
                  <td style="padding:8px 20px 4px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <thead>
                        <tr>
                          <th style="text-align:left; color:#9CA3AF; font-size:11px; font-weight:700; padding-bottom:8px; border-bottom:2px solid #F0F0F0; text-transform:uppercase; letter-spacing:0.5px;">Produs</th>
                          <th style="text-align:center; color:#9CA3AF; font-size:11px; font-weight:700; padding-bottom:8px; border-bottom:2px solid #F0F0F0; text-transform:uppercase; letter-spacing:0.5px;">Cant.</th>
                          <th style="text-align:right; color:#9CA3AF; font-size:11px; font-weight:700; padding-bottom:8px; border-bottom:2px solid #F0F0F0; text-transform:uppercase; letter-spacing:0.5px;">Preț</th>
                        </tr>
                      </thead>
                      <tbody>${itemsHtml}</tbody>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Totals -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB; border-radius:14px; margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6B7280; font-size:14px; padding-bottom:10px;">Transport</td>
                        <td style="color:#6B7280; font-size:14px; padding-bottom:10px; text-align:right;">${order.shipping_cost === 0 ? 'Gratuit' : `${order.shipping_cost} RON`}</td>
                      </tr>
                      <tr>
                        <td style="color:#2D2D2D; font-size:16px; font-weight:700; padding-top:10px; border-top:1px solid #E5E7EB;">Total</td>
                        <td style="color:#5BC4C0; font-size:16px; font-weight:700; padding-top:10px; border-top:1px solid #E5E7EB; text-align:right;">${order.total} RON</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Payment -->
              <p style="color:#6B7280; font-size:14px; margin:0 0 28px;">
                <strong style="color:#2D2D2D;">Metodă de plată:</strong> ${paymentLabel}
              </p>

              <p style="color:#6B7280; font-size:14px; line-height:1.6; margin:0 0 8px;">
                Te vom contacta telefonic sau pe email dacă avem nevoie de detalii suplimentare pentru livrare.
              </p>
              <p style="color:#6B7280; font-size:14px; margin:0;">Mulțumim că ai ales Sensoria Kids!</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#F9FAFB" style="background-color:#F9FAFB; padding:20px 32px; border-top:1px solid #F0F0F0;">
              <p style="color:#9CA3AF; font-size:12px; margin:0;">
                © ${new Date().getFullYear()} Sensoria Kids · <a href="https://www.sensoriakids.ro" style="color:#5BC4C0; text-decoration:none;">sensoriakids.ro</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
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
        subject: `Confirmare comandă (${order.id}) — Planșe cu nisip colorat`,
        html,
      }),
    })

    if (!res.ok) {
      const err = await res.text()
      throw new Error(`Resend error: ${err}`)
    }

    // Notificare admin
    if (ADMIN_EMAIL) {
      const adminItemsHtml = order.items
        .map(
          (item, idx) => `
          <tr>
            <td style="padding:10px 0; border-bottom:${idx === order.items.length - 1 ? 'none' : '1px solid #F0F0F0'}; color:#2D2D2D; font-size:14px;">${item.product_name}</td>
            <td style="padding:10px 0; border-bottom:${idx === order.items.length - 1 ? 'none' : '1px solid #F0F0F0'}; color:#6B7280; font-size:14px; text-align:center;">×${item.quantity}</td>
            <td style="padding:10px 0; border-bottom:${idx === order.items.length - 1 ? 'none' : '1px solid #F0F0F0'}; color:#2D2D2D; font-size:14px; text-align:right; font-weight:600;">${item.unit_price * item.quantity} RON</td>
          </tr>`
        )
        .join('')
      const paymentLabel = order.payment_method === 'card' ? 'Card bancar (Netopia)' : 'Ramburs la livrare'
      const adminHtml = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#F3F4F6; font-family:'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <!-- Title banner -->
          <tr>
            <td bgcolor="#2D2D2D" style="background-color:#2D2D2D; padding:28px 32px;">
              <p style="margin:0 0 4px; color:#9CA3AF; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Sensoria Kids — Admin</p>
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">Comandă nouă!</h1>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">

              <!-- Order info -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF9; border:1px solid #5BC4C0; border-radius:14px; margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Comandă</td><td style="color:#5BC4C0; font-size:15px; font-weight:700; text-align:right;">${order.id}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Client</td><td style="color:#2D2D2D; font-size:14px; font-weight:600; text-align:right;">${order.customer_name}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Email</td><td style="color:#2D2D2D; font-size:14px; text-align:right;">${order.customer_email}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Plată</td><td style="color:#2D2D2D; font-size:14px; text-align:right;">${paymentLabel}</td></tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Products -->
              <h3 style="color:#2D2D2D; font-size:14px; font-weight:700; margin:0 0 12px; text-transform:uppercase; letter-spacing:0.5px;">Produse</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB; border-radius:14px; margin-bottom:16px;">
                <tr>
                  <td style="padding:8px 20px 4px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <thead>
                        <tr>
                          <th style="text-align:left; color:#9CA3AF; font-size:11px; font-weight:700; padding-bottom:8px; border-bottom:2px solid #F0F0F0; text-transform:uppercase; letter-spacing:0.5px;">Produs</th>
                          <th style="text-align:center; color:#9CA3AF; font-size:11px; font-weight:700; padding-bottom:8px; border-bottom:2px solid #F0F0F0; text-transform:uppercase; letter-spacing:0.5px;">Cant.</th>
                          <th style="text-align:right; color:#9CA3AF; font-size:11px; font-weight:700; padding-bottom:8px; border-bottom:2px solid #F0F0F0; text-transform:uppercase; letter-spacing:0.5px;">Preț</th>
                        </tr>
                      </thead>
                      <tbody>${adminItemsHtml}</tbody>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Total -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB; border-radius:14px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#2D2D2D; font-size:16px; font-weight:700;">Total</td>
                        <td style="color:#5BC4C0; font-size:20px; font-weight:700; text-align:right;">${order.total} RON</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${RESEND_API_KEY}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          subject: `[Comandă nouă] ${order.id} — ${order.customer_name} — ${order.total} RON`,
          html: adminHtml,
        }),
      })
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
