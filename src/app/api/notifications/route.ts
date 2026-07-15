import {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  getUnreadNotificationCount,
} from "@/lib/data/repositories";
import { ok, fail, requireAuth } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const notifications = await getNotifications(auth.sub);
  const unreadCount = notifications.filter((n) => !n.read).length;
  return ok({ notifications, unreadCount });
}

export async function PATCH(request: Request) {
  const auth = await requireAuth(request);
  if (auth instanceof Response) return auth;

  const body = await request.json().catch(() => ({}));
  if (body.markAllRead) {
    const count = await markAllNotificationsRead(auth.sub);
    return ok({ marked: count });
  }
  return fail("Invalid request", 400);
}
