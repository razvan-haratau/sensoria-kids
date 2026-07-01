/**
 * Supabase Edge Function: send-contact-email
 *
 * 1. Salvează mesajul în tabela contact_messages
 * 2. Trimite notificare pe email adminului (ADMIN_EMAIL)
 * 3. Trimite confirmare automată utilizatorului
 *
 * Required Supabase secrets:
 *   RESEND_API_KEY  — API key din Resend dashboard
 *   FROM_EMAIL      — ex: contact@sensoriakids.ro (domeniu verificat în Resend)
 *   ADMIN_EMAIL     — emailul pe care vrei să primești notificările
 */

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const LOGO_URL = 'https://www.sensoriakids.ro/logo.png'

interface ContactFormData {
  name: string
  email: string
  phone?: string | null
  category: string
  message: string
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body: ContactFormData = await req.json()
    const { name, email, phone, category, message } = body

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY')
    const FROM_EMAIL = Deno.env.get('FROM_EMAIL') ?? 'onboarding@resend.dev'
    const ADMIN_EMAIL = Deno.env.get('ADMIN_EMAIL')
    const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY lipsește din secrets')

    // ── 1. Salvează în baza de date ──────────────────────────────────────────
    const insertRes = await fetch(`${SUPABASE_URL}/rest/v1/contact_messages`, {
      method: 'POST',
      headers: {
        apikey: SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'Content-Type': 'application/json',
        Prefer: 'return=minimal',
      },
      body: JSON.stringify({
        name,
        email,
        phone: phone || null,
        category,
        message,
      }),
    })

    if (!insertRes.ok) {
      const err = await insertRes.text()
      throw new Error(`DB insert failed: ${err}`)
    }

