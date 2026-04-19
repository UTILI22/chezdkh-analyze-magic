import { createFileRoute, Link } from "@tanstack/react-router";
import * as React from "react";
import { Sparkles, Home, Instagram } from "lucide-react";
import { SOCIALS, WHATSAPP_NUMBER, whatsappLink } from "@/lib/config";

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

  const waHref = whatsappLink(
    `Bonjour, je viens de passer la commande ${orderNumber}. Pouvez-vous me confirmer les détails ?`,
  );
  const formattedWa = `+${WHATSAPP_NUMBER.slice(0, 2)} ${WHATSAPP_NUMBER.slice(2, 5)} ${WHATSAPP_NUMBER.slice(5, 7)} ${WHATSAPP_NUMBER.slice(7, 9)} ${WHATSAPP_NUMBER.slice(9)}`;

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

        {/* Réseaux sociaux pour suivre / contacter */}
        <div className="mt-10 w-full max-w-md">
          <p className="mb-4 text-[11px] uppercase tracking-[0.3em] text-background/50">
            Suivez-nous & restons en contact
          </p>
          <div className="flex items-center justify-center gap-4">
            <a
              href={waHref}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${formattedWa}`}
              title={`WhatsApp ${formattedWa}`}
              className="group flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg ring-2 ring-[#25D366]/30 transition-transform hover:scale-110"
            >
              <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
                <path d="M16.003 3C9.374 3 4 8.373 4 15.002c0 2.343.679 4.629 1.965 6.605L4 28l6.555-1.916a12.04 12.04 0 0 0 5.448 1.31h.005C22.633 27.394 28 22.022 28 15.394 28 12.18 26.752 9.16 24.482 6.89A11.94 11.94 0 0 0 16.003 3Zm0 21.79h-.004a9.998 9.998 0 0 1-5.094-1.395l-.366-.217-3.89 1.139 1.16-3.795-.238-.39a9.99 9.99 0 0 1-1.522-5.336c0-5.515 4.486-10.001 10-10.001 2.671 0 5.18 1.041 7.069 2.93a9.93 9.93 0 0 1 2.928 7.07c-.002 5.516-4.487 10.001-10 10.001Zm5.475-7.488c-.301-.151-1.781-.879-2.057-.979-.276-.1-.477-.151-.679.151-.201.301-.778.978-.954 1.18-.176.2-.351.226-.652.075-.301-.15-1.272-.469-2.422-1.494-.895-.799-1.499-1.785-1.674-2.087-.176-.301-.019-.464.132-.614.135-.135.301-.351.452-.527.151-.176.201-.302.302-.502.1-.201.05-.376-.026-.527-.075-.151-.679-1.638-.93-2.241-.245-.589-.495-.509-.679-.518-.176-.008-.376-.01-.577-.01-.201 0-.527.075-.804.376-.276.301-1.054 1.029-1.054 2.508 0 1.479 1.079 2.91 1.229 3.111.151.201 2.123 3.244 5.146 4.55.719.31 1.279.495 1.717.633.722.229 1.379.197 1.898.119.579-.086 1.781-.728 2.032-1.43.251-.703.251-1.305.176-1.43-.075-.125-.276-.201-.577-.351Z"/>
              </svg>
            </a>
            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Instagram ${SOCIALS.instagramHandle}`}
              title={`Instagram ${SOCIALS.instagramHandle}`}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-[#feda75] via-[#d62976] to-[#4f5bd5] text-white shadow-lg ring-2 ring-[#d62976]/30 transition-transform hover:scale-110"
            >
              <Instagram className="h-7 w-7" strokeWidth={1.8} />
            </a>
            <a
              href={SOCIALS.snapchat}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Snapchat ${SOCIALS.snapchatHandle}`}
              title={`Snapchat ${SOCIALS.snapchatHandle}`}
              className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FFFC00] text-black shadow-lg ring-2 ring-[#FFFC00]/40 transition-transform hover:scale-110"
            >
              <svg viewBox="0 0 32 32" fill="currentColor" className="h-7 w-7">
                <path d="M16.06 4c3.43 0 6.41 1.86 7.45 5.06.36 1.1.27 2.97.2 4.47l-.02.34c-.02.31.02.49.27.51.3.02.74-.13 1.13-.3.18-.08.4-.06.55.04.16.1.26.27.27.45.02.27-.16.5-.43.65-.18.1-.45.18-.7.27-.62.21-1.27.43-1.43.78-.08.18-.05.4.08.66.01.02 1.4 3.13 4.47 3.63.21.04.36.21.36.42 0 .06-.01.12-.04.18-.21.49-1.16.86-2.91 1.13-.06.09-.13.41-.17.6-.04.18-.08.37-.14.56-.07.21-.21.31-.45.31h-.02c-.13 0-.31-.02-.55-.07-.46-.1-.92-.16-1.4-.16-.27 0-.55.02-.83.07-.55.09-1.02.41-1.55.78-.78.55-1.66 1.18-3.04 1.18-.06 0-.12 0-.17-.01h-.18c-1.38 0-2.26-.63-3.04-1.18-.53-.37-1-.69-1.55-.78-.28-.05-.56-.07-.83-.07-.5 0-.95.07-1.4.17-.23.04-.41.07-.55.07h-.06c-.27 0-.41-.16-.46-.32-.06-.18-.1-.38-.14-.56-.04-.18-.11-.51-.17-.6-1.75-.27-2.7-.64-2.91-1.13-.03-.06-.04-.12-.04-.18 0-.21.15-.39.36-.42 3.07-.5 4.46-3.61 4.47-3.64.13-.26.16-.48.08-.66-.16-.35-.81-.57-1.43-.78-.25-.09-.52-.17-.7-.27-.42-.21-.49-.5-.46-.69.05-.27.31-.48.59-.48.07 0 .14.02.21.05.43.2.83.31 1.18.31.4 0 .58-.16.6-.42-.01-.16-.02-.34-.03-.51-.07-1.5-.16-3.37.2-4.47 1.05-3.21 4.04-5.08 7.5-5.08l.83-.01z"/>
              </svg>
            </a>
          </div>
          <p className="mt-3 text-xs text-background/50">
            WhatsApp&nbsp;: <span className="text-background/70">{formattedWa}</span>
          </p>
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 rounded-md border border-background/30 px-6 py-3 text-xs font-medium uppercase tracking-wider text-background transition-colors hover:bg-background hover:text-foreground"
        >
          <Home className="h-4 w-4" />
          Retour à l'accueil
        </Link>

        <p className="mt-12 text-xs text-background/40">
          Un souci ? Écrivez-nous à <a href="mailto:qalbofsilk0@gmail.com" className="underline">qalbofsilk0@gmail.com</a>
        </p>
      </div>
    </div>
  );
}
