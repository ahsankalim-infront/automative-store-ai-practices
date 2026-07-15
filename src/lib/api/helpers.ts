import { NextResponse } from "next/server";
import { verifyToken, extractBearerToken, type JwtPayload } from "@/lib/auth/jwt";
import { ADMIN_ROLES } from "@/lib/data/config";
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

export async function requireAdmin(request: Request): Promise<JwtPayload | NextResponse> {
  return requireAuth(request, [...ADMIN_ROLES]);
}

export function isAdminRole(role: UserRole): boolean {
  return (ADMIN_ROLES as readonly string[]).includes(role);
}
