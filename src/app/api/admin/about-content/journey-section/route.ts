import {
  getAboutJourneySection,
  updateAboutJourneySection,
} from "@/lib/about-content/config";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";
import { logAdminSettingsAction } from "@/lib/activity-log/admin-crud";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getAboutJourneySection());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const result = await updateAboutJourneySection(body);
    await logAdminSettingsAction(request, auth, "about journey section");
    return ok(result);
  } catch (e) {
    await logAdminSettingsAction(request, auth, "about journey section", "failure");
    return fail(e instanceof Error ? e.message : "Journey section update failed", 400);
  }
}
