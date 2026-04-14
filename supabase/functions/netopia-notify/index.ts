/**
 * Supabase Edge Function: netopia-notify
 *
 * Receives payment status notifications from Netopia (webhook / notifyUrl).
 * Updates the order payment_status in the database.
 *
 * Netopia calls this URL automatically after payment completion.
 * The URL is set in netopia-start → config.notifyUrl
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Netopia payment status codes
const NETOPIA_STATUS: Record<number, string> = {
  0:  'pending',
  3:  'paid',
  5:  'paid',       // confirmed
  12: 'failed',     // rejected
  15: 'pending',    // 3DS authentication required
  18: 'failed',     // expired
  20: 'refunded',
  35: 'refunded',   // partial refund
  55: 'pending',    // on hold
}

Deno.serve(async (req: Request) => {
  // Netopia sends POST with JSON
  if (req.method !== 'POST') {
    return new Response('Method not allowed', { status: 405 })
  }

  try {
    const body = await req.json()
    const payment = body?.payment
    const order = body?.order

    if (!payment || !order) {
      return new Response(JSON.stringify({ error: 'Invalid payload' }), { status: 400 })
    }

    const ntpID: string = payment.ntpID
    const status: number = payment.status
    const orderID: string = order.orderID

    const paymentStatus = NETOPIA_STATUS[status] ?? 'pending'

    const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    const { error } = await supabase
      .from('orders')
      .update({
        payment_status: paymentStatus,
        netopia_ntpid: ntpID,
        // Auto-advance order status when payment confirmed
        ...(paymentStatus === 'paid' ? { order_status: 'În procesare' } : {}),
      })
      .eq('id', orderID)

    if (error) {
      console.error('[netopia-notify] DB update error:', error.message)
      return new Response(JSON.stringify({ error: error.message }), { status: 500 })
    }

    console.info(`[netopia-notify] Order ${orderID} → payment_status: ${paymentStatus} (ntpID: ${ntpID})`)

    // Netopia expects a 200 OK with empty body or JSON to acknowledge receipt
    return new Response(JSON.stringify({ errorCode: 0 }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('[netopia-notify] Error:', err)
    return new Response(JSON.stringify({ error: 'Internal server error' }), { status: 500 })
  }
})
