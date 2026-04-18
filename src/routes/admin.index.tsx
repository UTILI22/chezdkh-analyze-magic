import { createFileRoute, Link } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import * as React from "react";
import { formatPrice } from "@/lib/cart";

type Order = {
  id: string;
  order_number: string;
  customer_first_name: string;
  customer_last_name: string;
  country: string;
  total_cents: number;
  status: string;
  created_at: string;
  pickup_brussels: boolean;
};

export const Route = createFileRoute("/admin/")({
  component: OrdersList,
});

function OrdersList() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    supabase
      .from("orders")
      .select("id, order_number, customer_first_name, customer_last_name, country, total_cents, status, created_at, pickup_brussels")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  const statusInfo = (s: string): { label: string; cls: string } => {
    const map: Record<string, { label: string; cls: string }> = {
      pending: { label: "⏳ En attente", cls: "bg-yellow-100 text-yellow-900" },
      confirmed: { label: "✅ Validée", cls: "bg-blue-100 text-blue-900" },
      shipped: { label: "📦 Expédiée", cls: "bg-purple-100 text-purple-900" },
      delivered: { label: "🎉 Livrée", cls: "bg-green-100 text-green-900" },
      cancelled: { label: "✖️ Annulée", cls: "bg-red-100 text-red-900" },
    };
    return map[s] ?? { label: s, cls: "bg-muted text-muted-foreground" };
  };

  if (loading) return <p className="text-sm text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl">Commandes ({orders.length})</h2>
      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
      ) : (
        <div className="overflow-x-auto rounded-md border border-border">
          <table className="w-full text-sm">
            <thead className="bg-muted/50 text-xs uppercase tracking-wider text-muted-foreground">
              <tr>
                <th className="p-3 text-left">N°</th>
                <th className="p-3 text-left">Client</th>
                <th className="p-3 text-left">Pays</th>
                <th className="p-3 text-left">Mode</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-left">Statut</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3"></th>
              </tr>
            </thead>
            <tbody>
              {orders.map((o) => (
                <tr key={o.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3 font-mono text-xs">{o.order_number}</td>
                  <td className="p-3">
                    {o.customer_first_name} {o.customer_last_name}
                  </td>
                  <td className="p-3">{o.country}</td>
                  <td className="p-3 text-xs">
                    {o.pickup_brussels ? "🤝 Main propre" : "📦 Expédition"}
                  </td>
                  <td className="p-3 text-right font-medium">{formatPrice(o.total_cents)}</td>
                  <td className="p-3">
                    {(() => {
                      const info = statusInfo(o.status);
                      return (
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${info.cls}`}>
                          {info.label}
                        </span>
                      );
                    })()}
                  </td>
                  <td className="p-3 text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString("fr-BE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="p-3">
                    <Link
                      to="/admin/orders/$orderId"
                      params={{ orderId: o.id }}
                      className="text-accent hover:underline"
                    >
                      Voir
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
