import { generateAdminReport, isValidReportType } from "@/lib/reports/generate-report";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  const { searchParams } = new URL(request.url);
  const type = searchParams.get("type") || "sales_summary";

  if (!isValidReportType(type)) {
    return fail("Invalid report type", 400);
  }

  try {
    const report = await generateAdminReport({
      type,
      dateFrom: searchParams.get("dateFrom") || undefined,
      dateTo: searchParams.get("dateTo") || undefined,
      status: searchParams.get("status") || undefined,
    });
    return ok(report);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Failed to generate report", 500);
  }
}
