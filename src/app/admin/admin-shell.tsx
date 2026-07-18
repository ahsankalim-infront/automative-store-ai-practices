"use client";
import { useState, useEffect, useMemo } from "react";
import { usePathname, useRouter } from "next/navigation";
import { AdminSidebar } from "@/components/admin/admin-sidebar";
import { AdminHeader } from "@/components/admin/admin-header";
import { AnimatePresence, motion } from "framer-motion";
import { useAuthStore } from "@/store/auth-store";
import { api } from "@/lib/api/client";
import {
  canAccessAdminPath,
  firstAllowedAdminPath,
  getPermissionsForRole,
  type RolePermissionsConfig,
} from "@/lib/admin/role-permissions-defaults";

export default function AdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const user = useAuthStore((s) => s.user);
  const [mobileSidebar, setMobileSidebar] = useState(false);
  const [permissions, setPermissions] = useState<RolePermissionsConfig | null>(null);

  useEffect(() => {
    if (!mobileSidebar) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [mobileSidebar]);

  useEffect(() => {
    if (pathname === "/admin/login") return;
    api.adminGetRolePermissions().then((res) => {
      if (res.success && res.data) setPermissions(res.data);
    });
  }, [pathname]);

  const allowed = useMemo(
    () => (permissions ? getPermissionsForRole(permissions, user?.role) : null),
    [permissions, user?.role]
  );

  useEffect(() => {
    if (pathname === "/admin/login" || !allowed || !user) return;
    if (!canAccessAdminPath(pathname, allowed)) {
      router.replace(firstAllowedAdminPath(allowed));
    }
  }, [pathname, allowed, user, router]);

  if (pathname === "/admin/login") {
    return <>{children}</>;
  }

  const denied = Boolean(allowed && user && !canAccessAdminPath(pathname, allowed));

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <div className="hidden lg:flex">
        <AdminSidebar permissions={permissions} />
      </div>

      <AnimatePresence>
        {mobileSidebar && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="lg:hidden fixed inset-0 z-50 flex">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileSidebar(false)} aria-hidden />
            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 320 }}
              className="relative h-full max-h-[100dvh] w-[min(18rem,calc(100vw-1rem))] max-w-[88vw] shadow-2xl"
            >
              <AdminSidebar mobile permissions={permissions} onNavigate={() => setMobileSidebar(false)} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <AdminHeader onMenuToggle={() => setMobileSidebar(!mobileSidebar)} />
        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          {denied ? (
            <p className="text-sm text-muted-foreground">Redirecting to an allowed page…</p>
          ) : (
            children
          )}
        </main>
      </div>
    </div>
  );
}
