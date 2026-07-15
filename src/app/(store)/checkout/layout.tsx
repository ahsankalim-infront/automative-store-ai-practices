import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("checkout");
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return children;
}
