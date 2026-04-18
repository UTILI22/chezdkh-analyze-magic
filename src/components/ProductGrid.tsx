import { useCart, formatPrice } from "@/lib/cart";
import { useI18n } from "@/lib/i18n";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
};

export function ProductGrid({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const { t } = useI18n();

  if (products.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Aucun produit disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-4">
      {products.map((p) => (
        <article key={p.id} className="group">
          <div className="aspect-[3/4] overflow-hidden rounded-sm bg-foreground">
            {p.image_url ? (
              <img
                src={p.image_url}
                alt={p.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
            ) : null}
          </div>
          <div className="mt-3 px-1">
            <h3 className="font-display text-base text-foreground md:text-lg">{p.name}</h3>
            <p className="mt-0.5 text-sm text-muted-foreground">{formatPrice(p.price_cents)}</p>
            <button
              onClick={() =>
                addItem({
                  id: p.id,
                  name: p.name,
                  priceCents: p.price_cents,
                  imageUrl: p.image_url,
                })
              }
              className="mt-3 w-full border border-foreground/80 py-2 text-[11px] font-medium uppercase tracking-[0.15em] transition-colors hover:bg-foreground hover:text-background"
            >
              {t("products.add")}
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
