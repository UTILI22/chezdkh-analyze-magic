// Central place to configure brand & contact info.
// Replace WHATSAPP_NUMBER with your real number (international format, no + or spaces).
export const BRAND = {
  name: "QalbOfSilk",
  tagline: "L'élégance de la pudeur",
};

// e.g. "32470000000" for Belgian +32 470 00 00 00
export const WHATSAPP_NUMBER = "32400000000";

export const SHIPPING_CENTS = 1000; // 10€ outside Belgium
export const FREE_SHIPPING_COUNTRY = "Belgique";

export function whatsappLink(message: string) {
  return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}
