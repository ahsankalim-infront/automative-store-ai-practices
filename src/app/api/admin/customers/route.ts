import { getUsers, toPublicUser } from "@/lib/data/repositories";
import { ok, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const customers = await getUsers("customer");
  return ok(customers.map(toPublicUser));
}
