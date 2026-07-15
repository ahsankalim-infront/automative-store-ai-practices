import { subscribeNewsletter } from "@/lib/data/repositories";
import { ok, fail } from "@/lib/api/helpers";

export async function POST(request: Request) {
  try {
    const { email } = await request.json();
    if (!email) return fail("Email is required");
    const sub = await subscribeNewsletter({
      id: crypto.randomUUID(),
      email,
      subscribedAt: new Date().toISOString(),
    });
    return ok({ id: sub.id }, 201);
  } catch (e) {
    return fail(e instanceof Error ? e.message : "Subscription failed", 400);
  }
}
