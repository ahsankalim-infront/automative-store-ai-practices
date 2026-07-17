import { loginAdmin } from "@/lib/services/auth.service";
import { ok, fail } from "@/lib/api/helpers";
import { logActivityFromRequest } from "@/lib/activity-log";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    email = body.email || "";
    const { password } = body;
    if (!email || !password) return fail("Email and password are required");
    const result = await loginAdmin(email, password);
    await logActivityFromRequest(request, {
      action: "admin.login",
      category: "auth",
      message: `${result.user.email} signed in to admin`,
      actorId: result.user.id,
      actorEmail: result.user.email,
      actorName: result.user.name,
      actorRole: result.user.role,
    });
    const res = ok(result);
    res.cookies.set("auth_token", result.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 604800,
      path: "/",
    });
    return res;
  } catch (e) {
    await logActivityFromRequest(request, {
      action: "admin.login",
      category: "auth",
      status: "failure",
      message: `Admin login failed${email ? ` for ${email}` : ""}`,
      actorEmail: email || undefined,
    });
    return fail(e instanceof Error ? e.message : "Admin login failed", 401);
  }
}
