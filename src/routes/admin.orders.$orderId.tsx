import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import * as React from "react";
import { formatPrice } from "@/lib/cart";
import { toast } from "sonner";
import { ArrowLeft } from "lucide-react";

type OrderDetail = {
  id: string;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string;
  customer_email: string;
  customer_phone: string;
  country: string;
  city: string | null;
  postal_code: string | null;
  address: string | null;
  pickup_brussels: boolean;
  shipping_cents: number;
  subtotal_cents: number;
  total_cents: number;
  notes: string | null;
  status: string;
  created_at: string;
};

type Item = {
  id: string;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
};

const STATUSES = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

export const Route = createFileRoute("/admin/orders/$orderId")({
  component: OrderDetailPage,
});

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [items, setItems] = React.useState<Item[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = React.useCallback(() => {
    Promise.all([
      supabase.from("orders").select("*").eq("id", orderId).single(),
      supabase.from("order_items").select("id, product_name, unit_price_cents, quantity").eq("order_id", orderId),
    ]).then(([o, i]) => {
      setOrder(o.data as OrderDetail);
      setItems(i.data ?? []);
      setLoading(false);
    });
  }, [orderId]);

  React.useEffect(() => { load(); }, [load]);

  const updateStatus = async (status: string) => {
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    if (error) {
      toast.error("Erreur");
    } else {
      toast.success("Statut mis à jour");
      load();
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Chargement...</p>;
  if (!order) return <p>Commande introuvable.</p>;

  return (
    <div>
      <Link
        to="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux commandes
      </Link>

      <div className="mb-6 flex items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl">Commande {order.order_number}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {new Date(order.created_at).toLocaleString("fr-BE")}
          </p>
        </div>
        <div>
          <label className="mb-1 block text-xs uppercase tracking-wider text-muted-foreground">
            Statut
          </label>
          <select
            value={order.status}
            onChange={(e) => updateStatus(e.target.value)}
            className="rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer */}
        <div className="rounded-md border border-border p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Client</h3>
          <div className="space-y-1 text-sm">
            <p className="font-medium">{order.customer_first_name} {order.customer_last_name}</p>
            <p>{order.customer_email}</p>
            <p>{order.customer_phone}</p>
          </div>
        </div>

        {/* Address / pickup */}
        <div className="rounded-md border border-border p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">
            Livraison
          </h3>
          {order.pickup_brussels ? (
            <p className="rounded bg-accent/10 p-3 text-sm font-medium">
              🤝 Remise en main propre — Bruxelles
            </p>
          ) : (
            <div className="space-y-1 text-sm">
              <p>{order.address}</p>
              <p>{order.postal_code} {order.city}</p>
              <p className="font-medium">{order.country}</p>
            </div>
          )}
        </div>
      </div>

      {/* Items */}
      <div className="mt-6 rounded-md border border-border p-5">
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Produits</h3>
        <ul className="divide-y divide-border">
          {items.map((it) => (
            <li key={it.id} className="flex justify-between py-2 text-sm">
              <span>
                {it.product_name} <span className="text-muted-foreground">×{it.quantity}</span>
              </span>
              <span>{formatPrice(it.unit_price_cents * it.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Sous-total</span>
            <span>{formatPrice(order.subtotal_cents)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Livraison</span>
            <span>{order.shipping_cents === 0 ? "Gratuit" : formatPrice(order.shipping_cents)}</span>
          </div>
          <div className="flex justify-between border-t border-border pt-2 text-base font-semibold">
            <span>Total</span>
            <span>{formatPrice(order.total_cents)}</span>
          </div>
        </div>
      </div>

      {order.notes && (
        <div className="mt-6 rounded-md border border-border p-5">
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-accent">Notes</h3>
          <p className="text-sm">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
