import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import * as React from "react";
import { formatPrice } from "@/lib/cart";
import { resolveProductImage } from "@/lib/product-images";
import { toast } from "sonner";
import { ArrowLeft, Mail, Phone, MapPin, Package as PackageIcon, MessageSquare, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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
  product_id: string | null;
  product_name: string;
  unit_price_cents: number;
  quantity: number;
};

type ProductInfo = {
  id: string;
  slug: string | null;
  image_url: string | null;
};

type StatusKey = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

const STATUS_OPTIONS: { key: StatusKey; label: string; emoji: string; cls: string }[] = [
  { key: "pending", label: "En attente", emoji: "⏳", cls: "bg-yellow-100 text-yellow-900 border-yellow-300" },
  { key: "confirmed", label: "Validée / En cours", emoji: "✅", cls: "bg-blue-100 text-blue-900 border-blue-300" },
  { key: "shipped", label: "Expédiée", emoji: "📦", cls: "bg-purple-100 text-purple-900 border-purple-300" },
  { key: "delivered", label: "Livrée", emoji: "🎉", cls: "bg-green-100 text-green-900 border-green-300" },
  { key: "cancelled", label: "Annulée", emoji: "✖️", cls: "bg-red-100 text-red-900 border-red-300" },
];

export const Route = createFileRoute("/admin/orders/$orderId")({
  component: OrderDetailPage,
});

/** Extracts size from a product line id like "<uuid>__M" */
function extractSizeFromId(id: string | null): string | null {
  if (!id) return null;
  const idx = id.indexOf("__");
  if (idx === -1) return null;
  return id.slice(idx + 2);
}

