import type { JwtPayload } from "@/lib/auth/jwt";
import type { ActivityStatus } from "./types";
import { logActivityFromRequest } from "./service";
import { actorFromJwt } from "./request";

export async function logAdminResourceAction(
  request: Request,
  auth: JwtPayload,
  resource: string,
  action: "create" | "update" | "delete",
  entityId?: string,
  status: ActivityStatus = "success"
): Promise<void> {
  const verbs = { create: "Created", update: "Updated", delete: "Deleted" };
  const suffix = entityId ? ` #${entityId}` : "";
  await logActivityFromRequest(request, {
    action: `${resource}.${action}`,
    category: "admin",
    status,
    message: `${verbs[action]} ${resource}${suffix}`,
    ...actorFromJwt(auth),
    entityType: resource,
    entityId,
  });
}

export async function logAdminSettingsAction(
  request: Request,
  auth: JwtPayload,
  label: string,
  status: ActivityStatus = "success"
): Promise<void> {
  await logActivityFromRequest(request, {
    action: "settings.update",
    category: "settings",
    status,
    message: `Updated ${label}`,
    ...actorFromJwt(auth),
    entityType: "settings",
    metadata: { section: label },
  });
}
