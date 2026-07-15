/** Keys used for auth session persistence in the browser */
export const AUTH_STORAGE_KEYS = ["auth_token", "autozone-auth"] as const;

/** Remove all auth tokens and persisted auth state from browser storage */
export function clearAuthStorage() {
  if (typeof window === "undefined") return;

  for (const key of AUTH_STORAGE_KEYS) {
    localStorage.removeItem(key);
    sessionStorage.removeItem(key);
  }
}
