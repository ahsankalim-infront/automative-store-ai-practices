import webpush from "web-push";
import {
  getPushSubscriptions,
  deletePushSubscription,
} from "@/lib/data/repositories";
import type { Order } from "@/types";
import { formatPrice } from "@/lib/utils";

const VAPID_PUBLIC = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY || "";
const VAPID_PRIVATE = process.env.VAPID_PRIVATE_KEY || "";
const VAPID_SUBJECT = process.env.VAPID_SUBJECT || "mailto:shahzadahmed6626@gmail.com";

let vapidConfigured = false;

function ensureVapid() {
  if (vapidConfigured) return true;
  if (!VAPID_PUBLIC || !VAPID_PRIVATE) return false;
  webpush.setVapidDetails(VAPID_SUBJECT, VAPID_PUBLIC, VAPID_PRIVATE);
  vapidConfigured = true;
  return true;
}

export function getVapidPublicKey() {
  return VAPID_PUBLIC;
}

export function isPushConfigured() {
  return Boolean(VAPID_PUBLIC && VAPID_PRIVATE);
}

export async function sendPushToSubscription(
  subscription: { endpoint: string; keys: { p256dh: string; auth: string } },
  payload: { title: string; body: string; url?: string; tag?: string }
) {
  if (!ensureVapid()) return false;

  try {
    await webpush.sendNotification(
      {
        endpoint: subscription.endpoint,
        keys: subscription.keys,
      },
      JSON.stringify(payload)
    );
    return true;
  } catch (err: unknown) {
    const status = (err as { statusCode?: number })?.statusCode;
    if (status === 404 || status === 410) {
      await deletePushSubscription(subscription.endpoint);
    }
    return false;
  }
}

export async function notifyAdminsNewOrder(order: Order) {
  if (!ensureVapid()) return;

  const subs = await getPushSubscriptions();
  if (!subs.length) return;

  const payload = {
    title: "New Order Received",
    body: `${order.orderNumber} · ${formatPrice(order.total)} · ${order.shippingAddress.fullName}`,
    url: `/admin/orders`,
    tag: `order-${order.id}`,
  };

  await Promise.allSettled(
    subs.map((sub) =>
      sendPushToSubscription(
        { endpoint: sub.endpoint, keys: sub.keys },
        payload
      )
    )
  );
}

export async function sendTestPushToUser(userId: string) {
  const subs = (await getPushSubscriptions()).filter((s) => s.userId === userId);
  const payload = {
    title: "Shahzad Poshish House Admin Alerts",
    body: "Push notifications are working! You'll be notified for new orders.",
    url: "/admin/orders",
    tag: "test-push",
  };

  const results = await Promise.all(
    subs.map((sub) =>
      sendPushToSubscription(
        { endpoint: sub.endpoint, keys: sub.keys },
        payload
      )
    )
  );
  return results.some(Boolean);
}
