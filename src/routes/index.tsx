import { createFileRoute, Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ProductGrid } from "@/components/ProductGrid";
import { TrustBar } from "@/components/TrustBar";
import { PriceTiers } from "@/components/PriceTiers";
import { supabase } from "@/integrations/supabase/client";
import { absoluteUrl } from "@/lib/config";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
  slug: string | null;
  compare_at_price_cents: number | null;
};

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "QalbOfSilk — Burkinis élégants & pudiques | Bruxelles & livraison mondiale" },
      {
        name: "description",
        content:
          "Découvrez QalbOfSilk : burkinis pudiques au tissu séchage rapide, coupe élégante et confortable. Pack 2 = 70€, 3 = 100€. Remise en main propre à Bruxelles, expédition mondiale.",
      },
      { property: "og:title", content: "QalbOfSilk — Burkinis élégants & pudiques" },
      {
        property: "og:description",
        content:
          "Burkinis pudiques, élégants et confortables. Pack 2 = 70€, 3 = 100€. Bruxelles & livraison mondiale.",
      },
      { name: "twitter:title", content: "QalbOfSilk — Burkinis élégants & pudiques" },
      {
        name: "twitter:description",
        content: "Burkinis pudiques. Pack 2 = 70€, 3 = 100€. Bruxelles & monde.",
      },
    ],
    links: [{ rel: "canonical", href: absoluteUrl("/") }],
  }),
  loader: async (): Promise<{ products: Product[] }> => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price_cents, image_url, slug, compare_at_price_cents" as "*")
      .eq("active", true)
      .order("position", { ascending: true });
    if (error) {
      console.error(error);
      return { products: [] };
    }
    return { products: (data ?? []) as unknown as Product[] };
  },
  component: Index,
});

function Index() {
  const { t } = useI18n();
  const { products } = Route.useLoaderData();

  return (
    <div>
      {/* Hero (texte uniquement, image retirée) */}
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

      {/* Offre exclusive — remontée juste sous le hero */}
      <PriceTiers />

      <TrustBar />

      {/* Category title under hero */}
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

      {/* Products preview */}
      <section className="px-4 py-12 md:py-16">
        <div className="mx-auto max-w-7xl">
          <ProductGrid products={products} />
        </div>
      </section>

    </div>
  );
}
