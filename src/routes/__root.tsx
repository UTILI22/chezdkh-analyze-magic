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

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "QalbOfSilk — L'élégance de la pudeur" },
      {
        name: "description",
        content:
          "QalbOfSilk — Burkinis élégants et pudiques. Remise en main propre à Bruxelles, expédition mondiale.",
      },
      { name: "author", content: "QalbOfSilk" },
      { property: "og:title", content: "QalbOfSilk — L'élégance de la pudeur" },
      {
        property: "og:description",
        content: "Burkinis élégants. Remise en main propre à Bruxelles, expédition mondiale.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "QalbOfSilk — L'élégance de la pudeur" },
      { name: "description", content: "ChezDKH Insights is a website for a fashion brand, showcasing products with detailed descriptions and imagery." },
      { property: "og:description", content: "ChezDKH Insights is a website for a fashion brand, showcasing products with detailed descriptions and imagery." },
      { name: "twitter:description", content: "ChezDKH Insights is a website for a fashion brand, showcasing products with detailed descriptions and imagery." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b30c653b-1624-4152-b864-b862e26dd565/id-preview-04f6e66c--640d362b-d491-4f90-8c25-d74564dc7d25.lovable.app-1776558122647.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/b30c653b-1624-4152-b864-b862e26dd565/id-preview-04f6e66c--640d362b-d491-4f90-8c25-d74564dc7d25.lovable.app-1776558122647.png" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
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
