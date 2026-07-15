"use client";

import Link from "next/link";
import { Bell, CheckCheck, Mail, Package, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AppNotification } from "@/types";

interface NotificationInboxProps {
  notifications: AppNotification[];
  unreadCount: number;
  loading?: boolean;
  onMarkRead: (id: string) => void;
  onMarkAllRead: () => void;
  emptyMessage?: string;
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(iso).toLocaleDateString("en-PK", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function NotificationInbox({
  notifications,
  unreadCount,
  loading,
  onMarkRead,
  onMarkAllRead,
  emptyMessage = "No notifications yet",
}: NotificationInboxProps) {
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-bold text-foreground flex items-center gap-2">
            <Bell className="h-4 w-4 text-primary" />
            Notification inbox
            {unreadCount > 0 && (
              <Badge variant="default" className="text-[10px]">{unreadCount} new</Badge>
            )}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Order alerts, emails & push delivery status</p>
        </div>
        {unreadCount > 0 && (
          <Button size="sm" variant="outline" leftIcon={<CheckCheck className="h-3.5 w-3.5" />} onClick={onMarkAllRead}>
            Mark all read
          </Button>
        )}
      </div>

      {loading ? (
        <div className="p-8 text-center text-gray-400 text-sm">Loading notifications…</div>
      ) : notifications.length === 0 ? (
        <div className="p-8 text-center text-muted-foreground text-sm rounded-2xl border border-border bg-card">
          {emptyMessage}
        </div>
      ) : (
        <ul className="divide-y divide-border rounded-2xl border border-border bg-card overflow-hidden">
          {notifications.map((n) => (
            <li
              key={n.id}
              className={cn(
                "px-4 py-3 sm:px-5 sm:py-4 transition-colors",
                !n.read && "bg-primary/5"
              )}
            >
              <div className="flex items-start gap-3">
                <div className={cn(
                  "h-9 w-9 rounded-xl flex items-center justify-center shrink-0",
                  n.type === "order_placed" ? "bg-primary/10 text-primary" : "bg-surface text-muted-foreground"
                )}>
                  <Package className="h-4 w-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-0.5">
                    <p className="font-semibold text-sm text-foreground">{n.title}</p>
                    {!n.read && <span className="h-2 w-2 rounded-full bg-primary shrink-0" />}
                  </div>
                  <p className="text-sm text-muted-foreground">{n.body}</p>
                  <div className="flex flex-wrap items-center gap-3 mt-2 text-[10px] text-gray-400">
                    <span>{timeAgo(n.createdAt)}</span>
                    {n.emailSent && (
                      <span className="inline-flex items-center gap-1"><Mail className="h-3 w-3" /> Email sent</span>
                    )}
                    {n.pushSent && (
                      <span className="inline-flex items-center gap-1"><Smartphone className="h-3 w-3" /> Push sent</span>
                    )}
                    {n.orderNumber && <span>#{n.orderNumber}</span>}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {n.link && (
                      <Link
                        href={n.link}
                        onClick={() => !n.read && onMarkRead(n.id)}
                        className="text-xs font-semibold text-primary hover:underline"
                      >
                        View details →
                      </Link>
                    )}
                    {!n.read && (
                      <button
                        type="button"
                        onClick={() => onMarkRead(n.id)}
                        className="text-xs text-gray-500 hover:text-primary"
                      >
                        Mark read
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
