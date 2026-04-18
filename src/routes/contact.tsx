import { createFileRoute } from "@tanstack/react-router";
import { useI18n } from "@/lib/i18n";
import { whatsappLink, SOCIALS } from "@/lib/config";
import { Mail, MessageCircle, MapPin } from "lucide-react";
import { InstagramIcon, SnapchatIcon } from "@/components/SocialIcons";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact — QalbOfSilk" },
      { name: "description", content: "Contactez QalbOfSilk pour toute question sur nos burkinis." },
      { property: "og:title", content: "Contact — QalbOfSilk" },
    ],
  }),
  component: ContactPage,
});

function ContactPage() {
  const { t } = useI18n();
  return (
    <div className="px-4 py-12 md:py-20">
      <div className="mx-auto max-w-3xl text-center">
        <h1 className="font-display text-4xl font-light tracking-[0.1em] text-foreground md:text-5xl">
          {t("contact.title")}
        </h1>
        <p className="mt-4 text-muted-foreground">{t("contact.intro")}</p>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 md:grid-cols-3">
          <a
            href={whatsappLink("Bonjour QalbOfSilk,")}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-border p-6 text-center transition-colors hover:border-accent"
          >
            <MessageCircle className="mx-auto h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-lg">WhatsApp</h3>
            <p className="mt-1 text-xs text-muted-foreground">Réponse rapide</p>
          </a>
          <a
            href={`mailto:${SOCIALS.email}`}
            className="rounded-sm border border-border p-6 text-center transition-colors hover:border-accent"
          >
            <Mail className="mx-auto h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-lg">Email</h3>
            <p className="mt-1 text-xs text-muted-foreground">{SOCIALS.email}</p>
          </a>
          <a
            href={SOCIALS.instagram}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-border p-6 text-center transition-colors hover:border-accent"
          >
            <InstagramIcon className="mx-auto h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-lg">Instagram</h3>
            <p className="mt-1 text-xs text-muted-foreground">{SOCIALS.instagramHandle}</p>
          </a>
          <a
            href={SOCIALS.snapchat}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-sm border border-border p-6 text-center transition-colors hover:border-accent"
          >
            <SnapchatIcon className="mx-auto h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-lg">Snapchat</h3>
            <p className="mt-1 text-xs text-muted-foreground">{SOCIALS.snapchatHandle}</p>
          </a>
          <div className="rounded-sm border border-border p-6 text-center sm:col-span-2 md:col-span-1">
            <MapPin className="mx-auto h-7 w-7 text-accent" />
            <h3 className="mt-3 font-display text-lg">Bruxelles</h3>
            <p className="mt-1 text-xs text-muted-foreground">Remise en main propre</p>
          </div>
        </div>
      </div>
    </div>
  );
}
