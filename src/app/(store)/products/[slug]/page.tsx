import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetailClient from "./product-detail-client";
import { getProductBySlug, getProducts, getReviews } from "@/lib/data/repositories";
import { buildPageMetadata, buildProductMetadata } from "@/lib/seo/metadata";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) {
    return buildPageMetadata("products");
  }
  return buildProductMetadata(product);
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const [categoryProducts, reviews] = await Promise.all([
    getProducts({ category: product.categorySlug }),
    getReviews(product.id),
  ]);
  const related = categoryProducts.filter((p) => p.id !== product.id).slice(0, 4);

  return (
    <ProductDetailClient product={product} reviews={reviews} related={related} />
  );
}
