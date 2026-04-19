import { Link } from "@tanstack/react-router";
import { formatPrice } from "@/lib/cart";
import { resolveProductImage } from "@/lib/product-images";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  slug?: string | null;
  compare_at_price_cents?: number | null;
};

export function ProductGrid({ products }: { products: Product[] }) {
  if (products.length === 0) {
    return (
      <p className="text-center text-sm text-muted-foreground">
        Aucun produit disponible pour le moment.
      </p>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6 lg:grid-cols-3">
      {products.map((p) => {
        const slug = p.slug ?? p.id;
        const imgSrc = resolveProductImage(p.slug, p.image_url, 0);
        return (
          <Link
            key={p.id}
            to="/product/$slug"
            params={{ slug }}
            className="group block"
          >
            <div className="aspect-[3/4] overflow-hidden rounded-sm bg-foreground">
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={p.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
              ) : null}
            </div>
            <div className="mt-3 px-1">
              <h3 className="font-display text-base text-foreground md:text-lg">{p.name}</h3>
              <p className="mt-0.5 flex items-center gap-2 text-sm">
                {p.compare_at_price_cents && p.compare_at_price_cents > p.price_cents ? (
                  <span className="text-muted-foreground line-through">
                    {formatPrice(p.compare_at_price_cents)}
                  </span>
                ) : null}
                <span className={p.compare_at_price_cents && p.compare_at_price_cents > p.price_cents ? "font-semibold text-accent" : "text-muted-foreground"}>
                  {formatPrice(p.price_cents)}
                </span>
              </p>
              <p className="mt-3 inline-block border-b border-foreground/40 pb-0.5 text-[11px] font-medium uppercase tracking-[0.15em] text-foreground transition-colors group-hover:border-accent group-hover:text-accent">
                Voir le produit
              </p>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
