import { ok } from "@/lib/api/helpers";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST() {
  const res = ok({ message: "Logged out" });
  res.cookies.set("auth_token", "", { ...cookieOptions, maxAge: 0 });
  return res;
}
