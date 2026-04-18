// Static mapping from product slug to imported image URL.
// Using src/assets ensures Vite bundles them reliably (works in dev + prod),
// instead of relying on /public which can be flaky in some dev setups.
import noir1 from "@/assets/products/noir-intense-1.jpeg";
import noir2 from "@/assets/products/noir-intense-2.jpeg";
import vert1 from "@/assets/products/vert-tropical-1.jpeg";
import vert2 from "@/assets/products/vert-tropical-2.jpeg";
import ciel1 from "@/assets/products/ciel-d-ete-1.jpeg";
import ciel2 from "@/assets/products/ciel-d-ete-2.jpeg";
import sable1 from "@/assets/products/sable-dore-1.jpeg";
import sable2 from "@/assets/products/sable-dore-2.jpeg";
import rose1 from "@/assets/products/rose-poudre-1.jpeg";
import rose2 from "@/assets/products/rose-poudre-2.jpeg";
import gris1 from "@/assets/products/gris-1.jpeg";
import gris2 from "@/assets/products/gris-2.jpeg";

export const PRODUCT_IMAGES: Record<string, string[]> = {
  "noir-intense": [noir1, noir2],
  "vert-tropical": [vert1, vert2],
  "ciel-d-ete": [ciel1, ciel2],
  "sable-dore": [sable1, sable2],
  "rose-poudre": [rose1, rose2],
  "gris": [gris1, gris2],
};

/**
 * Returns a usable image URL for a product.
 * - If the DB image_url points to /products/<file>, swap to bundled asset.
 * - Otherwise return the original (e.g. external URL or null).
 */
export function resolveProductImage(
  slug: string | null | undefined,
  imageUrl: string | null | undefined,
  index = 0,
): string | null {
  if (slug && PRODUCT_IMAGES[slug]?.[index]) {
    return PRODUCT_IMAGES[slug][index];
  }
  if (imageUrl?.startsWith("/products/")) {
    // Fallback: try to derive slug from filename
    const match = imageUrl.match(/\/products\/(.+?)-\d+\.jpe?g$/i);
    if (match && PRODUCT_IMAGES[match[1]]?.[index]) {
      return PRODUCT_IMAGES[match[1]][index];
    }
  }
  return imageUrl ?? null;
}
