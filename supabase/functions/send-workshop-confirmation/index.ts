const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
}

const LOGO_URL = 'https://www.sensoriakids.ro/logo.png'
const FB_URL = 'https://www.facebook.com/share/1BLaRtJmv3/?mibextid=wwXIfr'
const IG_URL = 'https://www.instagram.com/sensoria.kids.bucharest/'
const FB_ICON = 'https://www.sensoriakids.ro/icon-facebook.png'
const IG_ICON = 'https://www.sensoriakids.ro/icon-instagram.png'

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}

function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('ro-RO', {
    timeZone: 'Europe/Bucharest',
    hour: '2-digit', minute: '2-digit',
  })
}

Deno.serve(async (req) => {
  console.log('[workshop-confirm] invoked, method:', req.method)

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { registration, workshop } = await req.json()
    console.log('[workshop-confirm] sending to:', registration?.parent_email, '| workshop:', workshop?.title)

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev'
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')

    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY lipsește din secrets')

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
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">Loc rezervat!</h1>
              <p style="margin:6px 0 0; color:rgba(255,255,255,0.9); font-size:14px;">Atelier Sensoria Kids</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 6px; color:#6B7280; font-size:15px; line-height:1.6;">
                Bună, <strong style="color:#2D2D2D;">${registration.parent_name}</strong>!
              </p>
              <p style="margin:0 0 24px; color:#6B7280; font-size:15px; line-height:1.6;">
                <strong style="color:#2D2D2D;">${registration.child_name}</strong> este înscris la atelierul
                <strong style="color:#5BC4C0;">${workshop.title}</strong>.
              </p>

              <!-- Details card -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB; border-radius:14px; margin-bottom:24px;">
                <tr>
                  <td style="padding:20px 24px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="padding:8px 0; color:#6B7280; font-size:14px;">
                          <span style="font-size:16px;">📅</span>&nbsp;&nbsp;
                          <span style="text-transform:capitalize;">${formatDate(workshop.date)}, ora ${formatTime(workshop.date)}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#6B7280; font-size:14px; border-top:1px solid #F0F0F0;">
                          <span style="font-size:16px;">📍</span>&nbsp;&nbsp;${workshop.location}
                        </td>
                      </tr>
                      <tr>
                        <td style="padding:8px 0; color:#6B7280; font-size:14px; border-top:1px solid #F0F0F0;">
                          <span style="font-size:16px;">💳</span>&nbsp;&nbsp;${workshop.price} lei — ${registration.payment_method === 'card' ? 'plată cu cardul' : 'plată la fața locului, la sosire'}
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Note -->
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFF1F5; border-radius:14px; margin-bottom:28px;">
                <tr>
                  <td style="border-left:4px solid #E86B9E; padding:14px 20px; border-radius:0 14px 14px 0;">
                    <p style="margin:0; color:#2D2D2D; font-size:14px; line-height:1.6;">
                      Vă așteptăm cu <strong>10 minute înainte</strong> de ora de start. ${registration.payment_method === 'card' ? 'Plata a fost efectuată cu cardul.' : 'Plata se face la sosire, în numerar sau cu cardul.'}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="color:#6B7280; font-size:14px; margin:0 0 4px;">Cu drag,</p>
              <p style="color:#2D2D2D; font-size:14px; font-weight:600; margin:0;">Irina Haratau — Fondator</p>
              <p style="color:#6B7280; font-size:14px; margin:2px 0 0;">+40733.307.209</p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" bgcolor="#F9FAFB" style="background-color:#F9FAFB; padding:20px 32px; border-top:1px solid #F0F0F0;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
                <tr>
                  <td style="padding:0 6px;">
                    <a href="${FB_URL}" target="_blank">
                      <img src="${FB_ICON}" alt="Facebook" width="36" height="36" style="display:block; border-radius:10px;" />
                    </a>
                  </td>
                  <td style="padding:0 6px;">
                    <a href="${IG_URL}" target="_blank">
                      <img src="${IG_ICON}" alt="Instagram" width="36" height="36" style="display:block; border-radius:10px;" />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#9CA3AF; font-size:12px; margin:0 0 4px;">
                Întrebări? <a href="mailto:contact@sensoriakids.ro" style="color:#5BC4C0; text-decoration:none;">contact@sensoriakids.ro</a>
              </p>
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
        to: registration.parent_email,
        subject: `Loc rezervat — ${workshop.title}`,
        html,
      }),
    })

    if (!res.ok) {
      const body = await res.text()
      console.log('[workshop-confirm] Resend error:', res.status, body)
      throw new Error(`Resend error ${res.status}: ${body}`)
    }

    console.log('[workshop-confirm] email sent OK to', registration.parent_email)

    // Notificare admin
    if (ADMIN_EMAIL) {
      const adminHtml = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"></head>
<body style="margin:0; padding:0; background:#F3F4F6; font-family:'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px; background:#ffffff; border-radius:20px; overflow:hidden; box-shadow:0 4px 24px rgba(0,0,0,0.06);">
          <tr>
            <td bgcolor="#2D2D2D" style="background-color:#2D2D2D; padding:28px 32px;">
              <p style="margin:0 0 4px; color:#9CA3AF; font-size:12px; text-transform:uppercase; letter-spacing:1px;">Sensoria Kids — Admin</p>
              <h1 style="margin:0; color:#ffffff; font-size:22px; font-weight:700;">Înscriere nouă la atelier!</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF9; border:1px solid #5BC4C0; border-radius:14px; margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Atelier</td><td style="color:#5BC4C0; font-size:15px; font-weight:700; text-align:right;">${workshop.title}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Data</td><td style="color:#2D2D2D; font-size:14px; font-weight:600; text-align:right; text-transform:capitalize;">${formatDate(workshop.date)}, ora ${formatTime(workshop.date)}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Copil</td><td style="color:#2D2D2D; font-size:14px; font-weight:600; text-align:right;">${registration.child_name}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Părinte</td><td style="color:#2D2D2D; font-size:14px; text-align:right;">${registration.parent_name}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Email</td><td style="color:#2D2D2D; font-size:14px; text-align:right;">${registration.parent_email}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Telefon</td><td style="color:#2D2D2D; font-size:14px; text-align:right;">${registration.parent_phone}</td></tr>
                      <tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Plată</td><td style="color:#2D2D2D; font-size:14px; text-align:right;">${registration.payment_method === 'card' ? 'Card' : 'La fața locului'}</td></tr>
                      ${registration.notes ? `<tr><td style="color:#6B7280; font-size:13px; padding:4px 0;">Mențiuni</td><td style="color:#2D2D2D; font-size:14px; text-align:right; font-style:italic;">${registration.notes}</td></tr>` : ''}
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
          subject: `[Înscriere nouă] ${registration.child_name} — ${workshop.title}`,
          html: adminHtml,
        }),
      })
      console.log('[workshop-confirm] admin notification sent to', ADMIN_EMAIL)
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[workshop-confirm] error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