function OrderDetailPage() {
  const { orderId } = Route.useParams();
  const [order, setOrder] = React.useState<OrderDetail | null>(null);
  const [items, setItems] = React.useState<Item[]>([]);
  const [products, setProducts] = React.useState<Record<string, ProductInfo>>({});
  const [loading, setLoading] = React.useState(true);
  const [updating, setUpdating] = React.useState(false);

  const load = React.useCallback(async () => {
    setLoading(true);
    const [{ data: o }, { data: i }] = await Promise.all([
      supabase.from("orders").select("*").eq("id", orderId).single(),
      supabase
        .from("order_items")
        .select("id, product_id, product_name, unit_price_cents, quantity")
        .eq("order_id", orderId),
    ]);
    setOrder(o as OrderDetail);
    const itemList = (i ?? []) as Item[];
    setItems(itemList);

    // Fetch product images / slugs in batch
    const productIds = Array.from(
      new Set(itemList.map((it) => it.product_id).filter((x): x is string => Boolean(x))),
    );
    if (productIds.length > 0) {
      const { data: prods } = await supabase
        .from("products")
        .select("id, slug, image_url")
        .in("id", productIds);
      const map: Record<string, ProductInfo> = {};
      (prods ?? []).forEach((p) => {
        map[p.id] = p as ProductInfo;
      });
      setProducts(map);
    } else {
      setProducts({});
    }
    setLoading(false);
  }, [orderId]);

  React.useEffect(() => {
    load();
  }, [load]);

  const updateStatus = async (status: StatusKey) => {
    setUpdating(true);
    const { error } = await supabase.from("orders").update({ status }).eq("id", orderId);
    setUpdating(false);
    if (error) {
      toast.error("Erreur lors de la mise à jour");
    } else {
      toast.success("Statut mis à jour");
      setOrder((o) => (o ? { ...o, status } : o));
    }
  };

  if (loading) return <p className="text-sm text-muted-foreground">Chargement...</p>;
  if (!order) return <p>Commande introuvable.</p>;

  const currentStatus = STATUS_OPTIONS.find((s) => s.key === order.status) ?? STATUS_OPTIONS[0];

  return (
    <div>
      <Link
        to="/admin"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Retour aux commandes
      </Link>

      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h2 className="font-display text-3xl">Commande {order.order_number}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Passée le{" "}
            {new Date(order.created_at).toLocaleString("fr-BE", {
              day: "2-digit",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-medium ${currentStatus.cls}`}
        >
          <span>{currentStatus.emoji}</span>
          <span>{currentStatus.label}</span>
        </span>
      </div>

      {/* Status switcher */}
      <div className="mb-8 rounded-md border border-border bg-muted/20 p-4">
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Modifier le statut
        </p>
        <div className="flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((s) => {
            const isActive = order.status === s.key;
            return (
              <button
                key={s.key}
                onClick={() => updateStatus(s.key)}
                disabled={updating || isActive}
                className={`inline-flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition-all ${
                  isActive
                    ? `${s.cls} ring-2 ring-offset-1 ring-offset-background`
                    : "border-border bg-background hover:border-foreground hover:bg-muted"
                } disabled:cursor-not-allowed`}
              >
                <span>{s.emoji}</span>
                <span>{s.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer */}
        <div className="rounded-md border border-border p-5">
          <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-accent">Client</h3>
          <div className="space-y-2 text-sm">
            <p className="text-base font-medium">
              {order.customer_first_name} {order.customer_last_name}
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              <a href={`mailto:${order.customer_email}`} className="hover:text-foreground hover:underline">
                {order.customer_email}
              </a>
            </p>
            <p className="flex items-center gap-2 text-muted-foreground">
              <Phone className="h-4 w-4" />
              <a href={`tel:${order.customer_phone}`} className="hover:text-foreground hover:underline">
                {order.customer_phone}
              </a>
            </p>
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
            <div className="flex items-start gap-2 text-sm">
              <MapPin className="mt-0.5 h-4 w-4 flex-shrink-0 text-muted-foreground" />
              <div className="space-y-0.5">
                <p>{order.address}</p>
                <p>
                  {order.postal_code} {order.city}
                </p>
                <p className="font-medium">{order.country}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Items with photos + sizes */}
      <div className="mt-6 rounded-md border border-border p-5">
        <h3 className="mb-4 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
          <PackageIcon className="h-4 w-4" />
          Produits commandés ({items.reduce((s, it) => s + it.quantity, 0)})
        </h3>
        <ul className="divide-y divide-border">
          {items.map((it) => {
            const size = extractSizeFromId(it.id);
            const product = it.product_id ? products[it.product_id] : null;
            const imgSrc = resolveProductImage(product?.slug, product?.image_url, 0);
            return (
              <li key={it.id} className="flex gap-4 py-4">
                <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-foreground">
                  {imgSrc ? (
                    <img src={imgSrc} alt={it.product_name} className="h-full w-full object-cover" />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-xs text-background/60">
                      —
                    </div>
                  )}
                </div>
                <div className="flex flex-1 flex-col justify-between">
                  <div>
                    <p className="font-medium">{it.product_name}</p>
                    <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground">
                      {size && (
                        <span className="rounded border border-border bg-muted/40 px-2 py-0.5 font-medium uppercase tracking-wider text-foreground">
                          Taille {size}
                        </span>
                      )}
                      <span>
                        Qté : <strong className="text-foreground">{it.quantity}</strong>
                      </span>
                      <span>Prix unitaire : {formatPrice(it.unit_price_cents)}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right text-sm font-semibold">
                  {formatPrice(it.unit_price_cents * it.quantity)}
                </div>
              </li>
            );
          })}
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

      {/* Customer message */}
      {order.notes && (
        <div className="mt-6 rounded-md border border-accent/30 bg-accent/5 p-5">
          <h3 className="mb-2 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-accent">
            <MessageSquare className="h-4 w-4" />
            Message du client
          </h3>
          <p className="whitespace-pre-wrap text-sm leading-relaxed">{order.notes}</p>
        </div>
      )}
    </div>
  );
}
