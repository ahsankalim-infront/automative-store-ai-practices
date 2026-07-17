import { getProducts, createProduct, updateProduct, deleteProduct, getProductById } from "@/lib/data/repositories";
import { ok, fail, requireAdmin, notFound } from "@/lib/api/helpers";
import { logActivityFromRequest, actorFromJwt } from "@/lib/activity-log";
import type { Product } from "@/types";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getProducts({ includeInactiveCategories: true }));
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
  const created = await createProduct(product);
  await logActivityFromRequest(request, {
    action: "products.create",
    category: "admin",
    message: `Created product ${created.name}`,
    ...actorFromJwt(auth),
    entityType: "products",
    entityId: created.id,
  });
  return ok(created, 201);
}
