import { getOrderById, updateOrder } from "@/lib/data/repositories";
import { ok, fail, requireAdmin, notFound } from "@/lib/api/helpers";
import { logActivityFromRequest, actorFromJwt } from "@/lib/activity-log";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const { id } = await params;
  const body = await request.json();
  const existing = await getOrderById(id);
  const updated = await updateOrder(id, body);
  if (!updated) return notFound("Order not found");

  const statusChanged = body.status && existing?.status !== body.status;
  await logActivityFromRequest(request, {
    action: statusChanged ? "order.status_update" : "order.update",
    category: "order",
    message: statusChanged
      ? `Order ${updated.orderNumber} status: ${existing?.status} → ${body.status}`
      : `Updated order ${updated.orderNumber}`,
    ...actorFromJwt(auth),
    entityType: "order",
    entityId: id,
    metadata: statusChanged ? { from: existing?.status, to: body.status } : undefined,
  });

  return ok(updated);
}
