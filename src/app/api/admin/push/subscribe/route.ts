import { savePushSubscription } from "@/lib/data/repositories";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  try {
    const body = await request.json();
    const { endpoint, keys, deviceLabel } = body;
    if (!endpoint || !keys?.p256dh || !keys?.auth) {
      return fail("Invalid push subscription");
    }

    const record = await savePushSubscription({
      id: crypto.randomUUID(),
      userId: auth.sub,
      userEmail: auth.email,
      endpoint,
      keys: { p256dh: keys.p256dh, auth: keys.auth },
      userAgent: request.headers.get("user-agent") || undefined,
      deviceLabel: deviceLabel || "Mobile / Browser",
      createdAt: new Date().toISOString(),
    });

    return ok({ id: record.id, subscribed: true }, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Subscribe failed", 500);
  }
}
