import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("orderSuccess");
}

export default function OrderSuccessLayout({ children }: { children: React.ReactNode }) {
  return children;
}
