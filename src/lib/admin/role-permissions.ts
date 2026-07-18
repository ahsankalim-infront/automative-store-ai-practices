import { getStore } from "@/lib/data/store";
import type { UserRole } from "@/types";
import { ALL_ADMIN_PERMISSION_KEYS } from "@/lib/admin/nav";
import {
  DEFAULT_ROLE_PERMISSIONS,
  canAccessAdminPath,
  firstAllowedAdminPath,
  getPermissionsForRole,
  type AdminPortalRole,
  type RolePermissionsConfig,
} from "@/lib/admin/role-permissions-defaults";

export type { AdminPortalRole, RolePermissionsConfig };
export {
  DEFAULT_ROLE_PERMISSIONS,
  canAccessAdminPath,
  firstAllowedAdminPath,
  getPermissionsForRole,
};

const COLLECTION = "role-permissions";

/** Maps generic admin resources → nav permission href. */
export const RESOURCE_PERMISSION_MAP: Record<string, string> = {
  categories: "/admin/categories",
  brands: "/admin/brands",
  products: "/admin/products",
  orders: "/admin/orders",
  customers: "/admin/customers",
  reviews: "/admin/reviews",
  services: "/admin/services",
  bookings: "/admin/bookings",
  contactMessages: "/admin/contact-messages",
  coupons: "/admin/coupons",
  banners: "/admin/banners",
  bundleOffers: "/admin/bundle-offers",
  aboutTeam: "/admin/about-content",
  aboutMilestones: "/admin/about-content",
  heroSlides: "/admin/hero-slides",
  promotionPopups: "/admin/promotions",
  blogs: "/admin/blogs",
  vehicles: "/admin/vehicles",
  stores: "/admin/stores",
  users: "/admin/roles",
};

/** Maps specialty admin API path prefixes → nav permission href. */
export const API_PATH_PERMISSION_MAP: Array<{ prefix: string; href: string }> = [
  { prefix: "/api/admin/settings", href: "/admin/settings" },
  { prefix: "/api/admin/seo", href: "/admin/seo" },
  { prefix: "/api/admin/home-layout", href: "/admin/home-layout" },
  { prefix: "/api/admin/bundle-offers", href: "/admin/bundle-offers" },
  { prefix: "/api/admin/about-content", href: "/admin/about-content" },
  { prefix: "/api/admin/files", href: "/admin/media" },
  { prefix: "/api/admin/activity-logs", href: "/admin/activity-logs" },
  { prefix: "/api/admin/reports", href: "/admin/reports" },
  { prefix: "/api/admin/notifications", href: "/admin/notifications" },
  { prefix: "/api/admin/push", href: "/admin/notifications" },
  { prefix: "/api/admin/stats", href: "/admin" },
  { prefix: "/api/admin/cache", href: "/admin/cache" },
  { prefix: "/api/admin/role-permissions", href: "/admin/roles" },
  { prefix: "/api/admin/customers", href: "/admin/customers" },
  { prefix: "/api/admin/orders", href: "/admin/orders" },
  { prefix: "/api/admin/products", href: "/admin/products" },
];

function isPortalRole(role: string): role is AdminPortalRole {
  return role === "admin" || role === "manager" || role === "staff";
}

function normalizeHrefList(list: unknown, fallback: string[]): string[] {
  if (!Array.isArray(list)) return [...fallback];
  const allowed = new Set(ALL_ADMIN_PERMISSION_KEYS);
  const unique = new Set<string>();
  for (const item of list) {
    if (typeof item === "string" && allowed.has(item)) unique.add(item);
  }
  return unique.size > 0 ? [...unique] : [...fallback];
}

export function normalizeRolePermissions(
  raw?: Partial<RolePermissionsConfig> | null
): RolePermissionsConfig {
  const defaults = DEFAULT_ROLE_PERMISSIONS;
  return {
    id: raw?.id || defaults.id,
    roles: {
      admin: normalizeHrefList(raw?.roles?.admin, defaults.roles.admin),
      manager: normalizeHrefList(raw?.roles?.manager, defaults.roles.manager),
      staff: normalizeHrefList(raw?.roles?.staff, defaults.roles.staff),
    },
    updatedAt: raw?.updatedAt,
  };
}

async function readRolePermissionsRaw(): Promise<RolePermissionsConfig> {
  const items = await getStore().read<RolePermissionsConfig>(COLLECTION);
  return normalizeRolePermissions(items[0]);
}

export async function getRolePermissions(): Promise<RolePermissionsConfig> {
  return readRolePermissionsRaw();
}

export async function updateRolePermissions(
  roles: Partial<Record<AdminPortalRole, string[]>>
): Promise<RolePermissionsConfig> {
  const current = await readRolePermissionsRaw();
  const next = normalizeRolePermissions({
    ...current,
    roles: {
      admin: roles.admin ?? current.roles.admin,
      manager: roles.manager ?? current.roles.manager,
      staff: roles.staff ?? current.roles.staff,
    },
    updatedAt: new Date().toISOString(),
  });

  // Never lock the last admin out of Roles & Permissions.
  if (!next.roles.admin.includes("/admin/roles")) {
    next.roles.admin = [...next.roles.admin, "/admin/roles"];
  }

  const items = await getStore().read<RolePermissionsConfig>(COLLECTION);
  if (items.length === 0) {
    await getStore().create(COLLECTION, next);
  } else {
    await getStore().update(COLLECTION, current.id, next);
  }
  return next;
}

export async function roleCanAccessPath(
  role: UserRole | string,
  pathname: string
): Promise<boolean> {
  if (!isPortalRole(role)) return false;
  const config = await getRolePermissions();
  return canAccessAdminPath(pathname, getPermissionsForRole(config, role));
}

export async function roleCanAccessResource(
  role: UserRole | string,
  resource: string
): Promise<boolean> {
  const href = RESOURCE_PERMISSION_MAP[resource];
  if (!href) return false;
  return roleCanAccessPath(role, href);
}

export function permissionHrefForApiPath(apiPath: string): string | null {
  const path = apiPath.split("?")[0] || apiPath;
  if (path.startsWith("/api/admin/resources/")) {
    const resource = path.replace("/api/admin/resources/", "").split("/")[0];
    return RESOURCE_PERMISSION_MAP[resource] ?? null;
  }
  for (const entry of API_PATH_PERMISSION_MAP) {
    if (path === entry.prefix || path.startsWith(`${entry.prefix}/`)) {
      return entry.href;
    }
  }
  return null;
}
