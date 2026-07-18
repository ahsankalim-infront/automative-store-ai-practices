import { ADMIN_NAV_GROUPS, ALL_ADMIN_PERMISSION_KEYS, hrefsForGroups } from "@/lib/admin/nav";

export type AdminPortalRole = "admin" | "manager" | "staff";

export interface RolePermissionsConfig {
  id: string;
  roles: Record<AdminPortalRole, string[]>;
  updatedAt?: string;
}

/** Default: admin & manager = full access; staff = Commerce + Marketing + Content. */
export const DEFAULT_ROLE_PERMISSIONS: RolePermissionsConfig = {
  id: "role-permissions-1",
  roles: {
    admin: [...ALL_ADMIN_PERMISSION_KEYS],
    manager: [...ALL_ADMIN_PERMISSION_KEYS],
    staff: hrefsForGroups("Commerce", "Marketing", "Content"),
  },
};

export function getPermissionsForRole(
  config: RolePermissionsConfig,
  role: string | undefined | null
): string[] {
  if (role === "admin" || role === "manager" || role === "staff") {
    return config.roles[role] ?? [];
  }
  return [];
}

/** True if pathname is allowed by the given permission href list. */
export function canAccessAdminPath(pathname: string, allowed: string[]): boolean {
  const path = pathname.split("?")[0] || pathname;
  if (allowed.includes(path)) return true;
  return allowed.some((href) => {
    if (href === "/admin") return path === "/admin";
    return path === href || path.startsWith(`${href}/`);
  });
}

export function firstAllowedAdminPath(allowed: string[]): string {
  if (allowed.includes("/admin")) return "/admin";
  for (const group of ADMIN_NAV_GROUPS) {
    for (const item of group.items) {
      if (allowed.includes(item.href)) return item.href;
    }
  }
  return "/admin/login";
}
