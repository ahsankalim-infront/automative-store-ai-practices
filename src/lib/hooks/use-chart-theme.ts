"use client";

import { useTheme } from "next-themes";
import { useClientMounted } from "@/lib/hooks/use-client-mounted";

export function useChartTheme() {
  const { resolvedTheme } = useTheme();
  const mounted = useClientMounted();
  const dark = mounted && resolvedTheme === "dark";

  return {
    grid: dark ? "#2e2e2e" : "#f0f0f0",
    tick: dark ? "#a1a1aa" : "#6b7280",
    tooltip: {
      backgroundColor: dark ? "#141414" : "#ffffff",
      border: `1px solid ${dark ? "#27272a" : "#e5e7eb"}`,
      borderRadius: 8,
      color: dark ? "#fafafa" : "#111111",
    },
  };
}
