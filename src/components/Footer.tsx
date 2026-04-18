import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { BRAND } from "@/lib/config";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <h3 className="font-display text-2xl tracking-wider">{BRAND.name}</h3>
            <p className="mt-2 text-sm text-background/70">{BRAND.tagline}</p>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              Navigation
            </h4>
            <ul className="space-y-2 text-sm text-background/80">
              <li><Link to="/">{t("nav.home")}</Link></li>
              <li><Link to="/burkinis">{t("nav.burkinis")}</Link></li>
              <li><Link to="/contact">{t("nav.contact")}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-3 text-xs font-semibold uppercase tracking-widest text-accent">
              {t("nav.contact")}
            </h4>
            <p className="text-sm text-background/70">Bruxelles, Belgique</p>
            <p className="mt-1 text-sm text-background/70">contact@qalbofsilk.com</p>
          </div>
        </div>
        <div className="mt-10 border-t border-background/10 pt-6 text-center text-xs text-background/50">
          © {new Date().getFullYear()} {t("footer.brand")}
        </div>
      </div>
    </footer>
  );
}
