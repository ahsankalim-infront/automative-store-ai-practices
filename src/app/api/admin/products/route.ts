import { getProducts, createProduct, updateProduct, deleteProduct, getProductById } from "@/lib/data/repositories";
import { ok, fail, requireAdmin, notFound } from "@/lib/api/helpers";
import type { Product } from "@/types";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getProducts());
}

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const body = (await request.json()) as Product;
  const product: Product = {
    ...body,
    id: body.id || crypto.randomUUID(),
    createdAt: body.createdAt || new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
  return ok(await createProduct(product), 201);
}
