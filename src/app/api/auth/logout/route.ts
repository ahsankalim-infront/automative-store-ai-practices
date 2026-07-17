import { ok, getAuthUser } from "@/lib/api/helpers";
import { logActivityFromRequest, actorFromJwt } from "@/lib/activity-log";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export async function POST(request: Request) {
  const user = await getAuthUser(request);
  if (user) {
    await logActivityFromRequest(request, {
      action: "logout",
      category: "auth",
      message: `${user.email} signed out`,
      ...actorFromJwt(user),
    });
  }

  const res = ok({ message: "Logged out" });
  res.cookies.set("auth_token", "", { ...cookieOptions, maxAge: 0 });
  return res;
}
