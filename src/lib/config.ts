// Central place to configure brand & contact info.
export const BRAND = {
  name: "QalbOfSilk",
  tagline: "L'élégance de la pudeur",
};

// Format international, sans + ni espaces. Mettre le vrai numéro plus tard.
export const WHATSAPP_NUMBER = "32400000000";

export const SHIPPING_CENTS = 1000; // 10€ hors Belgique
export const FREE_SHIPPING_COUNTRY = "Belgique";

export const SOCIALS = {
  instagram: "https://www.instagram.com/qalb_ofsilk/",
  instagramHandle: "@qalb_ofsilk",
  // Remplacer par le vrai lien Snap quand fourni
  snapchat: "https://www.snapchat.com/add/qalbofsilk",
  snapchatHandle: "qalbofsilk",
  email: "qalbofsilk0@gmail.com",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
