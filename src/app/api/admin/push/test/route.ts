import { sendTestPushToUser, isPushConfigured } from "@/lib/services/push.service";
import { ok, fail, requireAdmin } from "@/lib/api/helpers";

export async function POST(request: Request) {
  const auth = await requireAdmin(request);
  if (auth instanceof Response) return auth;

  if (!isPushConfigured()) {
    return fail("Push notifications not configured on server");
  }

  const sent = await sendTestPushToUser(auth.sub);
  if (!sent) return fail("No active subscription found. Enable push first.");
  return ok({ sent: true });
}
