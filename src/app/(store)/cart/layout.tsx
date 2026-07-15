import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("cart");
}

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return children;
}
