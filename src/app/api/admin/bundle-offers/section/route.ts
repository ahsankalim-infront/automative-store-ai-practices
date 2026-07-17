import { getBundleOffersSection, updateBundleOffersSection } from "@/lib/bundles/config";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";
import { logAdminSettingsAction } from "@/lib/activity-log/admin-crud";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getBundleOffersSection());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const result = await updateBundleOffersSection(body);
    await logAdminSettingsAction(request, auth, "bundle offers section");
    return ok(result);
  } catch (e) {
    await logAdminSettingsAction(request, auth, "bundle offers section", "failure");
    return fail(e instanceof Error ? e.message : "Bundle section update failed", 400);
  }
}
