import { registerUser } from "@/lib/services/auth.service";
import { ok, fail } from "@/lib/api/helpers";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { name, email, phone, password } = await request.json();
    if (!name || !email || !password) return fail("Name, email and password are required");
    const result = await registerUser({ name, email, phone, password });
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
    return fail(e instanceof Error ? e.message : "Registration failed", 400);
  }
}
