import * as React from 'react'
import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

interface OrderItem {
  name: string
  size?: string
  quantity: number
  unit_price_cents: number
}

interface OwnerOrderNotificationProps {
  orderNumber?: string
  customerName?: string
  customerEmail?: string
  customerPhone?: string
  country?: string
  city?: string
  postal?: string
  address?: string
  pickup?: boolean
  items?: OrderItem[]
  subtotalCents?: number
  shippingCents?: number
  totalCents?: number
  notes?: string
}

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`
}

const OwnerOrderEmail = ({
  orderNumber,
  customerName,
  customerEmail,
  customerPhone,
  country,
  city,
  postal,
  address,
  pickup = false,
  items = [],
  subtotalCents = 0,
  shippingCents = 0,
  totalCents = 0,
  notes,
}: OwnerOrderNotificationProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>
      🛍️ Nouvelle commande {orderNumber ?? ''} — {formatPrice(totalCents)}
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>🛍️ Nouvelle commande</Heading>
        {orderNumber && <Text style={subtitle}>{orderNumber}</Text>}

        <Hr style={hr} />

        <Heading as="h2" style={h2}>Client</Heading>
        <Text style={text}>
          <strong>{customerName}</strong>
          <br />
          📧 {customerEmail}
          <br />
          📱 {customerPhone}
        </Text>

        <Hr style={hr} />

        <Heading as="h2" style={h2}>
          {pickup ? 'Mode de réception' : 'Livraison'}
        </Heading>
        {pickup ? (
          <Text style={text}>✋ Remise en main propre Bruxelles</Text>
        ) : (
          <Text style={text}>
            {address && <>{address}<br /></>}
            {(postal || city) && (
              <>
                {postal} {city}
                <br />
              </>
            )}
            {country}
          </Text>
        )}

        <Hr style={hr} />

        <Heading as="h2" style={h2}>Articles</Heading>
        {items.map((it, i) => (
          <Text key={i} style={itemText}>
            • {it.name}
            {it.size ? ` (${it.size})` : ''} ×{it.quantity} —{' '}
            {formatPrice(it.unit_price_cents * it.quantity)}
          </Text>
        ))}

        <Hr style={hr} />

        <Text style={text}>
          Sous-total : {formatPrice(subtotalCents)}
          <br />
          Livraison : {shippingCents === 0 ? 'Gratuit' : formatPrice(shippingCents)}
          <br />
          <strong style={total}>Total : {formatPrice(totalCents)}</strong>
        </Text>

        {notes && (
          <>
            <Hr style={hr} />
            <Heading as="h2" style={h2}>Notes du client</Heading>
            <Text style={text}>{notes}</Text>
          </>
        )}
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OwnerOrderEmail,
  subject: (data: Record<string, any>) =>
    `🛍️ Nouvelle commande ${data?.orderNumber ?? ''} — ${
      data?.totalCents ? formatPrice(data.totalCents) : ''
    }`,
  to: 'qalbofsilk0@gmail.com',
  displayName: 'Notification commande (owner)',
  previewData: {
    orderNumber: 'QOS-20260101-1234',
    customerName: 'Sarah Dupont',
    customerEmail: 'sarah@example.com',
    customerPhone: '+32 470 12 34 56',
    country: 'Belgique',
    city: 'Bruxelles',
    postal: '1000',
    address: 'Rue de la Mode 1',
    pickup: false,
    items: [
      { name: "Burkini Ciel d'été", size: 'M', quantity: 1, unit_price_cents: 4500 },
    ],
    subtotalCents: 4500,
    shippingCents: 0,
    totalCents: 4500,
    notes: 'Merci de bien vouloir contacter par WhatsApp',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Arial, sans-serif' }
const container = { maxWidth: '560px', margin: '0 auto', padding: '24px 20px' }
const h1 = { fontSize: '24px', color: '#1a1a1a', margin: '0' }
const subtitle = { fontSize: '16px', color: '#a08763', margin: '4px 0 0', letterSpacing: '1px' }
const h2 = { fontSize: '13px', textTransform: 'uppercase' as const, letterSpacing: '2px', color: '#1a1a1a', margin: '0 0 8px' }
const text = { fontSize: '14px', color: '#333', lineHeight: '1.6', margin: '0 0 4px' }
const itemText = { fontSize: '14px', color: '#333', margin: '0 0 4px' }
const total = { fontSize: '16px', color: '#1a1a1a' }
const hr = { borderColor: '#ececec', margin: '16px 0' }
