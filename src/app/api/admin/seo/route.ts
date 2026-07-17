import { getSeoConfig, updateSeoConfig } from "@/lib/seo/config";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";
import { logAdminSettingsAction } from "@/lib/activity-log/admin-crud";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getSeoConfig());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const result = await updateSeoConfig(body);
    await logAdminSettingsAction(request, auth, "SEO configuration");
    return ok(result);
  } catch (e) {
    await logAdminSettingsAction(request, auth, "SEO configuration", "failure");
    return fail(e instanceof Error ? e.message : "SEO update failed", 400);
  }
}
