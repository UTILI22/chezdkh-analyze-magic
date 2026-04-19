import * as React from "react";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
  quantity: number;
  size?: string | null;
};

type CartCtx = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  /** key = `${item.id}__${item.size ?? ""}` */
  removeItem: (key: string) => void;
  updateQuantity: (key: string, qty: number) => void;
  clearCart: () => void;
  /** Total brut (somme des prix unitaires × quantité) — sert au comparatif */
  rawSubtotalCents: number;
  /** Sous-total après application du tarif dégressif burkinis */
  subtotalCents: number;
  /** Économie réalisée grâce au dégressif */
  discountCents: number;
  itemCount: number;
};

const Ctx = React.createContext<CartCtx | null>(null);
const STORAGE_KEY = "qos.cart.v2";

/**
 * Tarif dégressif burkinis (tous modèles confondus) :
 *  1 = 40€, 2 = 70€, 3 = 100€, puis +30€/unité au-delà.
 *  Le sous-total écrase la somme brute (ex: 2× Noir + 1× Gris = 100€).
 */
export function computeBurkiniTotal(qty: number): number {
  if (qty <= 0) return 0;
  if (qty === 1) return 4000;
  if (qty === 2) return 7000;
  // 3 = 10000, ensuite +3000 par unité supplémentaire
  return 10000 + (qty - 3) * 3000;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = React.useState<CartItem[]>([]);
  const [isOpen, setIsOpen] = React.useState(false);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // ignore
    }
  }, []);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const addItem: CartCtx["addItem"] = (item, qty = 1) => {
    setItems((prev) => {
      // Ligne unique = même produit + même taille
      const existing = prev.find((i) => i.id === item.id && (i.size ?? null) === (item.size ?? null));
      if (existing) {
        return prev.map((i) =>
          i === existing ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsOpen(true);
  };

  // Clé d'une ligne = `${item.id}__${item.size ?? ""}` — permet de gérer
  // plusieurs lignes du même produit en tailles différentes sans interférence.
  const matchKey = (i: CartItem, key: string) => `${i.id}__${i.size ?? ""}` === key;
  const removeItem = (key: string) => setItems((p) => p.filter((i) => !matchKey(i, key)));
  const updateQuantity = (key: string, qty: number) => {
    if (qty <= 0) return removeItem(key);
    setItems((p) => p.map((i) => (matchKey(i, key) ? { ...i, quantity: qty } : i)));
  };
  const clearCart = () => setItems([]);

  const rawSubtotalCents = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);
  const subtotalCents = computeBurkiniTotal(itemCount);
  const discountCents = Math.max(0, rawSubtotalCents - subtotalCents);

  return (
    <Ctx.Provider
      value={{
        items,
        isOpen,
        openCart: () => setIsOpen(true),
        closeCart: () => setIsOpen(false),
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        rawSubtotalCents,
        subtotalCents,
        discountCents,
        itemCount,
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useCart() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}

export const formatPrice = (cents: number) =>
  `${(cents / 100).toFixed(2).replace(".", ",")} €`;
