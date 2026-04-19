import * as React from "react";
import { Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { formatPrice } from "@/lib/cart";
import { Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
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

export default function AdminOrders() {
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [toDelete, setToDelete] = React.useState<Order | null>(null);
  const [deleting, setDeleting] = React.useState(false);

  const load = React.useCallback(() => {
    setLoading(true);
    supabase
      .from("orders")
      .select(
        "id, order_number, customer_first_name, customer_last_name, country, total_cents, status, created_at, pickup_brussels",
      )
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        setOrders(data ?? []);
        setLoading(false);
      });
  }, []);

  React.useEffect(() => {
    load();
  }, [load]);

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

  const confirmDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    const { error: itemsErr } = await supabase
      .from("order_items")
      .delete()
      .eq("order_id", toDelete.id);
    if (itemsErr) {
      setDeleting(false);
      toast.error("Erreur lors de la suppression des produits");
      return;
    }
    const { error } = await supabase.from("orders").delete().eq("id", toDelete.id);
    setDeleting(false);
    if (error) {
      toast.error("Erreur lors de la suppression");
      return;
    }
    toast.success(`Commande ${toDelete.order_number} supprimée`);
    setOrders((prev) => prev.filter((o) => o.id !== toDelete.id));
    setToDelete(null);
  };

  if (loading) return <p className="text-sm text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <h2 className="mb-4 font-display text-xl md:text-2xl">
        Commandes ({orders.length})
      </h2>

      {orders.length === 0 ? (
        <p className="text-sm text-muted-foreground">Aucune commande pour le moment.</p>
      ) : (
        <>
          <ul className="space-y-3 md:hidden">
            {orders.map((o) => {
              const info = statusInfo(o.status);
              return (
                <li key={o.id} className="rounded-lg border border-border bg-card p-4 shadow-sm">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] text-muted-foreground">{o.order_number}</p>
                      <p className="mt-0.5 truncate font-medium">
                        {o.customer_first_name} {o.customer_last_name}
                      </p>
                    </div>
                    <span className={`flex-shrink-0 rounded-full px-2 py-0.5 text-[10px] font-medium ${info.cls}`}>
                      {info.label}
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs text-muted-foreground">
                    <span>{o.pickup_brussels ? "🤝 Main propre" : `📦 ${o.country}`}</span>
                    <span className="font-semibold text-foreground">{formatPrice(o.total_cents)}</span>
                  </div>

                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {new Date(o.created_at).toLocaleString("fr-BE", {
                      day: "2-digit",
                      month: "2-digit",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>

                  <div className="mt-3 flex gap-2">
                    <Link
                      to={`/admin/orders/${o.id}`}
                      className="flex flex-1 items-center justify-center gap-1.5 rounded-md border border-border px-3 py-2 text-xs font-medium hover:bg-muted"
                    >
                      <Eye className="h-3.5 w-3.5" /> Voir
                    </Link>
                    <button
                      onClick={() => setToDelete(o)}
                      className="flex items-center justify-center gap-1.5 rounded-md border border-destructive/40 bg-destructive/5 px-3 py-2 text-xs font-medium text-destructive hover:bg-destructive/10"
                      aria-label="Supprimer la commande"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>

          <div className="hidden overflow-x-auto rounded-md border border-border md:block">
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
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => {
                  const info = statusInfo(o.status);
                  return (
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
                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${info.cls}`}>
                          {info.label}
                        </span>
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
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/admin/orders/${o.id}`}
                            className="inline-flex items-center gap-1 rounded-md border border-border px-2.5 py-1.5 text-xs font-medium hover:bg-muted"
                          >
                            <Eye className="h-3.5 w-3.5" /> Voir
                          </Link>
                          <button
                            onClick={() => setToDelete(o)}
                            className="inline-flex items-center gap-1 rounded-md border border-destructive/40 bg-destructive/5 px-2.5 py-1.5 text-xs font-medium text-destructive hover:bg-destructive/10"
                            aria-label="Supprimer la commande"
                          >
                            <Trash2 className="h-3.5 w-3.5" /> Supprimer
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </>
      )}

      <AlertDialog open={!!toDelete} onOpenChange={(open) => !open && setToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Supprimer cette commande ?</AlertDialogTitle>
            <AlertDialogDescription>
              {toDelete && (
                <>
                  La commande <strong>{toDelete.order_number}</strong> de{" "}
                  {toDelete.customer_first_name} {toDelete.customer_last_name} sera
                  définitivement supprimée. Cette action est irréversible.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                confirmDelete();
              }}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Suppression..." : "Supprimer"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
