import { createFileRoute } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import * as React from "react";
import { toast } from "sonner";
import { formatPrice } from "@/lib/cart";
import { resolveProductImage } from "@/lib/product-images";

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  position: number;
  active: boolean;
  slug: string | null;
  sizes: string[];
};

export const Route = createFileRoute("/admin/products")({
  component: ProductsAdmin,
});

function ProductsAdmin() {
  const [products, setProducts] = React.useState<Product[]>([]);
  const [loading, setLoading] = React.useState(true);

  const load = () => {
    setLoading(true);
    supabase
      .from("products")
      .select("*")
      .order("position", { ascending: true })
      .then(({ data }) => {
        setProducts(data ?? []);
        setLoading(false);
      });
  };

  React.useEffect(load, []);

  const updateField = async (id: string, patch: Partial<Product>) => {
    const { error } = await supabase.from("products").update(patch).eq("id", id);
    if (error) toast.error("Erreur de sauvegarde");
    else toast.success("Sauvegardé");
    load();
  };

  if (loading) return <p className="text-sm text-muted-foreground">Chargement...</p>;

  return (
    <div>
      <h2 className="mb-4 font-display text-2xl">Produits ({products.length})</h2>
      <p className="mb-6 text-sm text-muted-foreground">
        Modifie le nom, le prix, l'URL d'image et le statut. (L'upload d'image arrivera quand tu enverras les photos.)
      </p>
      <div className="space-y-3">
        {products.map((p) => (
          <ProductRow key={p.id} product={p} onSave={updateField} />
        ))}
      </div>
    </div>
  );
}

function ProductRow({
  product,
  onSave,
}: {
  product: Product;
  onSave: (id: string, patch: Partial<Product>) => void;
}) {
  const [draft, setDraft] = React.useState(product);
  const dirty =
    draft.name !== product.name ||
    draft.description !== product.description ||
    draft.price_cents !== product.price_cents ||
    draft.image_url !== product.image_url ||
    draft.active !== product.active;

  return (
    <div className="grid gap-3 rounded-md border border-border bg-card p-4 md:grid-cols-[80px_1fr_1fr_120px_120px_auto]">
      <div className="aspect-square w-20 overflow-hidden rounded bg-foreground">
        {(() => {
          const src = resolveProductImage(draft.slug, draft.image_url, 0);
          return src ? (
            <img src={src} alt={draft.name} className="h-full w-full object-cover" />
          ) : null;
        })()}
      </div>
      <input
        className="rounded-md border border-input px-2 py-1 text-sm"
        value={draft.name}
        onChange={(e) => setDraft({ ...draft, name: e.target.value })}
      />
      <input
        className="rounded-md border border-input px-2 py-1 text-sm"
        placeholder="URL image"
        value={draft.image_url ?? ""}
        onChange={(e) => setDraft({ ...draft, image_url: e.target.value })}
      />
      <input
        type="number"
        className="rounded-md border border-input px-2 py-1 text-sm"
        value={draft.price_cents / 100}
        onChange={(e) =>
          setDraft({ ...draft, price_cents: Math.round(parseFloat(e.target.value) * 100) })
        }
      />
      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={draft.active}
          onChange={(e) => setDraft({ ...draft, active: e.target.checked })}
        />
        Actif
      </label>
      <button
        disabled={!dirty}
        onClick={() =>
          onSave(product.id, {
            name: draft.name,
            description: draft.description,
            price_cents: draft.price_cents,
            image_url: draft.image_url,
            active: draft.active,
          })
        }
        className="rounded-md bg-foreground px-3 py-1 text-xs uppercase tracking-wider text-background disabled:opacity-30"
      >
        {dirty ? "Sauver" : formatPrice(draft.price_cents)}
      </button>
    </div>
  );
}
