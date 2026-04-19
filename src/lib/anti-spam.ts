import { z } from "zod";

/**
 * Anti-spam helpers — protection invisible côté client.
 *
 * Stratégie défensive en couches (sans CAPTCHA visible) :
 *  1. Honeypot : un champ caché que les humains ne remplissent pas mais que
 *     les bots automatiques tendent à remplir.
 *  2. Min fill time : un humain met au moins ~3s à remplir un formulaire ;
 *     un bot le remplit instantanément.
 *  3. Validation Zod stricte : rejette URLs / HTML / caractères de contrôle
 *     dans les champs où ils n'ont rien à faire (nom, ville, notes).
 */

/** Délai minimum (ms) entre l'affichage du form et la soumission. */
export const MIN_FILL_MS = 2500;

/**
 * Vérifie le honeypot et le délai. Retourne un message d'erreur si suspect,
 * sinon `null`. On reste volontairement vague côté UX pour ne pas indiquer
 * aux bots ce qui les a bloqués.
 */
export function detectSpam(opts: {
  honeypot: string;
  startedAt: number;
  now?: number;
}): string | null {
  if (opts.honeypot && opts.honeypot.trim().length > 0) {
    return "spam_honeypot";
  }
  const elapsed = (opts.now ?? Date.now()) - opts.startedAt;
  if (elapsed < MIN_FILL_MS) {
    return "spam_too_fast";
  }
  return null;
}

/** Refuse les caractères de contrôle (sauf \n, \r, \t). */
const noControlChars = (s: string) => !/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/.test(s);

/** Refuse les URLs / liens (utile pour nom, ville, notes). */
const noUrls = (s: string) =>
  !/(https?:\/\/|www\.|<a\s|\[url=|\bbit\.ly\b|\btinyurl\b)/i.test(s);

/** Refuse les balises HTML basiques. */
const noHtml = (s: string) => !/<\/?[a-z][\s\S]*?>/i.test(s);

/** Bloc commun pour un champ texte court "propre" (nom, ville, etc.). */
export const cleanShortText = (max: number) =>
  z
    .string()
    .trim()
    .min(1, "Champ requis")
    .max(max, `Maximum ${max} caractères`)
    .refine(noControlChars, "Caractères invalides")
    .refine(noUrls, "Les liens ne sont pas autorisés")
    .refine(noHtml, "Le HTML n'est pas autorisé");

/** Bloc commun pour un texte long (notes, message). Liens autorisés ou non selon le contexte. */
export const cleanLongText = (max: number, allowUrls = false) => {
  let s = z
    .string()
    .trim()
    .max(max, `Maximum ${max} caractères`)
    .refine(noControlChars, "Caractères invalides")
    .refine(noHtml, "Le HTML n'est pas autorisé");
  if (!allowUrls) {
    s = s.refine(noUrls, "Les liens ne sont pas autorisés");
  }
  return s;
};

/** Téléphone : chiffres, espaces, +, -, (, ), . — entre 5 et 40 caractères. */
export const phoneSchema = z
  .string()
  .trim()
  .min(5, "Téléphone trop court")
  .max(40, "Téléphone trop long")
  .regex(/^[+0-9 ().\-/]+$/, "Format de téléphone invalide");

/** Email strict, max 200. */
export const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Email invalide")
  .max(200, "Email trop long");
