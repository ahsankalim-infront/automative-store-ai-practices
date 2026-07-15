"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

const STORAGE_KEY = "shp-theme";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="light"
      enableSystem={false}
      storageKey={STORAGE_KEY}
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export { STORAGE_KEY as THEME_STORAGE_KEY };
