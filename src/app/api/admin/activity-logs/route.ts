import { queryActivityLogs } from "@/lib/data/repositories";
import { ok, requireAdmin } from "@/lib/api/helpers";
import type { ActivityCategory, ActivityStatus } from "@/lib/activity-log/types";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const category = (searchParams.get("category") || "") as ActivityCategory | "";
  const status = (searchParams.get("status") || "") as ActivityStatus | "";
  const search = searchParams.get("search") || undefined;
  const dateFrom = searchParams.get("dateFrom") || undefined;
  const dateTo = searchParams.get("dateTo") || undefined;
  const limit = Number(searchParams.get("limit")) || 50;
  const offset = Number(searchParams.get("offset")) || 0;

  const page = await queryActivityLogs({
    category: category || undefined,
    status: status || undefined,
    search,
    dateFrom,
    dateTo,
    limit,
    offset,
  });

  return ok(page, 200, 0);
}
