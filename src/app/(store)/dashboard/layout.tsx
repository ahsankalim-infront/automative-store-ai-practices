import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("dashboard");
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
