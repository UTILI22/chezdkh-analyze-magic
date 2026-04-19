import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart, formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { SHIPPING_CENTS, FREE_SHIPPING_COUNTRY } from "@/lib/config";
import {
  cleanShortText,
  cleanLongText,
  emailSchema,
  phoneSchema,
  detectSpam,
} from "@/lib/anti-spam";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Commande — QalbOfSilk" },
      { name: "description", content: "Finalisez votre commande QalbOfSilk en toute sécurité." },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: CheckoutPage,
});

const COUNTRIES = [
  "Belgique", "France", "Pays-Bas", "Luxembourg", "Allemagne", "Suisse",
  "Royaume-Uni", "Espagne", "Italie", "Canada", "États-Unis",
  "Maroc", "Algérie", "Tunisie", "Autre",
];

const schema = z.object({
  firstName: cleanShortText(80),
  lastName: cleanShortText(80),
  email: emailSchema,
  phone: phoneSchema,
  country: z.string().min(1).max(80),
  city: cleanLongText(120).optional().or(z.literal("")),
  postal: z.string().trim().max(20).regex(/^[A-Za-z0-9 \-]*$/, "Code postal invalide").optional().or(z.literal("")),
  address: cleanLongText(300, true).optional().or(z.literal("")),
  notes: cleanLongText(500).optional().or(z.literal("")),
  pickup: z.boolean(),
});

