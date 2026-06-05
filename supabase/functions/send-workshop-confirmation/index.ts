import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY') ?? ''

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString('ro-RO', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  })
}
function formatTime(dateStr: string) {
  return new Date(dateStr).toLocaleTimeString('ro-RO', { hour: '2-digit', minute: '2-digit' })
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  }

  const { registration, workshop } = await req.json()

  const html = `
<!DOCTYPE html>
<html lang="ro">
<head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" style="max-width:520px;background:#ffffff;border-radius:20px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);">
        <!-- Header -->
        <tr>
          <td style="background:linear-gradient(135deg,#5BC4C0,#E86B9E);padding:32px 32px 24px;text-align:center;">
            <p style="margin:0;color:rgba(255,255,255,0.85);font-size:13px;letter-spacing:1px;text-transform:uppercase;">Sensoria Kids</p>
            <h1 style="margin:8px 0 0;color:#ffffff;font-size:26px;font-weight:700;">Loc rezervat!</h1>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 6px;color:#6B7280;font-size:15px;">Bună, <strong style="color:#2D2D2D;">${registration.parent_name}</strong>!</p>
            <p style="margin:0 0 20px;color:#6B7280;font-size:15px;line-height:1.6;">
              <strong style="color:#2D2D2D;">${registration.child_name}</strong> este înscris la atelierul
              <strong style="color:#5BC4C0;">${workshop.title}</strong>.
            </p>

            <!-- Details card -->
            <table width="100%" style="background:#f9fafb;border-radius:14px;padding:18px 20px;margin-bottom:20px;">
              <tr>
                <td style="padding:6px 0;">
                  <span style="color:#5BC4C0;font-size:13px;">📅</span>
                  <span style="color:#6B7280;font-size:14px;margin-left:8px;">
                    <span style="text-transform:capitalize;">${formatDate(workshop.date)}</span>, ora ${formatTime(workshop.date)}
                  </span>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;">
                  <span style="color:#5BC4C0;font-size:13px;">📍</span>
                  <span style="color:#6B7280;font-size:14px;margin-left:8px;">${workshop.location}</span>
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;">
                  <span style="color:#E86B9E;font-size:13px;">💳</span>
                  <span style="color:#6B7280;font-size:14px;margin-left:8px;">${workshop.price} lei — plată la față locului, la sosire</span>
                </td>
              </tr>
            </table>

            <p style="margin:0 0 24px;color:#6B7280;font-size:14px;line-height:1.6;background:#5BC4C0/10;border-left:3px solid #5BC4C0;padding:12px 16px;border-radius:0 10px 10px 0;">
              Vă așteptăm cu 10 minute înainte de ora de start. Plata se face la sosire.
            </p>

            <p style="margin:0;color:#6B7280;font-size:14px;">Cu drag,<br><strong style="color:#2D2D2D;">Echipa Sensoria Kids</strong></p>
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;padding:16px 32px;text-align:center;border-top:1px solid #f0f0f0;">
            <p style="margin:0;color:#9CA3AF;font-size:12px;">
              Întrebări? <a href="mailto:contact@sensoriakids.ro" style="color:#5BC4C0;text-decoration:none;">contact@sensoriakids.ro</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`

  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Sensoria Kids <contact@sensoriakids.ro>',
      to: [registration.parent_email],
      subject: `Loc rezervat — ${workshop.title}`,
      html,
    }),
  })

  if (!res.ok) {
    const body = await res.text()
    return new Response(JSON.stringify({ error: body }), { status: 500 })
  }

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
