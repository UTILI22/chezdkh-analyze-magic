import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { I18nProvider } from "@/lib/i18n";
import { CartProvider } from "@/lib/cart";
import { AnnouncementBar } from "@/components/AnnouncementBar";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CartDrawer } from "@/components/CartDrawer";
import { WhatsAppFab } from "@/components/WhatsAppFab";
import { SplashIntro } from "@/components/SplashIntro";
import { Toaster } from "@/components/ui/sonner";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <h1 className="font-display text-7xl font-light text-foreground">404</h1>
        <h2 className="mt-4 font-display text-2xl text-foreground">Page introuvable</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          La page que vous cherchez n'existe pas ou a été déplacée.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-foreground px-5 py-2.5 text-sm uppercase tracking-wider text-background transition-opacity hover:opacity-90"
          >
            Retour à l'accueil
          </Link>
        </div>
      </div>
    </div>
  );
}

const ORG_JSONLD = JSON.stringify({
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "QalbOfSilk",
  url: "https://chezdkh-analyze-magic.lovable.app",
  logo: "https://chezdkh-analyze-magic.lovable.app/favicon.ico",
  description:
    "QalbOfSilk — Burkinis élégants et pudiques. Remise en main propre à Bruxelles, expédition mondiale.",
  sameAs: [
    "https://www.instagram.com/qalb_ofsilk/",
    "https://www.snapchat.com/@qalb_ofsilk",
  ],
  contactPoint: [
    {
      "@type": "ContactPoint",
      email: "qalbofsilk0@gmail.com",
      contactType: "customer support",
      areaServed: "Worldwide",
      availableLanguage: ["French", "English"],
    },
  ],
});

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { name: "robots", content: "index, follow, max-image-preview:large" },
      { name: "author", content: "QalbOfSilk" },
      { name: "theme-color", content: "#0f0f0f" },
      { property: "og:site_name", content: "QalbOfSilk" },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "fr_FR" },
      { name: "twitter:card", content: "summary_large_image" },
      { title: "QalbOfSilk — Burkinis élégants & pudiques | L'élégance de la pudeur" },
      {
        name: "description",
        content:
          "QalbOfSilk : burkinis élégants, pudiques et confortables. Tissu séchage rapide, coupe pensée pour la pudeur. Remise en main propre à Bruxelles, livraison mondiale. Pack 2 = 70€, 3 = 100€.",
      },
      { name: "keywords", content: "burkini, burkini élégant, burkini pudique, maillot pudique, burkini Bruxelles, burkini Belgique, QalbOfSilk, mode pudique, hijab swimwear" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "canonical", href: "https://chezdkh-analyze-magic.lovable.app/" },
    ],
    scripts: [
      {
        type: "application/ld+json",
        children: ORG_JSONLD,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  return (
    <I18nProvider>
      <CartProvider>
        <SplashIntro />
        <div className="flex min-h-screen flex-col animate-fade-in">
          <AnnouncementBar />
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
          <CartDrawer />
          <WhatsAppFab />
          <Toaster />
        </div>
      </CartProvider>
    </I18nProvider>
  );
}
