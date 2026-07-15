import { getNotifications, getUnreadNotificationCount } from "@/lib/data/repositories";
import { isEmailConfigured } from "@/lib/services/email.service";
import { isPushConfigured } from "@/lib/services/push.service";
import { ok, requireAuth } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const notifications = await getNotifications(auth.sub);
  const unreadCount = await getUnreadNotificationCount(auth.sub);
  return ok({
    notifications,
    unreadCount,
    emailConfigured: isEmailConfigured(),
    pushConfigured: isPushConfigured(),
  });
}
