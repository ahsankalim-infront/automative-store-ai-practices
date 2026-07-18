import { getAdminDashboardData } from "@/lib/data/repositories";
import { ok, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const period = searchParams.get("period");
  const periodDays =
    period === "7" ? 7 : period === "30" ? 30 : period === "90" ? 90 : period === "365" ? 365 : undefined;
  const status = searchParams.get("status") || undefined;
  const paymentMethod = searchParams.get("paymentMethod") || undefined;
  const category = searchParams.get("category") || undefined;

  const data = await getAdminDashboardData({
    periodDays,
    status: status && status !== "all" ? status : undefined,
    paymentMethod: paymentMethod && paymentMethod !== "all" ? paymentMethod : undefined,
    categorySlug: category && category !== "all" ? category : undefined,
  });
  return ok(data, 200, 0);
}
