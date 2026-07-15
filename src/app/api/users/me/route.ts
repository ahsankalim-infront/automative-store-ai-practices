import { getUserById, updateUser, toPublicUser } from "@/lib/data/repositories";
import { ok, fail, requireAuth } from "@/lib/api/helpers";
import { hashPassword, comparePassword } from "@/lib/auth/password";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;
  const user = await getUserById(auth.sub);
  if (!user) return fail("User not found", 404);
  return ok(toPublicUser(user));
}

export async function PATCH(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const body = await request.json();
  const user = await getUserById(auth.sub);
  if (!user) return fail("User not found", 404);

  const updates: Record<string, unknown> = {};
  if (body.name) updates.name = body.name;
  if (body.phone) updates.phone = body.phone;
  if (body.addresses) updates.addresses = body.addresses;

  if (body.currentPassword && body.newPassword) {
    const valid = await comparePassword(body.currentPassword, user.passwordHash);
    if (!valid) return fail("Current password is incorrect");
    updates.passwordHash = await hashPassword(body.newPassword);
  }

  const updated = await updateUser(auth.sub, updates);
  if (!updated) return fail("Update failed", 500);
  return ok(toPublicUser(updated));
}
