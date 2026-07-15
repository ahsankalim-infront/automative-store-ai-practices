import { getOrderById, updateOrder } from "@/lib/data/repositories";
import { ok, fail, requireAdmin, notFound } from "@/lib/api/helpers";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;
  const body = await request.json();
  const updated = await updateOrder(id, body);
  if (!updated) return notFound("Order not found");
  return ok(updated);
}
