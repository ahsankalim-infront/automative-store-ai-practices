import { NextResponse } from "next/server";
import { verifyToken, extractBearerToken, type JwtPayload } from "@/lib/auth/jwt";
import { ADMIN_ROLES } from "@/lib/data/config";
import {
  permissionHrefForApiPath,
  roleCanAccessPath,
  roleCanAccessResource,
} from "@/lib/admin/role-permissions";
import type { UserRole } from "@/types";

export type ApiSuccess<T> = { success: true; data: T };
export type ApiError = { success: false; error: string };

export function ok<T>(data: T, status = 200, cacheSeconds = 60) {
  return NextResponse.json(
    { success: true, data } satisfies ApiSuccess<T>,
    {
      status,
      headers: cacheSeconds > 0
        ? { "Cache-Control": `public, s-maxage=${cacheSeconds}, stale-while-revalidate=${cacheSeconds * 5}` }
        : undefined,
    }
  );
}

export function fail(error: string, status = 400) {
  return NextResponse.json({ success: false, error } satisfies ApiError, { status });
}

export function unauthorized(error = "Unauthorized") {
  return fail(error, 401);
}

export function forbidden(error = "Forbidden") {
  return fail(error, 403);
}

export function notFound(error = "Not found") {
  return fail(error, 404);
}

export async function getAuthUser(request: Request): Promise<JwtPayload | null> {
  const header = request.headers.get("authorization");
  const token = extractBearerToken(header);
  if (token) return verifyToken(token);

  const cookie = request.headers.get("cookie") || "";
  const match = cookie.match(/(?:^|;\s*)auth_token=([^;]+)/);
  if (match) return verifyToken(decodeURIComponent(match[1]));

  return null;
}

export async function requireAuth(request: Request, roles?: UserRole[]): Promise<JwtPayload | NextResponse> {
  const user = await getAuthUser(request);
  if (!user) return unauthorized();
  if (roles && !roles.includes(user.role)) return forbidden();
  return user;
}

/**
 * Require an admin-portal role. Also enforces dynamic nav permissions
 * for known admin API paths (except shared utilities like nav-counts).
 */
export async function requireAdmin(request: Request): Promise<JwtPayload | NextResponse> {
  const auth = await requireAuth(request, [...ADMIN_ROLES]);
  if (auth instanceof Response) return auth;

  const url = new URL(request.url);
  const path = url.pathname;

  // Shared shell endpoints — any portal role may call these.
  if (
    path === "/api/admin/nav-counts" ||
    path.startsWith("/api/admin/nav-counts/") ||
    path === "/api/admin/role-permissions" ||
    path.startsWith("/api/admin/role-permissions/")
  ) {
    return auth;
  }

  const href = permissionHrefForApiPath(path);
  if (href) {
    const allowed = await roleCanAccessPath(auth.role, href);
    if (!allowed) return forbidden("You do not have permission for this section");
  }

  return auth;
}

/**
 * Require admin role + permission for a nav path (e.g. `/admin/products`)
 * or a generic resource key (e.g. `products`).
 */
export async function requireAdminPermission(
  request: Request,
  permission: { path?: string; resource?: string }
): Promise<JwtPayload | NextResponse> {
  const auth = await requireAuth(request, [...ADMIN_ROLES]);
  if (auth instanceof Response) return auth;

  let allowed = true;
  if (permission.resource) {
    allowed = await roleCanAccessResource(auth.role, permission.resource);
  } else if (permission.path) {
    allowed = await roleCanAccessPath(auth.role, permission.path);
  } else {
    const url = new URL(request.url);
    const href = permissionHrefForApiPath(url.pathname);
    if (href) allowed = await roleCanAccessPath(auth.role, href);
  }

  if (!allowed) return forbidden("You do not have permission for this section");
  return auth;
}

export function isAdminRole(role: UserRole): boolean {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}
