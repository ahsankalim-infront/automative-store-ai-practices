"use client";

import { Bell, Search, Sun, Moon, ExternalLink, Menu, CheckCheck } from "lucide-react";
import Link from "next/link";
import { useState, useEffect, useRef, useCallback } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api/client";
import type { AppNotification } from "@/types";
import { cn } from "@/lib/utils";

interface AdminHeaderProps {
  title?: string;
  onMenuToggle?: () => void;
}

export function AdminHeader({ title, onMenuToggle }: AdminHeaderProps) {
  const { resolvedTheme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [search, setSearch] = useState("");
  const [unreadNotifs, setUnreadNotifs] = useState(0);
  const [notifOpen, setNotifOpen] = useState(false);
  const [recentNotifs, setRecentNotifs] = useState<AppNotification[]>([]);
  const [notifLoading, setNotifLoading] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);

  const loadUnread = useCallback(async () => {
    const res = await api.getAdminNotificationInbox();
    if (res.success && res.data) {
      setUnreadNotifs(res.data.unreadCount);
      setRecentNotifs(res.data.notifications.slice(0, 6));
    }
  }, []);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    loadUnread();
  }, [loadUnread, pathname]);

  useEffect(() => {
    if (!notifOpen) return;
    setNotifLoading(true);
    loadUnread().finally(() => setNotifLoading(false));
  }, [notifOpen, loadUnread]);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    if (notifOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [notifOpen]);

  const toggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) router.push(`/admin/orders?q=${encodeURIComponent(search.trim())}`);
  };

  const markReadAndClose = async (id: string, link?: string) => {
    await api.markNotificationRead(id);
    setNotifOpen(false);
    loadUnread();
    if (link) router.push(link);
  };

  const isDark = mounted && resolvedTheme === "dark";

  return (
    <header className="relative z-30 h-16 bg-card border-b border-border flex items-center gap-4 px-4 md:px-6 shrink-0">
      <button
        type="button"
        onClick={onMenuToggle}
        className="lg:hidden h-11 w-11 flex items-center justify-center rounded-xl text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {title && <h1 className="text-base font-bold text-foreground hidden sm:block">{title}</h1>}

      <form onSubmit={handleSearch} className="flex-1 hidden md:block max-w-xs">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders..."
            className="w-full pl-9 pr-4 py-2 text-sm bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
          />
        </div>
      </form>

      <div className="flex items-center gap-1 sm:gap-2 ml-auto">
        {/* Theme toggle */}
        <button
          type="button"
          onClick={toggleTheme}
          className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-surface hover:text-primary transition-colors"
          aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
          title={isDark ? "Light mode" : "Dark mode"}
        >
          {mounted ? (
            isDark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />
          ) : (
            <Moon className="h-4 w-4 opacity-50" />
          )}
        </button>

        {/* Notifications dropdown */}
        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setNotifOpen((o) => !o)}
            className={cn(
              "relative h-9 w-9 rounded-xl flex items-center justify-center transition-colors",
              notifOpen
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground hover:bg-surface hover:text-primary"
            )}
            aria-label="Notifications"
            aria-expanded={notifOpen}
          >
            <Bell className="h-4 w-4" />
            {unreadNotifs > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-0.5 rounded-full bg-primary text-white text-[9px] font-bold flex items-center justify-center pointer-events-none">
                {unreadNotifs > 9 ? "9+" : unreadNotifs}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-[min(100vw-2rem,22rem)] bg-popover rounded-2xl border border-border shadow-2xl z-50 overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-surface/80">
                <p className="font-bold text-sm text-foreground">Notifications</p>
                {unreadNotifs > 0 && (
                  <span className="text-[10px] font-bold text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                    {unreadNotifs} new
                  </span>
                )}
              </div>

              <div className="max-h-72 overflow-y-auto">
                {notifLoading ? (
                  <p className="p-6 text-center text-sm text-gray-400">Loading…</p>
                ) : recentNotifs.length === 0 ? (
                  <p className="p-6 text-center text-sm text-gray-400">No notifications yet</p>
                ) : (
                  <ul className="divide-y divide-border">
                    {recentNotifs.map((n) => (
                      <li key={n.id}>
                        <button
                          type="button"
                          onClick={() => markReadAndClose(n.id, n.link)}
                          className={cn(
                            "w-full text-left px-4 py-3 hover:bg-surface transition-colors",
                            !n.read && "bg-primary/5"
                          )}
                        >
                          <p className="text-sm font-semibold text-foreground line-clamp-1">{n.title}</p>
                          <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.body}</p>
                          <p className="text-[10px] text-gray-400 mt-1">
                            {new Date(n.createdAt).toLocaleString("en-PK", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" })}
                          </p>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="p-3 border-t border-border bg-surface/80 flex gap-2">
                <Link
                  href="/admin/notifications"
                  onClick={() => setNotifOpen(false)}
                  className="flex-1 text-center text-xs font-semibold text-primary hover:underline py-2"
                >
                  View all & push settings
                </Link>
                {unreadNotifs > 0 && (
                  <button
                    type="button"
                    onClick={async () => {
                      await api.markAllNotificationsRead();
                      loadUnread();
                    }}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-primary px-2 py-2"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    Read all
                  </button>
                )}
              </div>
            </div>
          )}
        </div>

        <Link
          href="/"
          target="_blank"
          className="h-9 w-9 rounded-xl flex items-center justify-center text-muted-foreground hover:bg-surface hover:text-primary transition-colors"
          title="View Store"
        >
          <ExternalLink className="h-4 w-4" />
        </Link>

        <div className="flex items-center gap-2 pl-2 border-l border-border min-w-0">
          <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
            {user?.name?.charAt(0)?.toUpperCase() || "A"}
          </div>
          <div className="hidden sm:block min-w-0 max-w-[120px] md:max-w-none">
            <p className="text-xs font-semibold text-foreground truncate">{user?.name || "Admin"}</p>
            <p className="text-xs text-gray-400 truncate capitalize">{user?.role || "Admin"}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
