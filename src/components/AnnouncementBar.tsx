/**
 * Bandeau marquee — le translateX(-50%) suppose que le contenu soit dupliqué
 * EXACTEMENT 2 fois (donc -50% tombe pile sur le début du second bloc et la
 * boucle est invisible). Toute autre quantité crée un saut à la fin du cycle.
 */
export function AnnouncementBar() {
  const Block = () => (
    <span className="flex flex-shrink-0 items-center gap-12 px-6">
      <span>REMISE EN MAIN PROPRE SUR BRUXELLES</span>
      <span className="text-accent">✦</span>
      <span>EXPÉDITION DANS LE MONDE ENTIER</span>
      <span className="text-accent">✦</span>
    </span>
  );
  return (
    <div className="overflow-hidden border-b border-border bg-foreground py-2 text-background">
      <div className="flex w-max animate-marquee whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.2em]">
        <Block />
        <Block />
      </div>
    </div>
  );
}
