/**
 * Bandeau d'offre dégressive — placé sur les pages produits & collection.
 */
export function PriceTiers({ compact = false }: { compact?: boolean }) {
  const tiers = [
    { qty: "1", price: "40€", note: "à l'unité" },
    { qty: "2", price: "70€", note: "soit 35€ pièce" },
    { qty: "3", price: "100€", note: "soit ~33€ pièce" },
  ];
  if (compact) {
    return (
      <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-medium uppercase tracking-wider text-foreground">
        <span className="text-accent">★</span>
        {tiers.map((t, i) => (
          <span key={t.qty} className="flex items-center gap-2">
            <span>{t.qty} = <strong>{t.price}</strong></span>
            {i < tiers.length - 1 && <span className="text-muted-foreground">·</span>}
          </span>
        ))}
      </div>
    );
  }
  return (
    <section className="bg-foreground px-4 py-10 text-background md:py-14">
      <div className="mx-auto max-w-5xl text-center">
        <p className="text-xs font-medium uppercase tracking-[0.3em] text-accent">Offre exclusive</p>
        <h2 className="mt-3 font-display text-3xl font-light md:text-4xl">
          Plus vous en prenez, plus c'est doux pour votre porte-monnaie
        </h2>
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.qty}
              className="rounded-sm border border-background/15 bg-background/[0.03] p-6 transition-colors hover:border-accent"
            >
              <p className="font-display text-5xl font-light text-accent">{t.qty}</p>
              <p className="mt-1 text-xs uppercase tracking-wider text-background/60">burkini{t.qty !== "1" ? "s" : ""}</p>
              <p className="mt-4 font-display text-3xl">{t.price}</p>
              <p className="mt-1 text-xs text-background/60">{t.note}</p>
            </div>
          ))}
        </div>
        <p className="mt-6 text-xs text-background/60">Tous modèles confondus · Cumulable avec la remise en main propre Bruxelles</p>
      </div>
    </section>
  );
}
