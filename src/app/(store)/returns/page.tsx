import type { Metadata } from "next";
import { getBrandConfig } from "@/lib/brand/get-brand-config";
import ReturnsClient from "./returns-client";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandConfig();
  return {
    title: `Returns & Refunds — ${brand.name}`,
    description: `Return, exchange, and refund policy for ${brand.name} car poshish products and custom seat covers in Lahore.`,
  };
}

export default ReturnsClient;
