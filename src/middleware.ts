import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyToken } from "@/lib/auth/jwt";

const ADMIN_LOGIN = "/admin/login";
const AUTH_PAGES = ["/auth/login", "/auth/register"];
const ADMIN_ROLES = ["admin", "manager", "staff"];

function isAdminRole(role: string) {
  return ADMIN_ROLES.includes(role);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const token =
    request.cookies.get("auth_token")?.value ||
    request.headers.get("authorization")?.replace("Bearer ", "");

  const payload = token ? await verifyToken(token) : null;
  const isAdmin = payload ? isAdminRole(payload.role) : false;

  // Already logged-in admin → skip login pages, go to dashboard
  if (pathname === ADMIN_LOGIN && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (AUTH_PAGES.includes(pathname) && payload) {
    return NextResponse.redirect(new URL(isAdmin ? "/admin" : "/dashboard", request.url));
  }

  const isAdminRoute = pathname.startsWith("/admin") && pathname !== ADMIN_LOGIN;
  const isDashboardRoute = pathname.startsWith("/dashboard");

  // Admin users belong in admin panel, not customer dashboard
  if (isDashboardRoute && isAdmin) {
    return NextResponse.redirect(new URL("/admin", request.url));
  }

  if (!isAdminRoute && !isDashboardRoute) {
    return NextResponse.next();
  }

  if (!payload) {
    if (isAdminRoute) return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (isAdminRoute && !isAdmin) {
    return NextResponse.redirect(new URL(ADMIN_LOGIN, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/dashboard/:path*", "/auth/login", "/auth/register"],
};
