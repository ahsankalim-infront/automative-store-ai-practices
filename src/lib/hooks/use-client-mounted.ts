"use client";

import { useSyncExternalStore } from "react";

/** True only after client hydration — avoids SSR/client mismatches for persisted UI state. */
export function useClientMounted(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}
