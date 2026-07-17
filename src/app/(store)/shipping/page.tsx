import type { Metadata } from "next";
import { getBrandConfig } from "@/lib/brand/get-brand-config";
import ShippingClient from "./shipping-client";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandConfig();
  return {
    title: `Shipping Policy — ${brand.name}`,
    description: `Delivery times, shipping rates, and nationwide courier information for ${brand.name} car poshish products in Pakistan.`,
  };
}

export default ShippingClient;
