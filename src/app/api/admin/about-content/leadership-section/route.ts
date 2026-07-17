import {
  getAboutLeadershipSection,
  updateAboutLeadershipSection,
} from "@/lib/about-content/config";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";
import { logAdminSettingsAction } from "@/lib/activity-log/admin-crud";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getAboutLeadershipSection());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const result = await updateAboutLeadershipSection(body);
    await logAdminSettingsAction(request, auth, "about leadership section");
    return ok(result);
  } catch (e) {
    await logAdminSettingsAction(request, auth, "about leadership section", "failure");
    return fail(e instanceof Error ? e.message : "Leadership section update failed", 400);
  }
}
