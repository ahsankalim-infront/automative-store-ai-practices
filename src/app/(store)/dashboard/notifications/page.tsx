"use client";

import { useState, useEffect, useCallback } from "react";
import { Bell, Mail, Package, Tag, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NotificationInbox } from "@/components/admin/notification-inbox";
import { api } from "@/lib/api/client";
import type { AppNotification } from "@/types";
import toast from "react-hot-toast";

const STORAGE_KEY = "autozone-notification-prefs";

interface NotificationPrefs {
  orderUpdates: boolean;
  shippingAlerts: boolean;
  promotions: boolean;
  serviceReminders: boolean;
  emailDigest: boolean;
}

const defaultPrefs: NotificationPrefs = {
  orderUpdates: true,
  shippingAlerts: true,
  promotions: false,
  serviceReminders: true,
  emailDigest: false,
};

const prefItems: { key: keyof NotificationPrefs; label: string; desc: string; icon: typeof Bell }[] = [
  { key: "orderUpdates", label: "Order updates", desc: "Confirmations, status changes, and receipts", icon: Package },
  { key: "shippingAlerts", label: "Shipping alerts", desc: "When your order ships or is out for delivery", icon: Bell },
  { key: "promotions", label: "Deals & promotions", desc: "Flash sales, coupons, and new arrivals", icon: Tag },
  { key: "serviceReminders", label: "Service reminders", desc: "Upcoming poshish and fitting appointments", icon: Wrench },
  { key: "emailDigest", label: "Weekly email digest", desc: "Summary of orders and recommendations", icon: Mail },
];

export default function NotificationsPage() {
  const [prefs, setPrefs] = useState<NotificationPrefs>(defaultPrefs);
  const [saved, setSaved] = useState(false);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);

  const loadInbox = useCallback(async () => {
    setLoading(true);
    const res = await api.getNotifications();
    if (res.success && res.data) {
      setNotifications(res.data.notifications);
      setUnreadCount(res.data.unreadCount);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setPrefs({ ...defaultPrefs, ...JSON.parse(raw) });
    } catch {
      /* ignore */
    }
    loadInbox();
  }, [loadInbox]);

  const toggle = (key: keyof NotificationPrefs) => {
    setPrefs((p) => ({ ...p, [key]: !p[key] }));
    setSaved(false);
  };

  const handleSave = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
    setSaved(true);
    toast.success("Notification preferences saved!");
  };

  const handleMarkRead = async (id: string) => {
    await api.markNotificationRead(id);
    loadInbox();
  };

  const handleMarkAllRead = async () => {
    await api.markAllNotificationsRead();
    toast.success("All marked as read");
    loadInbox();
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-foreground">Notifications</h1>
        <p className="text-sm text-gray-500 mt-1">Your order updates and alert preferences.</p>
      </div>

      <NotificationInbox
        notifications={notifications}
        unreadCount={unreadCount}
        loading={loading}
        onMarkRead={handleMarkRead}
        onMarkAllRead={handleMarkAllRead}
        emptyMessage="No notifications yet. You'll see order confirmations here after checkout."
      />

      <div>
        <h2 className="font-bold text-foreground text-sm mb-3">Email & alert preferences</h2>
        <div className="bg-card rounded-2xl border border-border divide-y divide-border">
          {prefItems.map((item) => {
            const PrefIcon = item.icon;
            return (
            <label
              key={item.key}
              className="flex items-start gap-4 p-4 sm:p-5 cursor-pointer hover:bg-surface transition-colors first:rounded-t-2xl last:rounded-b-2xl"
            >
              <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <PrefIcon className="h-5 w-5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground text-sm">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.desc}</p>
              </div>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={() => toggle(item.key)}
                className="h-5 w-5 rounded border-border text-primary focus:ring-primary shrink-0 mt-1"
              />
            </label>
            );
          })}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button onClick={handleSave}>Save Preferences</Button>
        {saved && <span className="text-sm text-green-600">Saved</span>}
      </div>
    </div>
  );
}
