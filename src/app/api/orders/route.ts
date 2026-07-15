import { getOrders, getUserById } from "@/lib/data/repositories";
import { createOrderFromCart } from "@/lib/services/order.service";
import { notifyOrderPlaced } from "@/lib/services/order-notification.service";
import { ok, fail, requireAuth } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;
  const orders = await getOrders(auth.sub);
  return ok(orders);
}

export async function POST(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { items, shippingAddress, paymentMethod, couponCode, notes, shippingCost, customerEmail } = body;
    if (!items?.length || !shippingAddress) {
      return fail("Items and shipping address are required");
    }
    const order = await createOrderFromCart({
      userId: auth.sub,
      items,
      shippingAddress,
      paymentMethod: paymentMethod || "cod",
      couponCode,
      notes,
      shippingCost,
    });

    const user = await getUserById(auth.sub);
    const email =
      (typeof customerEmail === "string" && customerEmail.includes("@")
        ? customerEmail
        : user?.email) || "";

    notifyOrderPlaced(order, email).catch((err) => {
      console.error("[order] notification failed:", err);
    });

    return ok(order, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Order failed", 500);
  }
}
