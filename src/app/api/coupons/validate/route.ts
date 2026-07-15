import { validateCoupon } from "@/lib/services/order.service";
import { ok, fail } from "@/lib/api/helpers";

export async function POST(request: Request) {
  const { code, subtotal } = await request.json();
  if (!code) return fail("Coupon code is required");
  const result = await validateCoupon(code, subtotal || 0);
  return ok(result);
}