function CheckoutPage() {
  const { t } = useI18n();
  const { items, subtotalCents, rawSubtotalCents, discountCents, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    firstName: "", lastName: "", email: "", phone: "",
    country: "Belgique", city: "", postal: "", address: "",
    notes: "", pickup: false,
  });
  const [submitting, setSubmitting] = React.useState(false);
  // Anti-spam : honeypot (champ caché) + horodatage de chargement du form.
  const [honeypot, setHoneypot] = React.useState("");
  const formStartedAt = React.useRef<number>(Date.now());

  const isBelgium = form.country === FREE_SHIPPING_COUNTRY;
  const shipping = isBelgium ? 0 : SHIPPING_CENTS;
  const total = subtotalCents + shipping;

  React.useEffect(() => {
    if (!isBelgium && form.pickup) setForm((f) => ({ ...f, pickup: false }));
  }, [isBelgium, form.pickup]);

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl">{t("cart.empty")}</h1>
        <Link
          to="/burkinis"
          className="mt-6 inline-block rounded-md bg-foreground px-6 py-3 text-xs uppercase tracking-wider text-background"
        >
          {t("cart.continue")}
        </Link>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Anti-spam : honeypot rempli ou form soumis trop vite ⇒ on simule un succès silencieux.
    const spam = detectSpam({ honeypot, startedAt: formStartedAt.current });
    if (spam) {
      console.warn("Submission blocked:", spam);
      // Faux succès pour ne pas révéler la détection au bot
      toast.success(t("checkout.success"));
      return;
    }
    setSubmitting(true);
    try {
      const data = schema.parse(form);

      const itemsPayload = items.map((it) => ({
        product_id: it.id.includes("__") ? it.id.split("__")[0] : it.id,
        product_name: it.size ? `${it.name} (${it.size})` : it.name,
        unit_price_cents: it.priceCents,
        quantity: it.quantity,
      }));

      const { data: rpcResult, error: rpcErr } = await supabase.rpc("create_order", {
        _first_name: data.firstName,
        _last_name: data.lastName,
        _email: data.email,
        _phone: data.phone,
        _country: data.country,
        _city: data.city || "",
        _postal: data.postal || "",
        _address: data.address || "",
        _pickup: data.pickup,
        _shipping_cents: shipping,
        _subtotal_cents: subtotalCents,
        _total_cents: total,
        _notes: data.notes || "",
        _items: itemsPayload,
      });

      if (rpcErr || !rpcResult || (Array.isArray(rpcResult) && rpcResult.length === 0)) {
        console.error("RPC error:", rpcErr);
        throw rpcErr ?? new Error("Order failed");
      }

      const order = Array.isArray(rpcResult) ? rpcResult[0] : rpcResult;

      // Envoie les emails de confirmation (client + propriétaire) en arrière-plan,
      // sans bloquer la redirection vers la page de remerciement.
      fetch("/api/order-emails", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderNumber: order.order_number,
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          phone: data.phone,
          country: data.country,
          city: data.city || null,
          postal: data.postal || null,
          address: data.address || null,
          pickup: data.pickup,
          items: items.map((it) => ({
            name: it.name,
            size: it.size,
            quantity: it.quantity,
            unit_price_cents: it.priceCents,
          })),
          subtotalCents,
          shippingCents: shipping,
          totalCents: total,
          notes: data.notes || null,
        }),
      }).catch((err) => console.error("order-emails failed", err));

      clearCart();
      toast.success(t("checkout.success"));
      navigate({
        to: "/thank-you/$orderNumber",
        params: { orderNumber: order.order_number },
      });
    } catch (err: unknown) {
      console.error(err);
      const msg = err instanceof Error ? err.message : "Erreur lors de la commande.";
      toast.error(msg.includes("row-level") ? "Erreur de connexion. Réessayez dans un instant." : msg);
    } finally {
      setSubmitting(false);
    }
  };

  const inputCls =
    "w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-accent focus:outline-none focus:ring-1 focus:ring-accent";

  return (
    <div className="px-4 py-10 md:py-16">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_400px]">
        <form onSubmit={handleSubmit} className="space-y-6">
          <h1 className="font-display text-3xl tracking-wide md:text-4xl">{t("checkout.title")}</h1>

          {/* Honeypot anti-spam — caché aux humains, visible aux bots */}
          <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
            <label htmlFor="company_website">Ne pas remplir</label>
            <input
              type="text"
              id="company_website"
              name="company_website"
              tabIndex={-1}
              autoComplete="off"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
            />
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.firstName")}</label>
              <input required className={inputCls} value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.lastName")}</label>
              <input required className={inputCls} value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.email")}</label>
              <input required type="email" className={inputCls} value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.phone")}</label>
              <input required className={inputCls} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.country")}</label>
            <select className={inputCls} value={form.country} onChange={(e) => setForm({ ...form, country: e.target.value })}>
              {COUNTRIES.map((c) => (<option key={c} value={c}>{c}</option>))}
            </select>
          </div>

          {isBelgium && (
            <div className="rounded-md border-2 border-accent/40 bg-accent/5 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={form.pickup} onChange={(e) => setForm({ ...form, pickup: e.target.checked })} className="mt-1 h-4 w-4 accent-accent" />
                <div>
                  <p className="text-sm font-semibold text-foreground">{t("checkout.pickup")}</p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{t("checkout.pickupHint")}</p>
                </div>
              </label>
            </div>
          )}

          {!form.pickup && (
            <>
              <div className="grid gap-4 md:grid-cols-3">
                <div className="md:col-span-2">
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.city")}</label>
                  <input required={!form.pickup} className={inputCls} value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.postal")}</label>
                  <input required={!form.pickup} className={inputCls} value={form.postal} onChange={(e) => setForm({ ...form, postal: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.address")}</label>
                <input required={!form.pickup} className={inputCls} value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} />
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider">{t("checkout.notes")}</label>
            <textarea rows={3} className={inputCls} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })} />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-foreground py-3 text-sm font-medium uppercase tracking-wider text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "..." : t("checkout.submit")}
          </button>
        </form>

        <aside className="h-fit rounded-md border border-border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 font-display text-xl">Récapitulatif</h2>
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.id + (it.size ?? "")} className="flex justify-between gap-3 text-sm">
                <span className="flex-1">
                  {it.name}{it.size ? ` (${it.size})` : ""} <span className="text-muted-foreground">×{it.quantity}</span>
                </span>
                <span className="text-muted-foreground">{formatPrice(it.priceCents * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            {discountCents > 0 && (
              <div className="flex justify-between text-accent">
                <span>Réduction pack</span>
                <span>− {formatPrice(discountCents)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span>
                {discountCents > 0 && (
                  <span className="mr-2 text-xs text-muted-foreground line-through">{formatPrice(rawSubtotalCents)}</span>
                )}
                {formatPrice(subtotalCents)}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.shipping")}</span>
              <span>{shipping === 0 ? "Gratuit" : formatPrice(shipping)}</span>
            </div>
            <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
              <span>{t("cart.total")}</span>
              <span>{formatPrice(total)}</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
