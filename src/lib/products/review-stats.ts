import type { Product, Review } from "@/types";

export interface ProductReviewStats {
  rating: number;
  reviewCount: number;
}

export function computeReviewStats(reviews: Review[]): ProductReviewStats {
  if (!reviews.length) return { rating: 0, reviewCount: 0 };
  const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
  return {
    rating: Math.round((sum / reviews.length) * 10) / 10,
    reviewCount: reviews.length,
  };
}

export function buildReviewStatsMap(reviews: Review[]): Map<string, ProductReviewStats> {
  const sums = new Map<string, { total: number; count: number }>();
  for (const review of reviews) {
    const cur = sums.get(review.productId) ?? { total: 0, count: 0 };
    cur.total += review.rating;
    cur.count += 1;
    sums.set(review.productId, cur);
  }

  const stats = new Map<string, ProductReviewStats>();
  for (const [productId, { total, count }] of sums) {
    stats.set(productId, {
      rating: Math.round((total / count) * 10) / 10,
      reviewCount: count,
    });
  }
  return stats;
}

export function attachReviewStatsToProducts(
  products: Product[],
  reviews: Review[]
): Product[] {
  const statsMap = buildReviewStatsMap(reviews);
  return products.map((product) => {
    const stats = statsMap.get(product.id);
    return {
      ...product,
      rating: stats?.rating ?? 0,
      reviewCount: stats?.reviewCount ?? 0,
    };
  });
}

export function attachReviewStatsToProduct(product: Product, reviews: Review[]): Product {
  const stats = computeReviewStats(reviews.filter((r) => r.productId === product.id));
  return { ...product, ...stats };
}
