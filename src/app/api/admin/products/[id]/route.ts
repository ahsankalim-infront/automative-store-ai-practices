import { getProductById, updateProduct, deleteProduct } from "@/lib/data/repositories";
import { ok, requireAdmin, notFound } from "@/lib/api/helpers";
import { logActivityFromRequest, actorFromJwt } from "@/lib/activity-log";

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;
  const product = await getProductById(id);
  if (!product) return notFound("Product not found");
  return ok(product);
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;
  const body = await request.json();
  const updated = await updateProduct(id, body);
  if (!updated) return notFound("Product not found");
  await logActivityFromRequest(request, {
    action: "products.update",
    category: "admin",
    message: `Updated product ${updated.name}`,
    ...actorFromJwt(auth),
    entityType: "products",
    entityId: id,
  });
  return ok(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;
  const existing = await getProductById(id);
  const deleted = await deleteProduct(id);
  if (!deleted) return notFound("Product not found");
  await logActivityFromRequest(request, {
    action: "products.delete",
    category: "admin",
    message: `Deleted product ${existing?.name ?? id}`,
    ...actorFromJwt(auth),
    entityType: "products",
    entityId: id,
  });
  return ok({ deleted: true });
}
