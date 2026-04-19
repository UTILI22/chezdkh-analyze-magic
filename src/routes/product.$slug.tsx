import { createFileRoute, Link, notFound, useRouter } from "@tanstack/react-router";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatPrice } from "@/lib/cart";
import { PriceTiers } from "@/components/PriceTiers";
import { resolveProductImage } from "@/lib/product-images";
import { Check, Minus, Plus, ChevronLeft } from "lucide-react";
import * as React from "react";
import { toast } from "sonner";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  slug: string | null;
  sizes: string[];
  active: boolean;
  compare_at_price_cents: number | null;
};

export const Route = createFileRoute("/product/$slug")({
  loader: async ({ params }): Promise<{ product: Product }> => {
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(params.slug);
    const query = supabase
      .from("products")
      .select("id, name, description, price_cents, image_url, slug, sizes, active, compare_at_price_cents" as "*");
    const { data, error } = isUuid
      ? await query.eq("id", params.slug).maybeSingle()
      : await query.eq("slug", params.slug).maybeSingle();
    if (error || !data) throw notFound();
    return { product: data as unknown as Product };
  },
  head: ({ loaderData, params }) => {
    if (!loaderData) return {};
    const p = loaderData.product;
    const url = `https://chezdkh-analyze-magic.lovable.app/product/${params.slug}`;
    const priceEur = (p.price_cents / 100).toFixed(2);
    const productJsonLd = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "Product",
      name: p.name,
      description: p.description ?? `${p.name} — Burkini QalbOfSilk`,
      image: p.image_url ? [p.image_url] : undefined,
      sku: p.id,
      brand: { "@type": "Brand", name: "QalbOfSilk" },
      offers: {
        "@type": "Offer",
        url,
        priceCurrency: "EUR",
        price: priceEur,
        availability: p.active
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
        itemCondition: "https://schema.org/NewCondition",
      },
    });
    return {
      meta: [
        { title: `${p.name} — Burkini pudique & élégant | QalbOfSilk` },
        {
          name: "description",
          content: p.description ?? `${p.name} — Burkini QalbOfSilk, élégant et pudique. Tissu séchage rapide, livraison mondiale.`,
        },
        { property: "og:title", content: `${p.name} — QalbOfSilk` },
        { property: "og:description", content: p.description ?? `${p.name} — Burkini QalbOfSilk` },
        { property: "og:type", content: "product" },
        { name: "twitter:title", content: `${p.name} — QalbOfSilk` },
        { name: "twitter:description", content: p.description ?? `${p.name} — Burkini QalbOfSilk` },
        ...(p.image_url
          ? [
              { property: "og:image", content: p.image_url },
              { name: "twitter:image", content: p.image_url },
            ]
          : []),
      ],
      links: [{ rel: "canonical", href: url }],
      scripts: [{ type: "application/ld+json", children: productJsonLd }],
    };
  },
  component: ProductPage,
  notFoundComponent: () => (
    <div className="mx-auto max-w-md px-4 py-20 text-center">
      <h1 className="font-display text-3xl">Produit introuvable</h1>
      <Link to="/burkinis" className="mt-6 inline-block text-sm uppercase tracking-wider text-accent">
        ← Retour à la collection
      </Link>
    </div>
  ),
  errorComponent: ({ error, reset }) => {
    const router = useRouter();
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-2xl">Une erreur est survenue</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-6 rounded-md bg-foreground px-5 py-2 text-xs uppercase tracking-wider text-background"
        >
          Réessayer
        </button>
      </div>
    );
  },
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const { addItem, openCart } = useCart();
  const [size, setSize] = React.useState<string>(product.sizes?.[1] ?? product.sizes?.[0] ?? "M");
  const [qty, setQty] = React.useState(1);
  const [activeImg, setActiveImg] = React.useState(0);

  const images = React.useMemo(() => {
    return [0, 1]
      .map((i) => resolveProductImage(product.slug, product.image_url, i))
      .filter((src): src is string => Boolean(src));
  }, [product.slug, product.image_url]);

  React.useEffect(() => {
    setActiveImg(0);
  }, [product.slug]);

  const handleAdd = () => {
    if (!size) {
      toast.error("Choisissez une taille");
      return;
    }
    addItem(
      {
        id: `${product.id}__${size}`,
        name: product.name,
        priceCents: product.price_cents,
        imageUrl: resolveProductImage(product.slug, product.image_url, 0),
        size,
      },
      qty,
    );
    openCart();
  };

  return (
    <div>
      <div className="px-4 py-6 md:py-10">
        <div className="mx-auto max-w-6xl">
          <Link
            to="/burkinis"
            className="mb-6 inline-flex items-center gap-1 text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground"
          >
            <ChevronLeft className="h-4 w-4" /> Retour à la collection
          </Link>

          <div className="grid gap-8 md:grid-cols-2 md:gap-12">
            {/* Galerie */}
            <div className="flex flex-col gap-3">
              <div className="aspect-[3/4] overflow-hidden rounded-sm bg-foreground">
                {images[activeImg] ? (
                  <img
                    src={images[activeImg]}
                    alt={`${product.name} — vue ${activeImg + 1}`}
                    className="h-full w-full object-cover"
                  />
                ) : null}
              </div>
              {images.length > 1 && (
                <div className="flex gap-3">
                  {images.map((src, i) => (
                    <button
                      key={i}
                      onClick={() => setActiveImg(i)}
                      className={`aspect-[3/4] w-20 overflow-hidden rounded-sm border-2 transition-all md:w-24 ${
                        activeImg === i
                          ? "border-foreground opacity-100"
                          : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                      aria-label={`Voir image ${i + 1}`}
                    >
                      <img
                        src={src}
                        alt={`${product.name} miniature ${i + 1}`}
                        className="h-full w-full object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col">
              <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Burkini</p>
              <h1 className="mt-2 font-display text-4xl font-light tracking-wide text-foreground md:text-5xl">
                {product.name}
              </h1>
              <div className="mt-3 flex items-baseline gap-3">
                {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents ? (
                  <span className="font-display text-xl text-muted-foreground line-through">
                    {formatPrice(product.compare_at_price_cents)}
                  </span>
                ) : null}
                <span className={`font-display text-2xl ${product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents ? "text-accent" : "text-foreground"}`}>
                  {formatPrice(product.price_cents)}
                </span>
                {product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents ? (
                  <span className="rounded-sm bg-accent/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wider text-accent">
                    Promo
                  </span>
                ) : null}
              </div>

              <div className="mt-3 flex items-center gap-2 text-sm">
                {product.active ? (
                  <>
                    <span className="flex h-2 w-2 rounded-full bg-accent" />
                    <span className="text-accent">En stock</span>
                  </>
                ) : (
                  <>
                    <span className="flex h-2 w-2 rounded-full bg-muted-foreground" />
                    <span className="text-muted-foreground">Indisponible</span>
                  </>
                )}
              </div>

              {product.description && (
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{product.description}</p>
              )}

              {/* Caractéristiques */}
              <ul className="mt-5 space-y-2 text-sm text-foreground">
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>Tissu à séchage rapide pour une sensation toujours fraîche.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>Matière respirante qui ne colle pas à la peau.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-accent" />
                  <span>Coupe pensée pour la pudeur, sans compromis sur le confort.</span>
                </li>
              </ul>

              {/* Tailles */}
              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">Taille</p>
                  <span className="text-[11px] text-muted-foreground">Guide ci-dessous</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {(product.sizes ?? ["S", "M", "L", "XL", "XXL"]).map((s: string) => (
                    <button
                      key={s}
                      onClick={() => setSize(s)}
                      className={`flex h-11 min-w-11 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-all ${
                        size === s
                          ? "border-foreground bg-foreground text-background"
                          : "border-border text-foreground hover:border-foreground"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantité */}
              <div className="mt-5">
                <p className="mb-2 text-xs font-medium uppercase tracking-[0.2em] text-foreground">Quantité</p>
                <div className="inline-flex items-center rounded-sm border border-border">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="flex h-11 w-11 items-center justify-center hover:bg-muted"
                    aria-label="Diminuer"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-12 text-center text-sm font-medium">{qty}</span>
                  <button
                    onClick={() => setQty(qty + 1)}
                    className="flex h-11 w-11 items-center justify-center hover:bg-muted"
                    aria-label="Augmenter"
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleAdd}
                disabled={!product.active}
                className="mt-6 w-full rounded-md bg-foreground py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Ajouter au panier
              </button>

              {/* Tiers compact */}
              <div className="mt-5 rounded-sm border border-dashed border-accent/40 bg-accent/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Offre pack</p>
                <p className="mt-1 text-sm">
                  <strong>1</strong> = 40€ · <strong>2</strong> = 70€ · <strong>3</strong> = 100€
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Tous modèles confondus, automatique au panier.</p>
              </div>

              {/* Guide tailles */}
              <div className="mt-6 rounded-sm bg-muted/40 p-4 text-xs leading-relaxed text-muted-foreground">
                <p className="font-semibold uppercase tracking-wider text-foreground">Guide des tailles</p>
                <p className="mt-1">
                  Notre mannequin mesure <strong className="text-foreground">1m64</strong> et porte habituellement du{" "}
                  <strong className="text-foreground">S</strong> ; sur les photos, elle porte la taille{" "}
                  <strong className="text-foreground">M</strong> pour un tombé légèrement plus fluide. Si vous hésitez
                  entre deux tailles, prenez la plus grande.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <PriceTiers />
    </div>
  );
}
