import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useCart, formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { SHIPPING_CENTS, FREE_SHIPPING_COUNTRY, whatsappLink, BRAND } from "@/lib/config";
import * as React from "react";
import { toast } from "sonner";
import { z } from "zod";

export const Route = createFileRoute("/checkout")({
  head: () => ({ meta: [{ title: "Commande — QalbOfSilk" }] }),
  component: CheckoutPage,
});

const COUNTRIES = [
  "Belgique",
  "France",
  "Pays-Bas",
  "Luxembourg",
  "Allemagne",
  "Suisse",
  "Royaume-Uni",
  "Espagne",
  "Italie",
  "Canada",
  "États-Unis",
  "Maroc",
  "Algérie",
  "Tunisie",
  "Autre",
];

const schema = z.object({
  firstName: z.string().trim().min(1).max(80),
  lastName: z.string().trim().min(1).max(80),
  email: z.string().trim().email().max(200),
  phone: z.string().trim().min(5).max(40),
  country: z.string().min(1).max(80),
  city: z.string().trim().max(120).optional(),
  postal: z.string().trim().max(20).optional(),
  address: z.string().trim().max(300).optional(),
  notes: z.string().trim().max(500).optional(),
  pickup: z.boolean(),
});

function CheckoutPage() {
  const { t } = useI18n();
  const { items, subtotalCents, clearCart } = useCart();
  const navigate = useNavigate();

  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "Belgique",
    city: "",
    postal: "",
    address: "",
    notes: "",
    pickup: false,
  });
  const [submitting, setSubmitting] = React.useState(false);

  const isBelgium = form.country === FREE_SHIPPING_COUNTRY;
  const shipping = form.pickup && isBelgium ? 0 : isBelgium ? 0 : SHIPPING_CENTS;
  const total = subtotalCents + shipping;

  // Reset pickup if country changes away from Belgium
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
    setSubmitting(true);
    try {
      const data = schema.parse(form);

      const { data: order, error: orderErr } = await supabase
        .from("orders")
        .insert({
          customer_first_name: data.firstName,
          customer_last_name: data.lastName,
          customer_email: data.email,
          customer_phone: data.phone,
          country: data.country,
          city: data.city || null,
          postal_code: data.postal || null,
          address: data.address || null,
          pickup_brussels: data.pickup,
          shipping_cents: shipping,
          subtotal_cents: subtotalCents,
          total_cents: total,
          notes: data.notes || null,
          status: "pending",
        })
        .select("id, order_number")
        .single();

      if (orderErr || !order) throw orderErr ?? new Error("Order failed");

      const itemsPayload = items.map((it) => ({
        order_id: order.id,
        product_id: it.id,
        product_name: it.name,
        unit_price_cents: it.priceCents,
        quantity: it.quantity,
      }));

      const { error: itemsErr } = await supabase.from("order_items").insert(itemsPayload);
      if (itemsErr) throw itemsErr;

      // Build WhatsApp message
      const lines = [
        `🛍️ *Nouvelle commande ${BRAND.name}*`,
        `N° ${order.order_number}`,
        ``,
        `*Client:* ${data.firstName} ${data.lastName}`,
        `*Email:* ${data.email}`,
        `*Tél:* ${data.phone}`,
        `*Pays:* ${data.country}`,
        data.city ? `*Ville:* ${data.city}` : "",
        data.postal ? `*Code postal:* ${data.postal}` : "",
        data.address ? `*Adresse:* ${data.address}` : "",
        data.pickup ? `*Mode:* Remise en main propre Bruxelles` : `*Mode:* Expédition`,
        ``,
        `*Produits:*`,
        ...items.map((i) => `- ${i.name} x${i.quantity} (${formatPrice(i.priceCents * i.quantity)})`),
        ``,
        `Sous-total: ${formatPrice(subtotalCents)}`,
        `Livraison: ${formatPrice(shipping)}`,
        `*Total: ${formatPrice(total)}*`,
        data.notes ? `\nNotes: ${data.notes}` : "",
      ].filter(Boolean);

      const waUrl = whatsappLink(lines.join("\n"));

      clearCart();
      toast.success(t("checkout.success"));
      // Open WhatsApp pre-filled
      window.open(waUrl, "_blank");
      navigate({ to: "/" });
    } catch (err) {
      console.error(err);
      toast.error("Erreur lors de la commande. Vérifiez vos informations.");
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

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
                {t("checkout.firstName")}
              </label>
              <input
                required
                className={inputCls}
                value={form.firstName}
                onChange={(e) => setForm({ ...form, firstName: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
                {t("checkout.lastName")}
              </label>
              <input
                required
                className={inputCls}
                value={form.lastName}
                onChange={(e) => setForm({ ...form, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
                {t("checkout.email")}
              </label>
              <input
                required
                type="email"
                className={inputCls}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
              />
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
                {t("checkout.phone")}
              </label>
              <input
                required
                className={inputCls}
                value={form.phone}
                onChange={(e) => setForm({ ...form, phone: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
              {t("checkout.country")}
            </label>
            <select
              className={inputCls}
              value={form.country}
              onChange={(e) => setForm({ ...form, country: e.target.value })}
            >
              {COUNTRIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Pickup option only for Belgium */}
          {isBelgium && (
            <div className="rounded-md border-2 border-accent/40 bg-accent/5 p-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.pickup}
                  onChange={(e) => setForm({ ...form, pickup: e.target.checked })}
                  className="mt-1 h-4 w-4 accent-accent"
                />
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
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
                    {t("checkout.city")}
                  </label>
                  <input
                    required={!form.pickup}
                    className={inputCls}
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
                    {t("checkout.postal")}
                  </label>
                  <input
                    required={!form.pickup}
                    className={inputCls}
                    value={form.postal}
                    onChange={(e) => setForm({ ...form, postal: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
                  {t("checkout.address")}
                </label>
                <input
                  required={!form.pickup}
                  className={inputCls}
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                />
              </div>
            </>
          )}

          <div>
            <label className="mb-1 block text-xs font-medium uppercase tracking-wider">
              {t("checkout.notes")}
            </label>
            <textarea
              rows={3}
              className={inputCls}
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-md bg-foreground py-3 text-sm font-medium uppercase tracking-wider text-background transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {submitting ? "..." : t("checkout.submit")}
          </button>
        </form>

        {/* Summary */}
        <aside className="h-fit rounded-md border border-border bg-card p-6 lg:sticky lg:top-28">
          <h2 className="mb-4 font-display text-xl">Récapitulatif</h2>
          <ul className="space-y-3">
            {items.map((it) => (
              <li key={it.id} className="flex justify-between gap-3 text-sm">
                <span className="flex-1">
                  {it.name} <span className="text-muted-foreground">×{it.quantity}</span>
                </span>
                <span>{formatPrice(it.priceCents * it.quantity)}</span>
              </li>
            ))}
          </ul>
          <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">{t("cart.subtotal")}</span>
              <span>{formatPrice(subtotalCents)}</span>
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
