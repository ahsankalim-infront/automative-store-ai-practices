import { getOrderById } from "@/lib/data/repositories";
import { requireAuth, notFound, forbidden, isAdminRole } from "@/lib/api/helpers";
import {
  buildOrderSummaryPdfBuffer,
  orderSummaryPdfFilename,
} from "@/lib/orders/order-summary-pdf";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const order = await getOrderById(id);
  if (!order) return notFound("Order not found");

  const isOwner = order.userId === auth.sub;
  const isAdmin = isAdminRole(auth.role);
  if (!isOwner && !isAdmin) return forbidden();

  const pdf = await buildOrderSummaryPdfBuffer(order);
  const filename = orderSummaryPdfFilename(order);

  return new Response(new Uint8Array(pdf), {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "private, no-store",
    },
  });
}
