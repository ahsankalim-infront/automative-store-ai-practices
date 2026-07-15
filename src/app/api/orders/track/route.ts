import { trackOrders } from "@/lib/data/repositories";
import { orderToPublicTracking } from "@/lib/help/order-tracking";
import { ok, fail } from "@/lib/api/helpers";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const orderNumber = typeof body.orderNumber === "string" ? body.orderNumber.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";

    if (!phone && !orderNumber) {
      return fail("Enter an order number or phone number", 400);
    }

    const orders = await trackOrders(phone || undefined, orderNumber || undefined);

    if (orders.length === 0) {
      let message = "No order found.";
      if (orderNumber && phone) {
        message = "No order found with that number for this phone.";
      } else if (orderNumber) {
        message = "No order found with that order number.";
      } else if (phone) {
        message = "No active (undelivered) orders found for this phone number.";
      }
      return fail(message, 404);
    }

    const mode =
      orderNumber && phone ? "specific" : orderNumber ? "order" : "active";

    return ok({
      mode,
      orders: orders.map(orderToPublicTracking),
    });
  } catch {
    return fail("Could not track order", 500);
  }
}
