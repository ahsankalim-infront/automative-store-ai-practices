import { getProductById, updateProduct, deleteProduct } from "@/lib/data/repositories";
import { ok, fail, requireAdmin, notFound } from "@/lib/api/helpers";

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
  return ok(updated);
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;
  const deleted = await deleteProduct(id);
  if (!deleted) return notFound("Product not found");
  return ok({ deleted: true });
}
