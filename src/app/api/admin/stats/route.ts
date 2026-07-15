import { getAdminDashboardData } from "@/lib/data/repositories";
import { ok, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");
  const periodDays =
    period === "7" ? 7 : period === "30" ? 30 : period === "90" ? 90 : period === "365" ? 365 : undefined;

  const data = await getAdminDashboardData(periodDays ? { periodDays } : undefined);
  return ok(data);
}