    // ── 2. Email notificare admin ────────────────────────────────────────────
    if (ADMIN_EMAIL) {
      const adminHtml = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <tr>
            <td bgcolor="#2D2D2D" style="background:#2D2D2D;padding:28px 32px;">
              <p style="margin:0 0 4px;color:#9CA3AF;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Sensoria Kids — Contact nou</p>
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Mesaj nou de la ${name}</h1>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF9;border:1px solid #5BC4C0;border-radius:14px;margin-bottom:24px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                      <tr>
                        <td style="color:#6B7280;font-size:13px;padding:5px 0;">Subiect</td>
                        <td style="color:#5BC4C0;font-size:14px;font-weight:700;text-align:right;">${category}</td>
                      </tr>
                      <tr>
                        <td style="color:#6B7280;font-size:13px;padding:5px 0;">Nume</td>
                        <td style="color:#2D2D2D;font-size:14px;font-weight:600;text-align:right;">${name}</td>
                      </tr>
                      <tr>
                        <td style="color:#6B7280;font-size:13px;padding:5px 0;">Email</td>
                        <td style="text-align:right;"><a href="mailto:${email}" style="color:#5BC4C0;font-size:14px;">${email}</a></td>
                      </tr>
                      ${phone ? `<tr><td style="color:#6B7280;font-size:13px;padding:5px 0;">Telefon</td><td style="color:#2D2D2D;font-size:14px;text-align:right;">${phone}</td></tr>` : ''}
                    </table>
                  </td>
                </tr>
              </table>

              <h3 style="color:#2D2D2D;font-size:14px;font-weight:700;margin:0 0 12px;text-transform:uppercase;letter-spacing:0.5px;">Mesaj</h3>
              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F9FAFB;border-radius:14px;margin-bottom:24px;">
                <tr>
                  <td style="padding:20px;">
                    <p style="margin:0;color:#2D2D2D;font-size:15px;line-height:1.7;white-space:pre-wrap;">${message}</p>
                  </td>
                </tr>
              </table>

              <a href="mailto:${email}" style="display:inline-block;background:#5BC4C0;color:#fff;font-size:14px;font-weight:700;padding:14px 28px;border-radius:12px;text-decoration:none;">Răspunde lui ${name}</a>
            </td>
          </tr>

          <tr>
            <td align="center" style="background:#F9FAFB;padding:20px 32px;border-top:1px solid #F0F0F0;">
              <p style="color:#9CA3AF;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} Sensoria Kids · <a href="https://www.sensoriakids.ro" style="color:#5BC4C0;text-decoration:none;">sensoriakids.ro</a>
              </p>
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
        headers: {
          Authorization: `Bearer ${RESEND_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ADMIN_EMAIL,
          reply_to: email,
          subject: `[Contact nou] ${category} — ${name}`,
          html: adminHtml,
        }),
      })
    }

    // ── 3. Email confirmare către utilizator ─────────────────────────────────
    const confirmHtml = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#F3F4F6;font-family:'Segoe UI',Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F3F4F6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#fff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">

          <tr>
            <td align="center" style="padding:32px 32px 20px;">
              <img src="${LOGO_URL}" alt="Sensoria Kids" width="150" style="display:block;max-width:150px;height:auto;" />
            </td>
          </tr>

          <tr>
            <td align="center" style="background:linear-gradient(135deg,#5BC4C0,#E86B9E);padding:28px 32px;">
              <h1 style="margin:0;color:#fff;font-size:22px;font-weight:700;">Am primit mesajul tău!</h1>
              <p style="margin:6px 0 0;color:rgba(255,255,255,0.9);font-size:14px;">Îți răspundem în cel mai scurt timp</p>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 20px;color:#6B7280;font-size:15px;line-height:1.6;">
                Bună, <strong style="color:#2D2D2D;">${name}</strong>! Am primit mesajul tău și îți vom răspunde în cel mult <strong>24 de ore</strong>.
              </p>

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F0FDF9;border:1px solid #5BC4C0;border-radius:14px;margin-bottom:28px;">
                <tr>
                  <td style="padding:16px 20px;">
                    <p style="margin:0 0 6px;color:#6B7280;font-size:13px;">Subiectul mesajului tău</p>
                    <p style="margin:0;color:#5BC4C0;font-size:15px;font-weight:700;">${category}</p>
                  </td>
                </tr>
              </table>

              <p style="margin:0 0 8px;color:#6B7280;font-size:14px;line-height:1.6;">
                Dacă ai o urgență, ne poți contacta direct:
              </p>
              <p style="margin:0 0 4px;font-size:14px;">
                <a href="tel:+40793917909" style="color:#5BC4C0;text-decoration:none;font-weight:600;">+40 793 917 909</a>
              </p>
              <p style="margin:0 0 28px;font-size:14px;">
                <a href="mailto:contact@sensoriakids.ro" style="color:#5BC4C0;text-decoration:none;font-weight:600;">contact@sensoriakids.ro</a>
              </p>

              <p style="color:#2D2D2D;font-size:14px;font-weight:600;margin:0;">Irina Haratau — Fondator</p>
              <p style="color:#6B7280;font-size:14px;margin:2px 0 0;">Sensoria Kids</p>
            </td>
          </tr>

          <tr>
            <td align="center" style="background:#F9FAFB;padding:20px 32px;border-top:1px solid #F0F0F0;">
              <table role="presentation" cellpadding="0" cellspacing="0" style="margin:0 auto 12px;">
                <tr>
                  <td style="padding:0 6px;">
                    <a href="https://www.facebook.com/share/1BLaRtJmv3/?mibextid=wwXIfr" target="_blank">
                      <img src="https://www.sensoriakids.ro/icon-facebook.png" alt="Facebook" width="36" height="36" style="display:block;border-radius:10px;" />
                    </a>
                  </td>
                  <td style="padding:0 6px;">
                    <a href="https://www.instagram.com/sensoria.kids.bucharest/" target="_blank">
                      <img src="https://www.sensoriakids.ro/icon-instagram.png" alt="Instagram" width="36" height="36" style="display:block;border-radius:10px;" />
                    </a>
                  </td>
                </tr>
              </table>
              <p style="color:#9CA3AF;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} Sensoria Kids · <a href="https://www.sensoriakids.ro" style="color:#5BC4C0;text-decoration:none;">sensoriakids.ro</a>
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`

    const confirmRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: email,
        subject: 'Am primit mesajul tău — Sensoria Kids',
        html: confirmHtml,
      }),
    })

    if (!confirmRes.ok) {
      const err = await confirmRes.text()
      console.error('Resend confirm error:', err)
    }

    return new Response(JSON.stringify({ ok: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-contact-email error:', err)
    return new Response(JSON.stringify({ error: String(err) }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
