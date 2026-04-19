import { Link } from "react-router-dom";
import * as React from "react";

export default function NotFoundPage() {
  React.useEffect(() => {
    document.title = "Page introuvable — QalbOfSilk";
  }, []);

  return (
    <div className="flex min-h-[60vh] items-center justify-center bg-background px-4">
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
