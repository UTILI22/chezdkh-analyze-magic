import { createClient } from '@supabase/supabase-js'
import { createFileRoute } from '@tanstack/react-router'
import { z } from 'zod'

// Public server route triggered by the checkout flow to enqueue
// the customer confirmation email + the owner notification email.
// Uses the service role key internally so it does not require a Supabase JWT.

const ItemSchema = z.object({
  name: z.string().min(1).max(200),
  size: z.string().max(50).optional(),
  quantity: z.number().int().min(1).max(99),
  unit_price_cents: z.number().int().min(0).max(10_000_000),
})

const PayloadSchema = z.object({
  orderNumber: z.string().min(3).max(64),
  firstName: z.string().min(1).max(80),
  lastName: z.string().min(1).max(80),
  email: z.string().email().max(254),
  phone: z.string().min(3).max(40),
  country: z.string().min(1).max(80),
  city: z.string().max(120).optional().nullable(),
  postal: z.string().max(20).optional().nullable(),
  address: z.string().max(300).optional().nullable(),
  pickup: z.boolean(),
  items: z.array(ItemSchema).min(1).max(50),
  subtotalCents: z.number().int().min(0),
  shippingCents: z.number().int().min(0),
  totalCents: z.number().int().min(0),
  notes: z.string().max(1000).optional().nullable(),
})

async function sendInternal(
  origin: string,
  serviceKey: string,
  templateName: string,
  recipientEmail: string,
  templateData: Record<string, unknown>,
  idempotencyKey: string,
) {
  const res = await fetch(`${origin}/lovable/email/transactional/send`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${serviceKey}`,
    },
    body: JSON.stringify({
      templateName,
      recipientEmail,
      templateData,
      idempotencyKey,
    }),
  })
  if (!res.ok) {
    const body = await res.text().catch(() => '')
    throw new Error(`send-transactional-email ${res.status}: ${body}`)
  }
  return res.json()
}

export const Route = createFileRoute('/api/order-emails')({
  server: {
    handlers: {
      POST: async ({ request }) => {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
        const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !serviceKey) {
          return Response.json({ error: 'Server configuration error' }, { status: 500 })
        }

        let payload
        try {
          payload = PayloadSchema.parse(await request.json())
        } catch (err) {
          return Response.json(
            { error: 'Invalid payload', details: err instanceof Error ? err.message : 'unknown' },
            { status: 400 },
          )
        }

        // Verify the order exists in DB (anti-spam: only send for real orders)
        const supabase = createClient(supabaseUrl, serviceKey)
        const { data: order, error: orderErr } = await supabase
          .from('orders')
          .select('id, order_number, customer_email')
          .eq('order_number', payload.orderNumber)
          .maybeSingle()

        if (orderErr || !order) {
          return Response.json({ error: 'Order not found' }, { status: 404 })
        }

        // Use the email recorded on the order to avoid spoofing.
        const recipient = order.customer_email
        const origin = new URL(request.url).origin

        const sharedData = {
          firstName: payload.firstName,
          lastName: payload.lastName,
          orderNumber: payload.orderNumber,
          items: payload.items,
          subtotalCents: payload.subtotalCents,
          shippingCents: payload.shippingCents,
          totalCents: payload.totalCents,
          pickup: payload.pickup,
          city: payload.city ?? undefined,
          postal: payload.postal ?? undefined,
          address: payload.address ?? undefined,
          country: payload.country,
        }

        const ownerData = {
          ...sharedData,
          customerName: `${payload.firstName} ${payload.lastName}`,
          customerEmail: payload.email,
          customerPhone: payload.phone,
          notes: payload.notes ?? undefined,
        }

        // Fire both emails in parallel; do not fail the response if one queue insert fails.
        const results = await Promise.allSettled([
          sendInternal(
            origin,
            serviceKey,
            'order-confirmation',
            recipient,
            sharedData,
            `order-customer-${payload.orderNumber}`,
          ),
          sendInternal(
            origin,
            serviceKey,
            'order-notification-owner',
            'qalbofsilk0@gmail.com',
            ownerData,
            `order-owner-${payload.orderNumber}`,
          ),
        ])

        const errors = results
          .map((r, i) => (r.status === 'rejected' ? { index: i, reason: String(r.reason) } : null))
          .filter(Boolean)

        if (errors.length) {
          console.error('order-emails partial failure', errors)
        }

        return Response.json({
          customer: results[0].status,
          owner: results[1].status,
        })
      },
    },
  },
})
