import * as React from 'react'
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components'
import type { TemplateEntry } from './registry'

const SITE_NAME = 'QalbOfSilk'
const TAGLINE = "L'élégance & la pudeur"

interface OrderItem {
  name: string
  size?: string
  quantity: number
  unit_price_cents: number
}

interface OrderConfirmationProps {
  firstName?: string
  orderNumber?: string
  items?: OrderItem[]
  subtotalCents?: number
  shippingCents?: number
  totalCents?: number
  pickup?: boolean
  city?: string
  postal?: string
  address?: string
  country?: string
  whatsappUrl?: string
  instagramUrl?: string
  snapchatUrl?: string
}

function formatPrice(cents: number) {
  return `${(cents / 100).toFixed(2).replace('.', ',')} €`
}

const OrderConfirmationEmail = ({
  firstName,
  orderNumber,
  items = [],
  subtotalCents = 0,
  shippingCents = 0,
  totalCents = 0,
  pickup = false,
  city,
  postal,
  address,
  country,
  whatsappUrl = 'https://wa.me/32465452912',
  instagramUrl = 'https://www.instagram.com/qalb_ofsilk/',
  snapchatUrl = 'https://www.snapchat.com/@qalb_ofsilk',
}: OrderConfirmationProps) => (
  <Html lang="fr" dir="ltr">
    <Head />
    <Preview>
      Merci {firstName ? firstName : ''} ! Votre commande {orderNumber ?? ''} est bien reçue.
    </Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
          <Text style={tagline}>{TAGLINE}</Text>
        </Section>

        <Section style={hero}>
          <Heading style={h1}>
            {firstName ? `Merci, ${firstName} 🌸` : 'Merci pour votre commande 🌸'}
          </Heading>
          <Text style={lead}>
            Votre commande a bien été enregistrée. Nous revenons vers vous très
            rapidement avec les détails de paiement et de livraison.
          </Text>
          {orderNumber && (
            <Section style={orderBadge}>
              <Text style={orderBadgeLabel}>Numéro de commande</Text>
              <Text style={orderBadgeValue}>{orderNumber}</Text>
            </Section>
          )}
        </Section>

        {items.length > 0 && (
          <Section style={card}>
            <Heading as="h2" style={h2}>Récapitulatif</Heading>
            {items.map((it, i) => (
              <Section key={i} style={itemRow}>
                <Text style={itemName}>
                  {it.name}
                  {it.size ? ` — ${it.size}` : ''}{' '}
                  <span style={itemQty}>×{it.quantity}</span>
                </Text>
                <Text style={itemPrice}>
                  {formatPrice(it.unit_price_cents * it.quantity)}
                </Text>
              </Section>
            ))}
            <Hr style={hr} />
            <Section style={totalRow}>
              <Text style={totalLabel}>Sous-total</Text>
              <Text style={totalValue}>{formatPrice(subtotalCents)}</Text>
            </Section>
            <Section style={totalRow}>
              <Text style={totalLabel}>Livraison</Text>
              <Text style={totalValue}>
                {shippingCents === 0 ? 'Gratuit' : formatPrice(shippingCents)}
              </Text>
            </Section>
            <Hr style={hr} />
            <Section style={totalRow}>
              <Text style={grandLabel}>Total</Text>
              <Text style={grandValue}>{formatPrice(totalCents)}</Text>
            </Section>
          </Section>
        )}

        <Section style={card}>
          <Heading as="h2" style={h2}>
            {pickup ? 'Mode de réception' : 'Livraison'}
          </Heading>
          {pickup ? (
            <Text style={text}>
              ✋ Remise en main propre à <strong>Bruxelles</strong>. Nous vous
              contacterons pour convenir d'un point de rendez-vous.
            </Text>
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
        </Section>

        <Section style={ctaCard}>
          <Heading as="h2" style={h2Light}>Une question ? Restons en contact</Heading>
          <Text style={ctaText}>
            Suivez-nous et écrivez-nous quand vous voulez 💌
          </Text>
          <Section style={btnRow}>
            <Button href={whatsappUrl} style={btnWhatsapp}>WhatsApp</Button>
            <Button href={instagramUrl} style={btnInstagram}>Instagram</Button>
            <Button href={snapchatUrl} style={btnSnapchat}>Snapchat</Button>
          </Section>
        </Section>

        <Hr style={hr} />
        <Text style={footer}>
          Une question ? Écrivez-nous à{' '}
          <Link href="mailto:qalbofsilk0@gmail.com" style={link}>
            qalbofsilk0@gmail.com
          </Link>
          <br />
          {SITE_NAME} — {TAGLINE}
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: (data: Record<string, any>) =>
    data?.orderNumber
      ? `Merci pour votre commande ${data.orderNumber} — ${SITE_NAME}`
      : `Merci pour votre commande — ${SITE_NAME}`,
  displayName: 'Confirmation de commande',
  previewData: {
    firstName: 'Sarah',
    orderNumber: 'QOS-20260101-1234',
    items: [
      { name: 'Burkini Ciel d\'été', size: 'M', quantity: 1, unit_price_cents: 4500 },
      { name: 'Burkini Sable doré', size: 'L', quantity: 2, unit_price_cents: 4500 },
    ],
    subtotalCents: 13500,
    shippingCents: 0,
    totalCents: 13500,
    pickup: false,
    city: 'Bruxelles',
    postal: '1000',
    address: 'Rue de la Mode 1',
    country: 'Belgique',
  },
} satisfies TemplateEntry

// ─────────────────── styles ───────────────────
const main = {
  backgroundColor: '#ffffff',
  fontFamily:
    "-apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif",
}
const container = {
  maxWidth: '560px',
  margin: '0 auto',
  padding: '24px 20px',
}
const header = { textAlign: 'center' as const, padding: '8px 0 20px' }
const brand = {
  fontSize: '28px',
  letterSpacing: '4px',
  color: '#1a1a1a',
  margin: '0',
  fontWeight: 300,
}
const tagline = {
  fontSize: '11px',
  letterSpacing: '3px',
  textTransform: 'uppercase' as const,
  color: '#a08763',
  margin: '6px 0 0',
}
const hero = { textAlign: 'center' as const, padding: '20px 0 24px' }
const h1 = {
  fontSize: '26px',
  fontWeight: 400,
  color: '#1a1a1a',
  margin: '0 0 12px',
  lineHeight: '1.3',
}
const lead = {
  fontSize: '14px',
  color: '#5a5a5a',
  lineHeight: '1.6',
  margin: '0 auto 20px',
  maxWidth: '420px',
}
const orderBadge = {
  display: 'inline-block',
  border: '1px solid #d8c4a3',
  borderRadius: '4px',
  padding: '12px 24px',
  margin: '12px auto 0',
  backgroundColor: '#faf6ef',
}
const orderBadgeLabel = {
  fontSize: '10px',
  letterSpacing: '2px',
  textTransform: 'uppercase' as const,
  color: '#8a7556',
  margin: '0',
}
const orderBadgeValue = {
  fontSize: '18px',
  letterSpacing: '2px',
  color: '#a08763',
  margin: '4px 0 0',
  fontWeight: 500,
}
const card = {
  border: '1px solid #ececec',
  borderRadius: '6px',
  padding: '20px 22px',
  margin: '16px 0',
}
const h2 = {
  fontSize: '14px',
  fontWeight: 600,
  textTransform: 'uppercase' as const,
  letterSpacing: '2px',
  color: '#1a1a1a',
  margin: '0 0 16px',
}
const h2Light = { ...h2, color: '#ffffff' }
const itemRow = {
  display: 'table',
  width: '100%',
  margin: '0 0 6px',
}
const itemName = {
  display: 'table-cell',
  fontSize: '14px',
  color: '#1a1a1a',
  margin: '0',
  paddingRight: '12px',
}
const itemQty = { color: '#999', fontSize: '13px' }
const itemPrice = {
  display: 'table-cell',
  fontSize: '14px',
  color: '#5a5a5a',
  margin: '0',
  textAlign: 'right' as const,
  whiteSpace: 'nowrap' as const,
  width: '90px',
}
const hr = { borderColor: '#ececec', margin: '16px 0' }
const totalRow = {
  display: 'table',
  width: '100%',
  margin: '4px 0',
}
const totalLabel = {
  display: 'table-cell',
  fontSize: '13px',
  color: '#777',
  margin: '0',
}
const totalValue = {
  display: 'table-cell',
  fontSize: '13px',
  color: '#1a1a1a',
  margin: '0',
  textAlign: 'right' as const,
  width: '90px',
}
const grandLabel = { ...totalLabel, fontSize: '15px', fontWeight: 600, color: '#1a1a1a' }
const grandValue = { ...totalValue, fontSize: '15px', fontWeight: 600 }
const text = {
  fontSize: '14px',
  color: '#5a5a5a',
  lineHeight: '1.6',
  margin: '0',
}
const ctaCard = {
  backgroundColor: '#1a1a1a',
  borderRadius: '6px',
  padding: '24px 22px',
  margin: '20px 0',
  textAlign: 'center' as const,
}
const ctaText = {
  fontSize: '14px',
  color: '#cccccc',
  margin: '0 0 18px',
}
const btnRow = { textAlign: 'center' as const }
const btnBase = {
  display: 'inline-block',
  padding: '10px 18px',
  borderRadius: '4px',
  fontSize: '12px',
  fontWeight: 600,
  textDecoration: 'none',
  letterSpacing: '1px',
  textTransform: 'uppercase' as const,
  margin: '4px 4px',
}
const btnWhatsapp = { ...btnBase, backgroundColor: '#25D366', color: '#ffffff' }
const btnInstagram = { ...btnBase, backgroundColor: '#d62976', color: '#ffffff' }
const btnSnapchat = { ...btnBase, backgroundColor: '#FFFC00', color: '#1a1a1a' }
const footer = {
  fontSize: '12px',
  color: '#999',
  textAlign: 'center' as const,
  margin: '20px 0 0',
  lineHeight: '1.6',
}
const link = { color: '#a08763', textDecoration: 'underline' }
