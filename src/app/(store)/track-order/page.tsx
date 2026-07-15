import type { Metadata } from "next";
import { BRAND } from "@/lib/brand/config";
import TrackOrderClient from "./track-order-client";

export const metadata: Metadata = {
  title: `Track Order — ${BRAND.name}`,
  description: `Track your ${BRAND.name} order status with your order number and phone. See shipping updates for seat covers, floor matting and accessories.`,
};

export default TrackOrderClient;
