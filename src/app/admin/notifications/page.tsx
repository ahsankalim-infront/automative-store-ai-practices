"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, BellOff, Smartphone, CheckCircle, AlertCircle, Send, RefreshCw, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { NotificationInbox } from "@/components/admin/notification-inbox";
import { api } from "@/lib/api/client";
import {
  isPushSupported,
  subscribeToPush,
  unsubscribeFromPush,
  subscriptionToJson,
} from "@/lib/push/client";
import type { AppNotification } from "@/types";
import toast from "react-hot-toast";

interface SubscriptionInfo {
  id: string;
  userId: string;
  userEmail: string;
  endpoint?: string;
  deviceLabel?: string;
  userAgent?: string;
  createdAt: string;
}

export default function AdminNotificationsPage() {
  const [supported, setSupported] = useState(false);
  const [permission, setPermission] = useState<NotificationPermission>("default");
  const [subscribed, setSubscribed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [vapidKey, setVapidKey] = useState("");
  const [configured, setConfigured] = useState(false);
  const [emailConfigured, setEmailConfigured] = useState(false);
  const [devices, setDevices] = useState<SubscriptionInfo[]>([]);
  const [deviceLabel, setDeviceLabel] = useState("My Phone");
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [inboxLoading, setInboxLoading] = useState(true);

  const loadSubscriptions = useCallback(async () => {
    const res = await api.getPushSubscriptions();
    if (res.success && res.data) {
      setDevices(res.data);
      setSubscribed(res.data.length > 0);
    }
  }, []);

  const loadInbox = useCallback(async () => {
    setInboxLoading(true);
    const res = await api.getAdminNotificationInbox();
    if (res.success && res.data) {
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
      if ("emailConfigured" in res.data) {
        setEmailConfigured(Boolean((res.data as { emailConfigured?: boolean }).emailConfigured));
      }
    }
    setInboxLoading(false);
  }, []);

  useEffect(() => {
    setSupported(isPushSupported());
    if (typeof Notification !== "undefined") {
      setPermission(Notification.permission);
    }
    api.getPushVapidKey().then((res) => {
      if (res.success && res.data) {
        setVapidKey(res.data.publicKey);
        setConfigured(res.data.configured);
      }
    });
    loadSubscriptions();
    loadInbox();
  }, [loadSubscriptions, loadInbox]);

  const handleMarkRead = async (id: string) => {
    await api.markNotificationRead(id);
    loadInbox();
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    toast.success("All notifications marked as read");
    loadInbox();
  };

  const handleEnablePush = async () => {
    if (!supported) return toast.error("Push not supported on this browser");
    if (!configured || !vapidKey) return toast.error("Push not configured on server");

    setLoading(true);
    try {
      const perm = await Notification.requestPermission();
      setPermission(perm);
      if (perm !== "granted") {
        toast.error("Notification permission denied");
        return;
      }

      const sub = await subscribeToPush(vapidKey);
      if (!sub) {
        toast.error("Failed to subscribe");
        return;
      }

      const payload = subscriptionToJson(sub);
      const res = await api.subscribePush({ ...payload, deviceLabel });
      if (res.success) {
        toast.success("Push enabled! You'll get alerts for new orders.");
        setSubscribed(true);
        await loadSubscriptions();
      } else {
        toast.error(res.error || "Failed to save subscription");
      }
    } catch {
      toast.error("Could not enable push notifications");
    } finally {
      setLoading(false);
    }
  };

  const handleDisablePush = async () => {
    setLoading(true);
    try {
      const reg = await navigator.serviceWorker.getRegistration("/");
      const sub = await reg?.pushManager.getSubscription();
      if (sub) {
        await api.unsubscribePush(sub.endpoint);
        await sub.unsubscribe();
      } else {
        await unsubscribeFromPush();
      }
      toast.success("Push notifications disabled");
      setSubscribed(false);
      await loadSubscriptions();
    } catch {
      toast.error("Failed to disable push");
    } finally {
      setLoading(false);
    }
  };

  const handleTestPush = async () => {
    setLoading(true);
    const res = await api.testPush();
    if (res.success) toast.success("Test notification sent!");
    else toast.error(res.error || "Test failed");
    setLoading(false);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-foreground">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">
          Order alerts via email, in-app inbox, and push on subscribed devices.
        </p>
      </div>

      {/* Delivery status */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: "Email (SMTP)", ok: emailConfigured, text: emailConfigured ? "Configured" : "Dev outbox" },
          { label: "Push support", ok: supported, text: supported ? "Supported" : "Not supported" },
          { label: "Permission", ok: permission === "granted", text: permission },
          { label: "Devices", ok: devices.length > 0, text: `${devices.length} subscribed` },
        ].map((s) => (
          <Card key={s.label} padding="md">
            <p className="text-[10px] sm:text-xs text-gray-500 mb-1">{s.label}</p>
            <div className="flex items-center gap-2">
              {s.ok ? (
                <CheckCircle className="h-4 w-4 text-emerald-500 shrink-0" />
              ) : (
                <AlertCircle className="h-4 w-4 text-amber-500 shrink-0" />
              )}
              <span className="text-xs sm:text-sm font-semibold text-foreground capitalize truncate">{s.text}</span>
            </div>
          </Card>
        ))}
      </div>

      {/* In-app notification list */}
      <Card padding="md">
        <NotificationInbox
          notifications={notifications}
          unreadCount={unreadCount}
          loading={inboxLoading}
          onMarkRead={handleMarkRead}
          onMarkAllRead={handleMarkAllRead}
          emptyMessage="No order notifications yet. They appear here when customers place orders."
        />
        <div className="mt-3 flex justify-end">
          <Button variant="ghost" size="sm" leftIcon={<RefreshCw className="h-3.5 w-3.5" />} onClick={loadInbox}>
            Refresh inbox
          </Button>
        </div>
      </Card>

      {/* Push subscribe panel */}
      <Card padding="md">
        <div className="flex items-start gap-4">
          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center shrink-0">
            <Smartphone className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-foreground mb-1">Push on this device</h2>
            <p className="text-sm text-gray-500 mb-4">
              Subscribe to receive instant push alerts when a new order is placed — in addition to email and the inbox above.
            </p>

            {!emailConfigured && (
              <p className="text-xs text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-900/20 rounded-lg px-3 py-2 mb-4 flex items-start gap-2">
                <Mail className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                Emails are saved to <code className="text-[10px]">data/json/email-outbox.json</code> until SMTP is configured in .env.local
              </p>
            )}

            {!configured && (
              <p className="text-xs text-amber-600 bg-amber-50 dark:bg-amber-900/20 rounded-lg px-3 py-2 mb-4">
                VAPID keys missing. Add NEXT_PUBLIC_VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY to .env.local
              </p>
            )}

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 mb-1.5">Device name</label>
              <input
                value={deviceLabel}
                onChange={(e) => setDeviceLabel(e.target.value)}
                placeholder="e.g. iPhone 15, Office Chrome"
                className="w-full max-w-xs px-3 py-2 text-sm border border-border rounded-xl bg-card text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              {!subscribed ? (
                <Button
                  loading={loading}
                  leftIcon={<Bell className="h-4 w-4" />}
                  onClick={handleEnablePush}
                  disabled={!supported || !configured}
                >
                  Enable Push Notifications
                </Button>
              ) : (
                <>
                  <Button
                    variant="outline"
                    loading={loading}
                    leftIcon={<BellOff className="h-4 w-4" />}
                    onClick={handleDisablePush}
                  >
                    Disable on This Device
                  </Button>
                  <Button
                    variant="ghost"
                    loading={loading}
                    leftIcon={<Send className="h-4 w-4" />}
                    onClick={handleTestPush}
                  >
                    Send Test
                  </Button>
                </>
              )}
              <Button variant="ghost" leftIcon={<RefreshCw className="h-4 w-4" />} onClick={loadSubscriptions}>
                Refresh devices
              </Button>
            </div>
          </div>
        </div>
      </Card>

      <Card padding="none">
        <div className="p-4 border-b border-border">
          <h3 className="font-bold text-foreground">Subscribed devices</h3>
          <p className="text-xs text-gray-500 mt-0.5">{devices.length} device(s) receive push for new orders</p>
        </div>
        {devices.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            No devices subscribed yet. Enable push above to get instant order alerts.
          </div>
        ) : (
          <ul className="divide-y divide-border">
            {devices.map((d) => (
              <li key={d.id} className="px-4 py-3 flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-medium text-sm text-foreground">{d.deviceLabel || "Device"}</p>
                  <p className="text-xs text-gray-400 truncate">{d.userEmail}</p>
                </div>
                <Badge variant="success">Active</Badge>
              </li>
            ))}
          </ul>
        )}
      </Card>

      <Card padding="md" className="bg-primary/5 border-primary/20">
        <h3 className="font-semibold text-sm text-foreground mb-2">When a customer places an order</h3>
        <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1.5 list-disc list-inside">
          <li>Customer receives an order summary email</li>
          <li>Admin email(s) receive a new order alert with full details</li>
          <li>Notification appears in this inbox for admin and customer dashboards</li>
          <li>All subscribed devices get a push notification instantly</li>
        </ul>
      </Card>
    </div>
  );
}
