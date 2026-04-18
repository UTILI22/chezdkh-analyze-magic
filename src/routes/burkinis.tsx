import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { ProductGrid } from "@/components/ProductGrid";
import { supabase } from "@/integrations/supabase/client";

type Product = {
  id: string;
  name: string;
  description: string | null;
  price_cents: number;
  image_url: string | null;
};

export const Route = createFileRoute("/burkinis")({
  head: () => ({
    meta: [
      { title: "Nos Burkinis — QalbOfSilk" },
      {
        name: "description",
        content: "Découvrez la collection de burkinis QalbOfSilk : élégance discrète et pudeur.",
      },
      { property: "og:title", content: "Nos Burkinis — QalbOfSilk" },
    ],
  }),
  loader: async (): Promise<{ products: Product[] }> => {
    const { data, error } = await supabase
      .from("products")
      .select("id, name, description, price_cents, image_url")
      .eq("active", true)
      .order("position", { ascending: true });
    if (error) {
      console.error(error);
      return { products: [] };
    }
    return { products: data ?? [] };
  },
  component: BurkinisPage,
});

function BurkinisPage() {
  const { t } = useI18n();
  const { products } = Route.useLoaderData();
  return (
    <div className="px-4 py-12 md:py-16">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 text-center md:mb-14">
          <h1 className="font-display text-3xl font-light tracking-[0.15em] text-foreground md:text-5xl">
            {t("category.title")}
          </h1>
          <p className="mx-auto mt-3 max-w-md text-sm italic text-muted-foreground md:text-base">
            {t("category.subtitle")}
          </p>
        </header>
        <ProductGrid products={products} />
      </div>
    </div>
  );
}
