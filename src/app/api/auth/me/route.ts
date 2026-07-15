import { getUserById, toPublicUser } from "@/lib/data/repositories";
import { ok, fail, getAuthUser } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await getAuthUser(request);
  if (!auth) return fail("Not authenticated", 401);
  const user = await getUserById(auth.sub);
  if (!user) return fail("User not found", 404);
  return ok(toPublicUser(user));
}
