const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LOGO_URL = 'https://www.sensoriakids.ro/logo.png'

interface ShippingData {
  order_id: string
  customer_name: string
  customer_email: string
  courier: string
  tracking_number: string
  tracking_url?: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { shipping }: { shipping: ShippingData } = await req.json()

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev'

    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY lipsește')

    const trackingBlock = shipping.tracking_url
      ? `<a href="${shipping.tracking_url}" style="display:inline-block; background:#5BC4C0; color:#fff; font-weight:700; padding:12px 28px; border-radius:12px; text-decoration:none; font-size:15px; margin-top:8px;">Urmărește coletul</a>`
      : `<p style="font-family:monospace; font-size:18px; font-weight:700; color:#5BC4C0; letter-spacing:1px; margin:6px 0 0;">${shipping.tracking_number}</p>`

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
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">Comanda a fost expediată!</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">Planșe de nisip colorate pentru copii</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 24px; color:#6B7280; font-size:15px; line-height:1.6;">
                Bună, <strong style="color:#2D2D2D;">${shipping.customer_name}</strong>! Comanda ta a plecat și este în drum spre tine.
              </p>

              <!-- Order ID -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF9; border:1px solid #5BC4C0; border-radius:14px; margin-bottom:16px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0; color:#6B7280; font-size:13px;">Număr comandă</p>
                    <p style="margin:4px 0 0; color:#5BC4C0; font-size:18px; font-weight:700; font-family:monospace;">${shipping.order_id}</p>
                  </td>
                </tr>
              </table>

              <!-- Courier -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB; border-radius:14px; margin-bottom:28px;">
                <tr>
                  <td align="center" style="padding:20px;">
                    <p style="margin:0 0 4px; color:#6B7280; font-size:13px;">Curier</p>
                    <p style="margin:0 0 16px; color:#2D2D2D; font-size:16px; font-weight:700;">${shipping.courier}</p>
                    <p style="margin:0 0 4px; color:#6B7280; font-size:13px;">Număr de urmărire (AWB)</p>
                    ${trackingBlock}
                  </td>
                </tr>
              </table>

              <p style="color:#6B7280; font-size:14px; line-height:1.6; margin:0 0 8px;">
                Dacă ai întrebări despre livrare, nu ezita să ne contactezi.
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
        to: shipping.customer_email,
        subject: `Comandă expediată (${shipping.order_id}) — Planșe cu nisip colorat`,
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
    console.error('send-shipping-email error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
