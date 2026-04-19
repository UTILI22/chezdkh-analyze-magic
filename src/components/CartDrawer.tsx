import { useCart, formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";
import { useNavigate } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import * as React from "react";
import { SocialRow } from "@/components/SocialIcons";

export function CartDrawer() {
  const {
    isOpen,
    closeCart,
    items,
    removeItem,
    updateQuantity,
    rawSubtotalCents,
    subtotalCents,
    discountCents,
    itemCount,
  } = useCart();
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

  // Lock body scroll while open — restore to empty string (not a captured value
  // which can wrongly be "hidden" if the drawer reopens before cleanup runs).
  React.useEffect(() => {
    if (typeof document === "undefined") return;
    if (isOpen) {
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = "";
      };
    } else {
      document.body.style.overflow = "";
    }
  }, [isOpen]);

  // Tarif suivant pour incitation
  const nextStep = (() => {
    if (itemCount === 0) return { qty: 1, price: 4000, save: 0 };
    if (itemCount === 1) return { qty: 2, price: 7000, save: 1000 };
    if (itemCount === 2) return { qty: 3, price: 10000, save: 2000 };
    return null;
  })();

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        aria-hidden={!isOpen}
        className={`fixed inset-0 z-50 bg-black/50 transition-opacity duration-300 ease-out ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      {/* Drawer panel — narrow, slides from the right */}
      <aside
        role="dialog"
        aria-modal="true"
        aria-label={t("cart.title")}
        className={`fixed right-0 top-0 z-50 flex h-full w-[88vw] max-w-[400px] flex-col bg-background shadow-2xl transition-transform duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header with brand + socials */}
        <div className="border-b border-border px-5 py-4">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl tracking-wide">{t("cart.title")}</h2>
            <button
              onClick={closeCart}
              aria-label="Fermer le panier"
              className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3">
            <SocialRow iconClassName="h-4 w-4" className="text-foreground/70" />
          </div>
        </div>

        {items.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-6 text-center">
            <ShoppingBag className="h-12 w-12 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">{t("cart.empty")}</p>
            <button
              onClick={closeCart}
              className="rounded-md border border-border px-4 py-2 text-xs uppercase tracking-wider hover:bg-accent hover:text-accent-foreground"
            >
              {t("cart.continue")}
            </button>
          </div>
        ) : (
          <>
            {/* Promo banner */}
            <div className="border-b border-border bg-accent/10 px-5 py-2.5 text-[11px] font-medium uppercase tracking-wider text-accent-foreground">
              <span className="text-accent">★</span> 1 = 40€ · 2 = 70€ · 3 = 100€
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              <ul className="divide-y divide-border">
                {items.map((item) => (
                  <li key={item.id + (item.size ?? "")} className="flex gap-3 py-4">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-md bg-foreground">
                      {item.imageUrl ? (
                        <img src={item.imageUrl} alt={item.name} className="h-full w-full object-cover" />
                      ) : null}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex justify-between gap-2">
                        <h3 className="text-sm font-medium leading-tight">{item.name}</h3>
                        <button onClick={() => removeItem(item.id)} aria-label="Supprimer">
                          <Trash2 className="h-4 w-4 text-muted-foreground hover:text-destructive" />
                        </button>
                      </div>
                      {item.size && (
                        <p className="mt-0.5 text-[11px] uppercase tracking-wider text-muted-foreground">
                          Taille : {item.size}
                        </p>
                      )}
                      <p className="mt-0.5 text-xs text-muted-foreground">{formatPrice(item.priceCents)}</p>
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

              {nextStep && (
                <div className="mt-4 rounded-md border border-dashed border-accent/50 bg-accent/5 p-3 text-center text-xs text-foreground">
                  ✦ Ajoutez 1 burkini pour passer à <strong>{nextStep.qty} = {formatPrice(nextStep.price)}</strong>
                  {nextStep.save > 0 && <span> (économisez {formatPrice(nextStep.save)})</span>}
                </div>
              )}
            </div>

            <div className="border-t border-border px-5 py-4">
              {discountCents > 0 && (
                <div className="mb-2 flex items-center justify-between text-xs text-accent">
                  <span>Réduction pack</span>
                  <span className="font-medium">− {formatPrice(discountCents)}</span>
                </div>
              )}
              <div className="mb-3 flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{t("cart.subtotal")}</span>
                <span className="font-semibold">
                  {discountCents > 0 && (
                    <span className="mr-2 text-xs text-muted-foreground line-through">
                      {formatPrice(rawSubtotalCents)}
                    </span>
                  )}
                  {formatPrice(subtotalCents)}
                </span>
              </div>
              <button
                onClick={() => {
                  closeCart();
                  navigate({ to: "/checkout" });
                }}
                className="w-full rounded-md bg-foreground py-3 text-xs font-medium uppercase tracking-wider text-background transition-opacity hover:opacity-90"
              >
                {t("cart.checkout")}
              </button>
              <button
                onClick={closeCart}
                className="mt-2 w-full py-2 text-[11px] uppercase tracking-wider text-muted-foreground hover:text-foreground"
              >
                {t("cart.continue")}
              </button>
            </div>
          </>
        )}
      </aside>
    </>
  );
}
