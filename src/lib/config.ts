// Central place to configure brand & contact info.
export const BRAND = {
  name: "QalbOfSilk",
  tagline: "L'élégance & la pudeur",
};

const DEFAULT_SITE_URL = "http://qalbofsilk.shop";

export const SITE_URL = String(import.meta.env.VITE_SITE_URL ?? DEFAULT_SITE_URL).replace(/\/+$/, "");

export function absoluteUrl(pathname: string = "/") {
  if (!pathname) return `${SITE_URL}/`;
  if (pathname === "/") return `${SITE_URL}/`;
  return `${SITE_URL}${pathname.startsWith("/") ? pathname : `/${pathname}`}`;
}

// Format international, sans + ni espaces. Mettre le vrai numéro plus tard.
export const WHATSAPP_NUMBER = "32465452912";

export const SHIPPING_CENTS = 1000; // 10€ hors Belgique
export const FREE_SHIPPING_COUNTRY = "Belgique";

export const SOCIALS = {
  instagram: "https://www.instagram.com/qalb_ofsilk/",
  instagramHandle: "@qalb_ofsilk",
  snapchat: "https://www.snapchat.com/@qalb_ofsilk",
  snapchatHandle: "@qalb_ofsilk",
  email: "qalbofsilk0@gmail.com",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
