import type { ProductImage } from "@/types";

export function emptyProductImage(alt = ""): ProductImage {
  return {
    id: crypto.randomUUID(),
    url: "",
    alt,
    isPrimary: false,
  };
}

/** Normalize images: drop empty URLs, ensure exactly one primary. */
export function normalizeProductImages(
  images: ProductImage[],
  fallbackAlt = ""
): ProductImage[] {
  const cleaned = images
    .map((img) => ({
      id: img.id || crypto.randomUUID(),
      url: (img.url ?? "").trim(),
      alt: (img.alt ?? fallbackAlt).trim() || fallbackAlt,
      isPrimary: Boolean(img.isPrimary),
    }))
    .filter((img) => img.url.length > 0);

  if (cleaned.length === 0) return [];

  const primaryIndex = cleaned.findIndex((img) => img.isPrimary);
  const idx = primaryIndex >= 0 ? primaryIndex : 0;

  return cleaned.map((img, i) => ({
    ...img,
    isPrimary: i === idx,
  }));
}

export function parseProductImagesFromForm(
  body: Record<string, unknown>,
  productName: string
): ProductImage[] | undefined {
  if (body.images !== undefined) {
    if (!Array.isArray(body.images)) return [];
    return normalizeProductImages(body.images as ProductImage[], productName);
  }

  const legacyUrl = (body.imageUrl as string | undefined)?.trim();
  if (legacyUrl) {
    return normalizeProductImages(
      [{ id: crypto.randomUUID(), url: legacyUrl, alt: productName, isPrimary: true }],
      productName
    );
  }

  return undefined;
}
