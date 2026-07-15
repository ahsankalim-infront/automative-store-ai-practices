import { getAdminNavCounts } from "@/lib/data/repositories";
import { ok, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getAdminNavCounts());
}
