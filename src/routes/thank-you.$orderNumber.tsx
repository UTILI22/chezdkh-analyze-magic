import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Sparkles, MessageCircle, Home } from "lucide-react";

export const Route = createFileRoute("/thank-you/$orderNumber")({
  head: () => ({
    meta: [
      { title: "Merci pour votre commande — QalbOfSilk" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: ThankYouPage,
});

type Particle = {
  id: number;
  left: number;
  delay: number;
  duration: number;
  hue: number;
  size: number;
};

function Fireworks() {
  const [particles, setParticles] = React.useState<Particle[]>([]);

  React.useEffect(() => {
    const colors = [45, 75, 25, 0, 320, 200];
    const next: Particle[] = Array.from({ length: 60 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 1.6 + Math.random() * 1.8,
      hue: colors[Math.floor(Math.random() * colors.length)],
      size: 4 + Math.random() * 6,
    }));
    setParticles(next);
  }, []);

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {particles.map((p) => (
        <span
          key={p.id}
          className="absolute block rounded-full"
          style={{
            left: `${p.left}%`,
            bottom: "-20px",
            width: `${p.size}px`,
            height: `${p.size}px`,
            background: `oklch(0.75 0.18 ${p.hue})`,
            boxShadow: `0 0 12px 2px oklch(0.75 0.18 ${p.hue} / 0.6)`,
            animation: `firework ${p.duration}s ease-out ${p.delay}s infinite`,
          }}
        />
      ))}
      <style>{`
        @keyframes firework {
          0% { transform: translateY(0) scale(0.4); opacity: 0; }
          15% { opacity: 1; }
          70% { transform: translateY(-80vh) scale(1.2); opacity: 1; }
          100% { transform: translateY(-90vh) scale(0); opacity: 0; }
        }
      `}</style>
    </div>
  );
}

function ThankYouPage() {
  const { orderNumber } = Route.useParams();
  const [waUrl, setWaUrl] = React.useState<string | null>(null);

  React.useEffect(() => {
    try {
      const url = sessionStorage.getItem("qos.lastWa");
      if (url) setWaUrl(url);
    } catch {
      // ignore
    }
  }, []);

  return (
    <div className="relative min-h-[80vh] overflow-hidden bg-foreground">
      <Fireworks />
      <div className="relative z-10 mx-auto flex min-h-[80vh] max-w-2xl flex-col items-center justify-center px-4 py-16 text-center">
        <Sparkles className="h-12 w-12 text-accent" strokeWidth={1.5} />
        <p className="mt-4 text-xs font-medium uppercase tracking-[0.4em] text-accent">
          Commande confirmée
        </p>
        <h1 className="mt-4 font-display text-5xl font-light leading-tight text-background md:text-7xl">
          Merci pour votre commande
        </h1>
        <p className="mt-5 max-w-md text-sm text-background/70 md:text-base">
          Votre commande a bien été enregistrée. Nous revenons vers vous très rapidement avec les détails de paiement et de livraison.
        </p>

        <div className="mt-8 rounded-sm border border-accent/40 bg-background/5 px-6 py-4 backdrop-blur">
          <p className="text-[11px] uppercase tracking-[0.25em] text-background/60">Numéro de commande</p>
          <p className="mt-1 font-display text-2xl tracking-wider text-accent">{orderNumber}</p>
        </div>

        <div className="mt-10 flex flex-col items-center gap-3 sm:flex-row">
          {waUrl && (
            <a
              href={waUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-[#25D366] px-6 py-3 text-xs font-medium uppercase tracking-wider text-white transition-opacity hover:opacity-90"
            >
              <MessageCircle className="h-4 w-4" />
              Envoyer le récap WhatsApp
            </a>
          )}
          <Link
            to="/"
            className="inline-flex items-center gap-2 rounded-md border border-background/30 px-6 py-3 text-xs font-medium uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Link>
        </div>

        <p className="mt-12 text-xs text-background/40">
          Un souci ? Écrivez-nous à <a href="mailto:qalbofsilk0@gmail.com" className="underline">qalbofsilk0@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
