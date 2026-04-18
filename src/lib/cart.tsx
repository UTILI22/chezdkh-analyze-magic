import * as React from "react";

export type CartItem = {
  id: string;
  name: string;
  priceCents: number;
  imageUrl?: string | null;
  quantity: number;
};

type CartCtx = {
  items: CartItem[];
  isOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  addItem: (item: Omit<CartItem, "quantity">, qty?: number) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, qty: number) => void;
  clearCart: () => void;
  subtotalCents: number;
  itemCount: number;
};

const Ctx = React.createContext<CartCtx | null>(null);
const STORAGE_KEY = "qos.cart";

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
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + qty } : i,
        );
      }
      return [...prev, { ...item, quantity: qty }];
    });
    setIsOpen(true);
  };

  const removeItem = (id: string) => setItems((p) => p.filter((i) => i.id !== id));
  const updateQuantity = (id: string, qty: number) => {
    if (qty <= 0) return removeItem(id);
    setItems((p) => p.map((i) => (i.id === id ? { ...i, quantity: qty } : i)));
  };
  const clearCart = () => setItems([]);

  const subtotalCents = items.reduce((s, i) => s + i.priceCents * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

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
        subtotalCents,
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
