import { getHomeLayout, updateHomeLayout } from "@/lib/home-layout/config";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";
import { logAdminSettingsAction } from "@/lib/activity-log/admin-crud";

export async function GET(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  return ok(await getHomeLayout());
}

export async function PUT(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;
  try {
    const body = await request.json();
    const result = await updateHomeLayout({
      desktop: body.desktop,
      mobile: body.mobile,
    });
    await logAdminSettingsAction(request, auth, "homepage layout");
    return ok(result);
  } catch (e) {
    await logAdminSettingsAction(request, auth, "homepage layout", "failure");
    return fail(e instanceof Error ? e.message : "Home layout update failed", 400);
  }
}
