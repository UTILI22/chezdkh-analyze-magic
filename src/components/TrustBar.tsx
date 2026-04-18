import { ShieldCheck, Truck, Headphones } from "lucide-react";

const items = [
  { icon: ShieldCheck, title: "PAIEMENT 100% SÉCURISÉ", subtitle: "Données protégées" },
  { icon: Truck, title: "LIVRAISON RAPIDE & FIABLE", subtitle: "Suivi de commande" },
  { icon: Headphones, title: "SUPPORT 24/7", subtitle: "À votre écoute" },
];

export function TrustBar() {
  return (
    <section className="border-y border-border bg-background py-6 md:py-8">
      <div className="mx-auto grid max-w-6xl grid-cols-1 gap-6 px-4 sm:grid-cols-3 sm:gap-4">
        {items.map(({ icon: Icon, title, subtitle }) => (
          <div key={title} className="flex items-center justify-center gap-3 text-center sm:flex-col sm:gap-2">
            <Icon className="h-7 w-7 flex-shrink-0 text-accent" strokeWidth={1.5} />
            <div className="text-left sm:text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-foreground">{title}</p>
              <p className="mt-0.5 text-[11px] text-muted-foreground">{subtitle}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
