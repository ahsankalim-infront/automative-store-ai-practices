import { subscribeNewsletter } from "@/lib/data/repositories";
import { ok, fail } from "@/lib/api/helpers";
import { logActivityFromRequest } from "@/lib/activity-log";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return fail("Email is required");
    const sub = await subscribeNewsletter({
      id: crypto.randomUUID(),
      email,
      subscribedAt: new Date().toISOString(),
    });
    await logActivityFromRequest(request, {
      action: "newsletter.subscribe",
      category: "newsletter",
      message: `Newsletter subscription: ${email}`,
      actorEmail: email,
      entityType: "newsletter-subscriber",
      entityId: sub.id,
    });
    return ok({ id: sub.id }, 201);
  } catch (e) {
    await logActivityFromRequest(request, {
      action: "newsletter.subscribe",
      category: "newsletter",
      status: "failure",
      message: "Newsletter subscription failed",
    });
    return fail(e instanceof Error ? e.message : "Subscription failed", 400);
  }
}
