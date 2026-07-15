import { getOrders, updateOrder } from "@/lib/data/repositories";
import { ok, fail, requireAdmin, notFound } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getOrders());
}
