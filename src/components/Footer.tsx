import { Link } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { BRAND, SOCIALS } from "@/lib/config";
import { SocialRow } from "@/components/SocialIcons";
import logo from "@/assets/logo.png";

export function Footer() {
  const { t } = useI18n();
  return (
    <footer className="mt-20 border-t border-border bg-foreground text-background">
      <div className="mx-auto max-w-7xl px-6 py-12">
        <div className="grid gap-8 md:grid-cols-3">
          <div>
            <img src={logo} alt={BRAND.name} className="h-16 w-auto" />
            <p className="mt-2 text-sm text-background/70">{BRAND.tagline}</p>
            <div className="mt-4">
              <SocialRow className="text-background" iconClassName="h-4 w-4" />
            </div>
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
            <p className="mt-1 text-sm text-background/70">
              <a href={`mailto:${SOCIALS.email}`} className="hover:text-accent">{SOCIALS.email}</a>
            </p>
            <p className="mt-1 text-sm text-background/70">
              <a href={SOCIALS.instagram} target="_blank" rel="noreferrer" className="hover:text-accent">
                Instagram {SOCIALS.instagramHandle}
              </a>
            </p>
            <p className="mt-1 text-sm text-background/70">
              <a href={SOCIALS.snapchat} target="_blank" rel="noreferrer" className="hover:text-accent">
                Snapchat {SOCIALS.snapchatHandle}
              </a>
            </p>
          </div>
        </div>
        <div className="mt-10 border-t border-background/10 pt-6 text-center text-xs text-background/50">
          © {new Date().getFullYear()} {t("footer.brand")}
        </div>
      </div>
    </footer>
  );
}
