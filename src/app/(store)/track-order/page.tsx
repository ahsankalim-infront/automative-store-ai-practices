import type { Metadata } from "next";
import { getBrandConfig } from "@/lib/brand/get-brand-config";
import TrackOrderClient from "./track-order-client";

export async function generateMetadata(): Promise<Metadata> {
  const brand = await getBrandConfig();
  return {
    title: `Track Order — ${brand.name}`,
    description: `Track your ${brand.name} order status with your order number and phone. See shipping updates for seat covers, floor matting and accessories.`,
  };
}

export default TrackOrderClient;
