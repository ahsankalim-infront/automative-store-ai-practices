import type { Product } from "@/types";

/** True when the product can be sold (stock must be greater than zero). */
export function isProductSellable(product: Pick<Product, "stock" | "inStock">): boolean {
  return Number(product.stock) > 0 && product.inStock !== false;
}

/**
 * Clamp stock and force sold-out when stock is 0 or below.
 * Keeps an explicit admin `inStock: false` even when stock remains.
 */
export function normalizeProductAvailability<T extends Pick<Product, "stock" | "inStock">>(
  product: T
): T {
  const stock = Math.max(0, Number(product.stock) || 0);
  return {
    ...product,
    stock,
    inStock: stock > 0 && product.inStock !== false,
  };
}
