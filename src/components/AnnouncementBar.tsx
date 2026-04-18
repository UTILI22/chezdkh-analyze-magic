import { useI18n } from "@/lib/i18n";

export function AnnouncementBar() {
  const { t } = useI18n();
  const text = t("announce.text");
  // Repeat for marquee continuity
  const items = Array.from({ length: 6 }, (_, i) => i);
  return (
    <div className="overflow-hidden border-b border-border bg-foreground py-2 text-background">
      <div className="flex w-max animate-marquee gap-12 whitespace-nowrap text-[11px] font-medium uppercase tracking-[0.2em]">
        {items.map((i) => (
          <span key={i} className="flex items-center gap-12">
            <span className="flex items-center gap-3">
              <span>REMISE EN MAIN PROPRE SUR BRUXELLES</span>
              <span className="text-accent">✦</span>
              <span>EXPÉDITION DANS LE MONDE ENTIER</span>
            </span>
            <span className="text-accent">✦</span>
          </span>
        ))}
      </div>
    </div>
  );
}
