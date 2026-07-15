import { deletePushSubscription } from "@/lib/data/repositories";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const { endpoint } = await request.json();
    if (!endpoint) return fail("Endpoint required");
    await deletePushSubscription(endpoint);
    return ok({ unsubscribed: true });
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Unsubscribe failed", 500);
  }
}
