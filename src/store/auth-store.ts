"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { User } from "@/types";
import { api } from "@/lib/api/client";
import { clearAuthStorage } from "@/lib/auth/session";

interface LogoutOptions {
  /** Where to redirect after logout. Pass `null` to stay on the current page. */
  redirectTo?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<{ ok: boolean; user?: User; error?: string }>;
  adminLogin: (email: string, password: string) => Promise<{ ok: boolean; user?: User; error?: string }>;
  register: (data: { name: string; email: string; phone?: string; password: string }) => Promise<{ ok: boolean; error?: string }>;
  logout: (options?: LogoutOptions) => Promise<void>;
  fetchMe: () => Promise<void>;
  setAuth: (user: User, token: string) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      isLoading: false,

      setAuth: (user, token) => {
        api.setToken(token);
        set({ user, token });
      },

      login: async (email, password) => {
        set({ isLoading: true });
        const res = await api.login(email, password);
        set({ isLoading: false });
        if (res.success && res.data) {
          get().setAuth(res.data.user, res.data.token);
          return { ok: true, user: res.data.user };
        }
        return { ok: false, error: res.error || "Login failed" };
      },

      adminLogin: async (email, password) => {
        set({ isLoading: true });
        const res = await api.adminLogin(email, password);
        set({ isLoading: false });
        if (res.success && res.data) {
          get().setAuth(res.data.user, res.data.token);
          return { ok: true, user: res.data.user };
        }
        return { ok: false, error: res.error || "Login failed" };
      },

      register: async (data) => {
        set({ isLoading: true });
        const res = await api.register(data);
        set({ isLoading: false });
        if (res.success && res.data) {
          get().setAuth(res.data.user, res.data.token);
          return { ok: true };
        }
        return { ok: false, error: res.error || "Registration failed" };
      },

      logout: async (options) => {
        const redirectTo = options?.redirectTo === undefined ? "/auth/login" : options.redirectTo;

        try {
          await api.logout();
        } catch {
          // Always clear local session even if the API call fails
        }

        set({ user: null, token: null });
        api.setToken(null);
        clearAuthStorage();
        useAuthStore.persist.clearStorage();

        if (redirectTo && typeof window !== "undefined") {
          window.location.href = redirectTo;
        }
      },

      fetchMe: async () => {
        const token = get().token;
        if (!token) return;
        api.setToken(token);
        const res = await api.me();
        if (res.success && res.data) set({ user: res.data });
        else await get().logout({ redirectTo: null });
      },
    }),
    {
      name: "autozone-auth",
      partialize: (s) => ({ user: s.user, token: s.token }),
      onRehydrateStorage: () => (state) => {
        if (state?.token) api.setToken(state.token);
      },
    }
  )
);

export function useIsAdmin() {
  const user = useAuthStore((s) => s.user);
  return user?.role === "admin" || user?.role === "manager" || user?.role === "staff";
}
