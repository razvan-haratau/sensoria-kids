/**
 * Supabase Edge Function: netopia-start
 *
 * Receives an order from the frontend, saves it to DB as "pending",
 * then calls the Netopia Payments v2 API to initiate a card payment.
 * Returns { orderId, paymentURL } on success, or { error } on failure.
 *
 * Required Supabase secrets (set in Dashboard → Edge Functions → Secrets):
 *   NETOPIA_API_KEY      — API key from Netopia admin → Profile → Security
 *   NETOPIA_POS_SIGNATURE — POS identifier from Netopia dashboard
 *   NETOPIA_SANDBOX      — "true" for sandbox, "false" for production
 *   SITE_URL             — your frontend URL, e.g. https://www.sensoriakids.ro
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const body = await req.json()
    const { order } = body as { order: Record<string, unknown> }

    if (!order) {
      return new Response(JSON.stringify({ error: 'Missing order data' }), {
        status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Supabase admin client (service role) ────────────────────────────────
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    // ── Save order to DB as pending ─────────────────────────────────────────
    const { error: dbError } = await supabase.from('orders').insert(order)
    if (dbError) {
      return new Response(JSON.stringify({ error: dbError.message }), {
        status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    // ── Build Netopia request ────────────────────────────────────────────────
    const apiKey = Deno.env.get('NETOPIA_API_KEY')!
    const posSignature = Deno.env.get('NETOPIA_POS_SIGNATURE')!
    const isSandbox = Deno.env.get('NETOPIA_SANDBOX') !== 'false'
    const siteUrl = Deno.env.get('SITE_URL') ?? 'https://www.sensoriakids.ro'

    const netopiaBase = isSandbox
      ? 'https://secure.sandbox.netopia-payments.com'
      : 'https://secure.netopia-payments.com'

    // Map shipping_address to Netopia billing format
    const shippingAddress = order.shipping_address as Record<string, string>

    const netopiaPayload = {
      config: {
        emailTemplate: '',
        notifyUrl: `${Deno.env.get('SUPABASE_URL')}/functions/v1/netopia-notify`,
        redirectUrl: `${siteUrl}/checkout/confirmare`,
        language: 'ro',
      },
      payment: {
        options: {
          installments: 0,
          bonus: 0,
        },
        instrument: {
          type: 'card',
        },
        data: {},
      },
      order: {
        posSignature,
        dateTime: new Date().toISOString(),
        description: `Comanda Sensoria Kids #${order.id}`,
        orderID: order.id as string,
        amount: order.total as number,
        currency: 'RON',
        billing: {
          email: order.customer_email as string,
          phone: order.customer_phone as string,
          firstName: (order.customer_name as string).split(' ')[0] ?? '',
          lastName: (order.customer_name as string).split(' ').slice(1).join(' ') ?? '-',
          city: shippingAddress.city ?? '',
          country: 642, // România ISO numeric
          state: shippingAddress.county ?? '',
          postalCode: shippingAddress.postal_code ?? '',
          details: shippingAddress.street ?? '',
        },
        shipping: {
          email: order.customer_email as string,
          phone: order.customer_phone as string,
          firstName: (order.customer_name as string).split(' ')[0] ?? '',
          lastName: (order.customer_name as string).split(' ').slice(1).join(' ') ?? '-',
          city: shippingAddress.city ?? '',
          country: 642,
          state: shippingAddress.county ?? '',
          postalCode: shippingAddress.postal_code ?? '',
          details: shippingAddress.street ?? '',
        },
        products: (order.items as Array<Record<string, unknown>>).map((item) => ({
          name: item.product_name as string,
          code: item.product_id as string,
          category: 'Jucarii educationale',
          price: item.unit_price as number,
          vat: 19,
        })),
        installments: { selected: 0, available: [0] },
        data: {},
      },
    }

    // ── Call Netopia API ─────────────────────────────────────────────────────
    const netopiaRes = await fetch(`${netopiaBase}/payment/card/start`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: apiKey,
      },
      body: JSON.stringify(netopiaPayload),
    })

    if (!netopiaRes.ok) {
      const errText = await netopiaRes.text()
      console.error('[netopia-start] Netopia error:', errText)
      return new Response(JSON.stringify({ error: `Netopia error: ${netopiaRes.status}` }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const netopiaData = await netopiaRes.json()

    // Save Netopia transaction ID to order
    if (netopiaData?.payment?.ntpID) {
      await supabase
        .from('orders')
        .update({ netopia_ntpid: netopiaData.payment.ntpID })
        .eq('id', order.id)
    }

    // Netopia returns paymentURL for redirect or customerAction for 3DS
    const paymentURL: string =
      netopiaData?.payment?.paymentURL ??
      netopiaData?.customerAction?.url ??
      null

    if (!paymentURL) {
      console.error('[netopia-start] No paymentURL in response:', JSON.stringify(netopiaData))
      return new Response(JSON.stringify({ error: 'No payment URL received from Netopia' }), {
        status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(
      JSON.stringify({ orderId: order.id, paymentURL, ntpID: netopiaData?.payment?.ntpID }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    console.error('[netopia-start] Unexpected error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
