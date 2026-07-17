import type { Metadata } from "next";
import AdminShell from "./admin-shell";
import { BrandProvider } from "@/lib/brand/brand-context";
import { getBrandConfig } from "@/lib/brand/get-brand-config";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
  title: "Admin Dashboard",
};

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const brand = await getBrandConfig();
  return (
    <BrandProvider brand={brand}>
      <AdminShell>{children}</AdminShell>
    </BrandProvider>
  );
}
