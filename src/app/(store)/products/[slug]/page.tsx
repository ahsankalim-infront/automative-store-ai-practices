import type { Metadata } from "next";
import ProductDetailClient from "./product-detail-client";
import { getProductBySlug } from "@/lib/api/server";
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

export default ProductDetailClient;
