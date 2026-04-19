import * as React from "react";
import { Link, useParams } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useCart, formatPrice } from "@/lib/cart";
import { PriceTiers } from "@/components/PriceTiers";
import { resolveProductImage } from "@/lib/product-images";
import { Check, Minus, Plus, ChevronLeft } from "lucide-react";
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

const ALL_SIZES = ["S", "M", "L", "XL", "XXL"] as const;

export default function ProductPage() {
  const { slug = "" } = useParams<{ slug: string }>();
  const { addItem, openCart } = useCart();
  const [product, setProduct] = React.useState<Product | null>(null);
  const [loading, setLoading] = React.useState(true);
  const [notFound, setNotFound] = React.useState(false);
  const [size, setSize] = React.useState<string>("");
  const [qty, setQty] = React.useState(1);
  const [activeImg, setActiveImg] = React.useState(0);

  React.useEffect(() => {
    let active = true;
    setLoading(true);
    setNotFound(false);
    setActiveImg(0);
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(slug);
    const query = supabase
      .from("products")
      .select("id, name, description, price_cents, image_url, slug, sizes, active, compare_at_price_cents");
    const exec = isUuid ? query.eq("id", slug).maybeSingle() : query.eq("slug", slug).maybeSingle();
    exec.then(({ data, error }) => {
      if (!active) return;
      if (error || !data) {
        setProduct(null);
        setNotFound(true);
        setLoading(false);
        return;
      }
      const p = data as unknown as Product;
      setProduct(p);
      const avail = p.sizes ?? [];
      setSize(avail[1] ?? avail[0] ?? "");
      setLoading(false);
      document.title = `${p.name} — Burkini pudique & élégant | QalbOfSilk`;
    });
    return () => {
      active = false;
    };
  }, [slug]);

  const images = React.useMemo(() => {
    if (!product) return [] as string[];
    return [0, 1]
      .map((i) => resolveProductImage(product.slug, product.image_url, i))
      .filter((src): src is string => Boolean(src));
  }, [product]);

  if (loading) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <p className="text-sm text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="mx-auto max-w-md px-4 py-20 text-center">
        <h1 className="font-display text-3xl">Produit introuvable</h1>
        <Link to="/burkinis" className="mt-6 inline-block text-sm uppercase tracking-wider text-accent">
          ← Retour à la collection
        </Link>
      </div>
    );
  }

  const availableSizes = product.sizes ?? [];

  const handleAdd = () => {
    if (!size || !availableSizes.includes(size)) {
      toast.error("Choisissez une taille disponible");
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
                <span
                  className={`font-display text-2xl ${
                    product.compare_at_price_cents && product.compare_at_price_cents > product.price_cents
                      ? "text-accent"
                      : "text-foreground"
                  }`}
                >
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

              <div className="mt-6">
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-foreground">Taille</p>
                  <span className="text-[11px] text-muted-foreground">Guide ci-dessous</span>
                </div>
                <div className="mt-2 flex flex-wrap gap-2">
                  {ALL_SIZES.map((s) => {
                    const available = availableSizes.includes(s);
                    const selected = size === s;
                    if (!available) {
                      return (
                        <div
                          key={s}
                          aria-disabled="true"
                          title={`Taille ${s} indisponible`}
                          className="relative flex h-11 min-w-11 cursor-not-allowed select-none items-center justify-center rounded-sm border border-border bg-muted/30 px-3 text-sm font-medium text-muted-foreground"
                        >
                          <span className="line-through opacity-60">{s}</span>
                          <span
                            aria-hidden
                            className="pointer-events-none absolute inset-0 flex items-center justify-center text-lg font-bold text-destructive"
                          >
                            ✕
                          </span>
                        </div>
                      );
                    }
                    return (
                      <button
                        key={s}
                        onClick={() => setSize(s)}
                        className={`flex h-11 min-w-11 items-center justify-center rounded-sm border px-3 text-sm font-medium transition-all ${
                          selected
                            ? "border-foreground bg-foreground text-background"
                            : "border-border text-foreground hover:border-foreground"
                        }`}
                      >
                        {s}
                      </button>
                    );
                  })}
                </div>
              </div>

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

              <button
                onClick={handleAdd}
                disabled={!product.active || availableSizes.length === 0 || !availableSizes.includes(size)}
                className="mt-6 w-full rounded-md bg-foreground py-3.5 text-xs font-medium uppercase tracking-[0.2em] text-background transition-opacity hover:opacity-90 disabled:opacity-40"
              >
                Ajouter au panier
              </button>

              <div className="mt-5 rounded-sm border border-dashed border-accent/40 bg-accent/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-accent">Offre pack</p>
                <p className="mt-1 text-sm">
                  <strong>1</strong> = 40€ · <strong>2</strong> = 70€ · <strong>3</strong> = 100€
                </p>
                <p className="mt-1 text-[11px] text-muted-foreground">Tous modèles confondus, automatique au panier.</p>
              </div>

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
