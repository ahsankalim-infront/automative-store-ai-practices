import { registerUser } from "@/lib/services/auth.service";
import { ok, fail } from "@/lib/api/helpers";
import { logActivityFromRequest } from "@/lib/activity-log";

export async function POST(request: Request) {
  let email = "";
  try {
    const body = await request.json();
    const { name, phone, password } = body;
    email = body.email || "";
    if (!name || !email || !password) return fail("Name, email and password are required");
    const result = await registerUser({ name, email, phone, password });
    await logActivityFromRequest(request, {
      action: "register",
      category: "auth",
      message: `New account registered: ${result.user.email}`,
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
      action: "register",
      category: "auth",
      status: "failure",
      message: `Registration failed${email ? ` for ${email}` : ""}`,
      actorEmail: email || undefined,
    });
    return fail(e instanceof Error ? e.message : "Registration failed", 400);
  }
}
