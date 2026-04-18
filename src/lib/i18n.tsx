import * as React from "react";

export type Lang = "fr" | "nl" | "en";

type Dict = Record<string, string>;

const dict: Record<Lang, Dict> = {
  fr: {
    "nav.home": "Accueil",
    "nav.burkinis": "Nos Burkinis",
    "nav.contact": "Contact",
    "announce.text": "REMISE EN MAIN PROPRE SUR BRUXELLES — EXPÉDITION DANS LE MONDE ENTIER",
    "hero.eyebrow": "QalbOfSilk",
    "hero.title": "L'élégance de la pudeur",
    "hero.subtitle": "Pièces pensées avec soin, livrées avec amour.",
    "hero.cta": "Découvrir la collection",
    "category.title": "NOS BURKINIS",
    "category.subtitle": "Élégance discrète, pensée pour la pudeur",
    "products.add": "Ajouter au panier",
    "products.soon": "Bientôt disponible",
    "cart.title": "Votre panier",
    "cart.empty": "Votre panier est vide",
    "cart.subtotal": "Sous-total",
    "cart.shipping": "Livraison",
    "cart.total": "Total",
    "cart.checkout": "Valider la commande",
    "cart.continue": "Continuer mes achats",
    "checkout.title": "Finaliser votre commande",
    "checkout.firstName": "Prénom",
    "checkout.lastName": "Nom",
    "checkout.email": "Email",
    "checkout.phone": "Téléphone",
    "checkout.country": "Pays",
    "checkout.city": "Ville",
    "checkout.postal": "Code postal",
    "checkout.address": "Adresse",
    "checkout.notes": "Notes (optionnel)",
    "checkout.pickup": "Remise en main propre à Bruxelles (gratuit)",
    "checkout.pickupHint": "Disponible uniquement pour les commandes en Belgique",
    "checkout.submit": "Confirmer la commande",
    "checkout.success": "Commande envoyée ! Nous vous contacterons rapidement.",
    "checkout.whatsapp": "Envoyer par WhatsApp",
    "contact.title": "Contactez-nous",
    "contact.intro": "Une question ? Écrivez-nous, nous répondons sous 24h.",
    "footer.brand": "QalbOfSilk — Tous droits réservés",
    "lang.fr": "Français",
    "lang.nl": "Nederlands",
    "lang.en": "English",
  },
  nl: {
    "nav.home": "Home",
    "nav.burkinis": "Onze Burkini's",
    "nav.contact": "Contact",
    "announce.text": "AFHALEN MOGELIJK IN BRUSSEL — WERELDWIJDE VERZENDING",
    "hero.eyebrow": "QalbOfSilk",
    "hero.title": "De elegantie van bescheidenheid",
    "hero.subtitle": "Met zorg ontworpen, met liefde geleverd.",
    "hero.cta": "Ontdek de collectie",
    "category.title": "ONZE BURKINI'S",
    "category.subtitle": "Discrete elegantie, ontworpen voor bescheidenheid",
    "products.add": "In winkelmand",
    "products.soon": "Binnenkort beschikbaar",
    "cart.title": "Uw winkelmand",
    "cart.empty": "Uw winkelmand is leeg",
    "cart.subtotal": "Subtotaal",
    "cart.shipping": "Verzending",
    "cart.total": "Totaal",
    "cart.checkout": "Bestelling afronden",
    "cart.continue": "Verder winkelen",
    "checkout.title": "Bestelling afronden",
    "checkout.firstName": "Voornaam",
    "checkout.lastName": "Naam",
    "checkout.email": "E-mail",
    "checkout.phone": "Telefoon",
    "checkout.country": "Land",
    "checkout.city": "Stad",
    "checkout.postal": "Postcode",
    "checkout.address": "Adres",
    "checkout.notes": "Opmerkingen (optioneel)",
    "checkout.pickup": "Afhalen in Brussel (gratis)",
    "checkout.pickupHint": "Alleen beschikbaar voor bestellingen in België",
    "checkout.submit": "Bestelling bevestigen",
    "checkout.success": "Bestelling verzonden! We nemen snel contact op.",
    "checkout.whatsapp": "Verstuur via WhatsApp",
    "contact.title": "Contacteer ons",
    "contact.intro": "Een vraag? Schrijf ons, we antwoorden binnen 24u.",
    "footer.brand": "QalbOfSilk — Alle rechten voorbehouden",
    "lang.fr": "Français",
    "lang.nl": "Nederlands",
    "lang.en": "English",
  },
  en: {
    "nav.home": "Home",
    "nav.burkinis": "Our Burkinis",
    "nav.contact": "Contact",
    "announce.text": "PICK-UP AVAILABLE IN BRUSSELS — WORLDWIDE SHIPPING",
    "hero.eyebrow": "QalbOfSilk",
    "hero.title": "The elegance of modesty",
    "hero.subtitle": "Pieces crafted with care, delivered with love.",
    "hero.cta": "Discover the collection",
    "category.title": "OUR BURKINIS",
    "category.subtitle": "Discreet elegance, designed for modesty",
    "products.add": "Add to cart",
    "products.soon": "Coming soon",
    "cart.title": "Your cart",
    "cart.empty": "Your cart is empty",
    "cart.subtotal": "Subtotal",
    "cart.shipping": "Shipping",
    "cart.total": "Total",
    "cart.checkout": "Checkout",
    "cart.continue": "Continue shopping",
    "checkout.title": "Complete your order",
    "checkout.firstName": "First name",
    "checkout.lastName": "Last name",
    "checkout.email": "Email",
    "checkout.phone": "Phone",
    "checkout.country": "Country",
    "checkout.city": "City",
    "checkout.postal": "Postal code",
    "checkout.address": "Address",
    "checkout.notes": "Notes (optional)",
    "checkout.pickup": "Pick-up in Brussels (free)",
    "checkout.pickupHint": "Available only for orders in Belgium",
    "checkout.submit": "Confirm order",
    "checkout.success": "Order sent! We'll contact you soon.",
    "checkout.whatsapp": "Send via WhatsApp",
    "contact.title": "Contact us",
    "contact.intro": "A question? Write to us, we reply within 24h.",
    "footer.brand": "QalbOfSilk — All rights reserved",
    "lang.fr": "Français",
    "lang.nl": "Nederlands",
    "lang.en": "English",
  },
};

type I18nCtx = { lang: Lang; setLang: (l: Lang) => void; t: (k: string) => string };
const Ctx = React.createContext<I18nCtx | null>(null);

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLangState] = React.useState<Lang>("fr");

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = localStorage.getItem("qos.lang") as Lang | null;
    if (stored && ["fr", "nl", "en"].includes(stored)) setLangState(stored);
  }, []);

  const setLang = React.useCallback((l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("qos.lang", l);
  }, []);

  const t = React.useCallback((k: string) => dict[lang][k] ?? dict.fr[k] ?? k, [lang]);

  return <Ctx.Provider value={{ lang, setLang, t }}>{children}</Ctx.Provider>;
}

export function useI18n() {
  const ctx = React.useContext(Ctx);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
