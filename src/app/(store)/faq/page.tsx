import type { Metadata } from "next";
import { getBrandConfig } from "@/lib/brand/get-brand-config";
import FaqClient from "./faq-client";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandConfig();
  return {
    title: `FAQ — ${brand.name}`,
    description: `Frequently asked questions about car seat covers, floor matting, orders, shipping, returns and poshish services at ${brand.name}, Lahore.`,
  };
}

export default FaqClient;
