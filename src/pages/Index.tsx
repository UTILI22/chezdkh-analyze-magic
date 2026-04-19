import * as React from "react";
import { Link } from "react-router-dom";
import { useI18n } from "@/lib/i18n";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustBar } from "@/components/TrustBar";
import { PriceTiers } from "@/components/PriceTiers";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  slug: string | null;
  compare_at_price_cents: number | null;
};

export default function IndexPage() {
  const { t } = useI18n();
  const [products, setProducts] = React.useState<Product[]>([]);

  React.useEffect(() => {
    document.title = "QalbOfSilk — Burkinis élégants & pudiques | Bruxelles & livraison mondiale";
  }, []);

  React.useEffect(() => {
    let active = true;
    supabase
      .from("products")
      .select("id, name, description, price_cents, image_url, slug, compare_at_price_cents")
      .eq("active", true)
      .order("position", { ascending: true })
      .then(({ data, error }) => {
        if (!active) return;
        if (error) {
          console.error(error);
          setProducts([]);
          return;
        }
        setProducts((data ?? []) as unknown as Product[]);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div>
      <section className="bg-background px-4 py-10 md:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <p className="mb-3 text-xs font-medium uppercase tracking-[0.3em] text-accent">
            {t("hero.eyebrow")}
          </p>
          <h1 className="font-display text-4xl font-light leading-tight text-foreground md:text-6xl">
            {t("hero.title")}
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-sm text-muted-foreground md:text-base">
            {t("hero.subtitle")}
          </p>

          <Link
            to="/burkinis"
            className="mt-8 inline-flex items-center justify-center rounded-md border border-foreground bg-foreground px-8 py-3 text-xs font-medium uppercase tracking-[0.2em] text-background transition-all hover:bg-transparent hover:text-foreground"
          >
            {t("hero.cta")}
          </Link>
        </div>
      </section>

      <PriceTiers />

      <TrustBar />

      <section className="border-b border-border bg-cream px-4 py-12 md:py-16">
        <div className="mx-auto max-w-5xl text-center">
          <h2 className="font-display text-3xl font-light tracking-[0.15em] text-foreground md:text-4xl">
            {t("category.title")}
          </h2>
          <p className="mx-auto mt-3 max-w-md text-sm italic text-muted-foreground md:text-base">
            {t("category.subtitle")}
          </p>
        </div>
      </section>

      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <ProductGrid products={products} />
        </div>
      </section>
    </div>
  );
}
