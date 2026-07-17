import { getStoreSettings, updateStoreSettings } from "@/lib/admin/resource-registry";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";
import { logAdminSettingsAction } from "@/lib/activity-log/admin-crud";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getStoreSettings());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const result = await updateStoreSettings(body);
    await logAdminSettingsAction(request, auth, "store settings");
    return ok(result);
  } catch (e) {
    await logAdminSettingsAction(request, auth, "store settings", "failure");
    return fail(e instanceof Error ? e.message : "Update failed", 400);
  }
}
