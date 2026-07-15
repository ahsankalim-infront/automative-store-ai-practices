import { getProductBySlug } from "@/lib/data/repositories";
import { ok, notFound } from "@/lib/api/helpers";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return notFound("Product not found");
  return ok(product);
}
