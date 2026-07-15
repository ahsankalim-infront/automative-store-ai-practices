import { markNotificationRead } from "@/lib/data/repositories";
import { ok, fail, requireAuth } from "@/lib/api/helpers";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const { id } = await params;
  const updated = await markNotificationRead(id, auth.sub);
  if (!updated) return fail("Notification not found", 404);
  return ok({ read: true });
}
