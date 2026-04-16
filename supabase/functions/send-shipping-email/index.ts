const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

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
      : `<p style="font-family:monospace; font-size:18px; font-weight:700; color:#5BC4C0; letter-spacing:1px; margin:8px 0 0;">${shipping.tracking_number}</p>`

    const html = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0; padding:0; background:#f9fafb; font-family:'Segoe UI', Arial, sans-serif;">
  <div style="max-width:600px; margin:40px auto; background:#ffffff; border-radius:16px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.08);">

    <div style="background:linear-gradient(135deg, #5BC4C0, #E86B9E); padding:40px 32px; text-align:center;">
      <h1 style="color:#ffffff; margin:0; font-size:24px; font-weight:700;">Sensoria Kids</h1>
      <p style="color:rgba(255,255,255,0.85); margin:8px 0 0; font-size:14px;">Comanda ta este în drum spre tine!</p>
    </div>

    <div style="padding:40px 32px;">
      <h2 style="color:#2D2D2D; font-size:20px; margin:0 0 8px;">Comanda a fost expediată!</h2>
      <p style="color:#6B7280; margin:0 0 24px;">Bună, <strong style="color:#2D2D2D;">${shipping.customer_name}</strong>! Comanda ta a plecat și este în drum spre tine.</p>

      <div style="background:#f0fdf9; border:1px solid #5BC4C0; border-radius:12px; padding:16px 20px; margin-bottom:28px;">
        <p style="margin:0; color:#6B7280; font-size:13px;">Număr comandă</p>
        <p style="margin:4px 0 0; color:#5BC4C0; font-size:18px; font-weight:700; font-family:monospace;">${shipping.order_id}</p>
      </div>

      <div style="background:#f9fafb; border-radius:12px; padding:20px; margin-bottom:28px; text-align:center;">
        <p style="margin:0 0 4px; color:#6B7280; font-size:13px;">Curier</p>
        <p style="margin:0 0 16px; color:#2D2D2D; font-size:16px; font-weight:700;">${shipping.courier}</p>
        <p style="margin:0 0 4px; color:#6B7280; font-size:13px;">Număr de urmărire (AWB)</p>
        ${trackingBlock}
      </div>

      <p style="color:#6B7280; font-size:14px; line-height:1.6; margin:0 0 8px;">
        Dacă ai întrebări despre livrare, nu ezita să ne contactezi.
      </p>
      <p style="color:#6B7280; font-size:14px; margin:0;">Mulțumim că ai ales Sensoria Kids!</p>
    </div>

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
        to: shipping.customer_email,
        subject: `Comanda ${shipping.order_id} a fost expediată — Sensoria Kids`,
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
