import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("authLogin");
}

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return children;
}
