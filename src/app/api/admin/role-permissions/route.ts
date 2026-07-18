import { ok, fail, requireAuth, forbidden } from "@/lib/api/helpers";
import { ADMIN_ROLES } from "@/lib/data/config";
import {
  getRolePermissions,
  updateRolePermissions,
  type AdminPortalRole,
} from "@/lib/admin/role-permissions";
import { logAdminSettingsAction } from "@/lib/activity-log/admin-crud";

/** Any portal role can read permissions (needed to filter their own nav). */
export async function GET(request: Request) {
  const auth = await requireAuth(request, [...ADMIN_ROLES]);
  if (auth instanceof Response) return auth;
  return ok(await getRolePermissions(), 200, 0);
}

/** Only full admins can change the permission matrix. */
export async function PUT(request: Request) {
  const auth = await requireAuth(request, [...ADMIN_ROLES]);
  if (auth instanceof Response) return auth;

  if (auth.role !== "admin") {
    return forbidden("Only admins can update role permissions");
  }

  try {
    const body = await request.json();
    const roles = (body?.roles ?? {}) as Partial<Record<AdminPortalRole, string[]>>;
    const result = await updateRolePermissions(roles);
    await logAdminSettingsAction(request, auth, "role permissions");
    return ok(result, 200, 0);
  } catch (e) {
    await logAdminSettingsAction(request, auth, "role permissions", "failure");
    return fail(e instanceof Error ? e.message : "Failed to update role permissions", 400);
  }
}
