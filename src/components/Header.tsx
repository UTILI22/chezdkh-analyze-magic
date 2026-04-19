import { Link } from "@tanstack/react-router";
import { Menu, ShoppingBag, X } from "lucide-react";
import * as React from "react";
import { useI18n } from "@/lib/i18n";
import { useCart } from "@/lib/cart";
import { LangSwitcher } from "@/components/LangSwitcher";
import { BRAND } from "@/lib/config";
import logo from "@/assets/logo.png";

export function Header() {
  const { t } = useI18n();
  const { itemCount, openCart } = useCart();
  const [mobileOpen, setMobileOpen] = React.useState(false);

  const links = [
    { to: "/", label: t("nav.home") },
    { to: "/burkinis", label: t("nav.burkinis") },
    { to: "/contact", label: t("nav.contact") },
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="relative mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:h-20 md:px-6">
        {/* Mobile: menu button left */}
        <button
          onClick={() => setMobileOpen(true)}
          className="rounded-md p-2 text-foreground md:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-5 w-5" />
        </button>

        {/* Logo: larger than the bar — overflows visually without changing bar height */}
        <Link
          to="/"
          className="pointer-events-auto absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 md:left-6 md:translate-x-0"
          aria-label={BRAND.name}
        >
          <img
            src={logo}
            alt={`${BRAND.name} — ${BRAND.tagline}`}
            className="h-20 w-auto md:h-24"
            style={{ filter: "invert(1) hue-rotate(180deg)" }}
          />
        </Link>

        {/* Desktop nav — perfectly centered, independent from the logo */}
        <nav className="pointer-events-none absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 items-center gap-8 md:flex">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              className="pointer-events-auto text-sm font-medium uppercase tracking-wider text-foreground/80 transition-colors hover:text-accent"
              activeProps={{ className: "text-accent" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* Right: lang + cart */}
        <div className="relative z-20 ml-auto flex items-center gap-2 bg-background/95 pl-2">
          <LangSwitcher />
          <button
            onClick={openCart}
            className="relative rounded-md p-2 text-foreground transition-colors hover:text-accent"
            aria-label="Ouvrir le panier"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold text-accent-foreground">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div className="absolute left-0 top-0 h-full w-72 max-w-[80vw] bg-background p-6 shadow-xl">
            <div className="mb-8 flex items-center justify-between">
              <span className="font-display text-xl">{BRAND.name}</span>
              <button onClick={() => setMobileOpen(false)} aria-label="Fermer">
                <X className="h-5 w-5" />
              </button>
            </div>
            <nav className="flex flex-col gap-4">
              {links.map((l) => (
                <Link
                  key={l.to}
                  to={l.to}
                  onClick={() => setMobileOpen(false)}
                  className="border-b border-border py-2 text-sm font-medium uppercase tracking-wider"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="mt-8">
              <LangSwitcher />
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
