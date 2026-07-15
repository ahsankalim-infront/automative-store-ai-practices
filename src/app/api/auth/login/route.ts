import { loginUser } from "@/lib/services/auth.service";
import { ok, fail } from "@/lib/api/helpers";

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();
    if (!email || !password) return fail("Email and password are required");
    const result = await loginUser(email, password);
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
    return fail(e instanceof Error ? e.message : "Login failed", 401);
  }
}
