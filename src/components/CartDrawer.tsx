import { useCart, formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import * as React from "react";

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, subtotalCents } = useCart();
  const { t } = useI18n();
  const navigate = useNavigate();

  // Close on escape
  React.useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeCart();
    };
    if (isOpen) document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-black/50" onClick={closeCart} />
      <aside className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-background shadow-2xl">
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 className="font-display text-xl">{t("cart.title")}</h2>
          <button onClick={closeCart} aria-label="Fermer le panier">
            <X className="h-5 w-5" />
          </button>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
            <button
              onClick={closeCart}
              className="rounded-md border border-border px-4 py-2 text-sm uppercase tracking-wider hover:bg-accent hover:text-accent-foreground"
            >
              {t("cart.continue")}
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-4 py-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-foreground">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <h3 className="font-medium">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} aria-label="Supprimer">
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                      <p className="mt-1 text-sm text-muted-foreground">{formatPrice(item.priceCents)}</p>
                      <div className="mt-auto flex items-center gap-2">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="rounded border border-border p-1 hover:bg-muted"
                          aria-label="Diminuer"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="w-6 text-center text-sm">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="rounded border border-border p-1 hover:bg-muted"
                          aria-label="Augmenter"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t border-border px-6 py-4">
              <div className="mb-4 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span className="font-medium">{formatPrice(subtotalCents)}</span>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  navigate({ to: "/checkout" });
                }}
                className="w-full rounded-md bg-foreground py-3 text-sm font-medium uppercase tracking-wider text-background transition-opacity hover:opacity-90"
              >
                {t("cart.checkout")}
              </button>
              <button
                onClick={closeCart}
                className="mt-2 w-full py-2 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {t("cart.continue")}
              </button>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
