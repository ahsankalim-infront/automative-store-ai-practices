"use client";

import { useCallback, useEffect, useState } from "react";
import { Save, Shield, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { api } from "@/lib/api/client";
import { ADMIN_NAV_GROUPS } from "@/lib/admin/nav";
import {
  DEFAULT_ROLE_PERMISSIONS,
  type AdminPortalRole,
  type RolePermissionsConfig,
} from "@/lib/admin/role-permissions-defaults";
import { useAuthStore } from "@/store/auth-store";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";

const ROLE_TABS: { key: AdminPortalRole; label: string; hint: string }[] = [
  { key: "admin", label: "Admin", hint: "Full access by default" },
  { key: "manager", label: "Manager", hint: "Full access by default" },
  { key: "staff", label: "Staff", hint: "Commerce + Marketing + Content by default" },
];

export function RolePermissionsEditor() {
  const user = useAuthStore((s) => s.user);
  const canEdit = user?.role === "admin";

  const [activeRole, setActiveRole] = useState<AdminPortalRole>("staff");
  const [config, setConfig] = useState<RolePermissionsConfig | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const res = await api.adminGetRolePermissions();
    if (res.success && res.data) setConfig(res.data);
    else toast.error(res.error || "Failed to load role permissions");
    setLoading(false);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const allowed = config?.roles[activeRole] ?? [];

  const toggle = (href: string) => {
    if (!config || !canEdit) return;
    if (activeRole === "admin" && href === "/admin/roles" && allowed.includes(href)) {
      toast.error("Admin must keep access to Roles & Permissions");
      return;
    }
    const next = allowed.includes(href)
      ? allowed.filter((h) => h !== href)
      : [...allowed, href];
    setConfig({
      ...config,
      roles: { ...config.roles, [activeRole]: next },
    });
  };

  const toggleGroup = (groupHrefs: string[], enable: boolean) => {
    if (!config || !canEdit) return;
    const set = new Set(allowed);
    for (const href of groupHrefs) {
      if (enable) set.add(href);
      else if (!(activeRole === "admin" && href === "/admin/roles")) set.delete(href);
    }
    setConfig({
      ...config,
      roles: { ...config.roles, [activeRole]: [...set] },
    });
  };

  const resetRoleDefaults = () => {
    if (!config || !canEdit) return;
    setConfig({
      ...config,
      roles: {
        ...config.roles,
        [activeRole]: [...DEFAULT_ROLE_PERMISSIONS.roles[activeRole]],
      },
    });
  };

  const handleSave = async () => {
    if (!config || !canEdit) return;
    setSaving(true);
    const res = await api.adminUpdateRolePermissions(config.roles);
    setSaving(false);
    if (res.success && res.data) {
      setConfig(res.data);
      toast.success("Role permissions saved");
    } else {
      toast.error(res.error || "Failed to save permissions");
    }
  };

  if (loading || !config) {
    return (
      <Card className="p-6">
        <p className="text-sm text-muted-foreground">Loading role permissions…</p>
      </Card>
    );
  }

  return (
    <Card className="p-4 sm:p-6 space-y-5">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Shield className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <h2 className="text-base font-bold text-foreground">Dashboard Link Permissions</h2>
            <p className="text-sm text-muted-foreground mt-0.5">
              Choose which admin sidebar links each role can open. Changes apply immediately after save.
            </p>
          </div>
        </div>
        {canEdit && (
          <div className="flex items-center gap-2 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              leftIcon={<RotateCcw className="h-3.5 w-3.5" />}
              onClick={resetRoleDefaults}
            >
              Reset {ROLE_TABS.find((r) => r.key === activeRole)?.label}
            </Button>
            <Button
              type="button"
              size="sm"
              loading={saving}
              leftIcon={<Save className="h-3.5 w-3.5" />}
              onClick={handleSave}
            >
              Save Permissions
            </Button>
          </div>
        )}
      </div>

      {!canEdit && (
        <p className="text-xs rounded-lg border border-amber-200 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-800 px-3 py-2 text-amber-800 dark:text-amber-200">
          Only admins can edit role permissions. You can view the current matrix.
        </p>
      )}

      <div className="flex flex-wrap gap-2">
        {ROLE_TABS.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveRole(tab.key)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-sm font-semibold border transition-colors",
              activeRole === tab.key
                ? "bg-primary text-white border-primary"
                : "bg-card border-border text-muted-foreground hover:text-foreground"
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground -mt-2">
        {ROLE_TABS.find((t) => t.key === activeRole)?.hint} · {allowed.length} of{" "}
        {ADMIN_NAV_GROUPS.reduce((n, g) => n + g.items.length, 0)} links enabled
      </p>

      <div className="space-y-4">
        {ADMIN_NAV_GROUPS.map((group) => {
          const hrefs = group.items.map((i) => i.href);
          const allOn = hrefs.every((h) => allowed.includes(h));
          const someOn = hrefs.some((h) => allowed.includes(h));
          return (
            <div key={group.group} className="rounded-xl border border-border overflow-hidden">
              <div className="flex items-center justify-between gap-2 px-3 py-2.5 bg-muted/40 border-b border-border">
                <p className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
                  {group.group}
                </p>
                {canEdit && (
                  <button
                    type="button"
                    onClick={() => toggleGroup(hrefs, !allOn)}
                    className="text-xs font-semibold text-primary hover:underline"
                  >
                    {allOn ? "Clear group" : someOn ? "Select all" : "Select all"}
                  </button>
                )}
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1 p-2">
                {group.items.map((item) => {
                  const checked = allowed.includes(item.href);
                  const locked = activeRole === "admin" && item.href === "/admin/roles";
                  return (
                    <label
                      key={item.href}
                      className={cn(
                        "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm cursor-pointer transition-colors",
                        checked ? "bg-primary/5" : "hover:bg-muted/50",
                        (!canEdit || locked) && "cursor-default opacity-90"
                      )}
                    >
                      <input
                        type="checkbox"
                        className="h-4 w-4 rounded border-border text-primary"
                        checked={checked}
                        disabled={!canEdit || locked}
                        onChange={() => toggle(item.href)}
                      />
                      <span className="min-w-0">
                        <span className="font-medium text-foreground block truncate">{item.label}</span>
                        <span className="text-[10px] text-muted-foreground truncate block">
                          {item.href}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
