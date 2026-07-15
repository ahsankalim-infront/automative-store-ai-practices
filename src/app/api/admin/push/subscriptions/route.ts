import { getPushSubscriptions } from "@/lib/data/repositories";
import { ok, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  const subs = await getPushSubscriptions(auth.sub);
  return ok(subs.map(({ keys: _, ...rest }) => rest));
}
