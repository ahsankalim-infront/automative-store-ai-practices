import type { Metadata } from "next";
import { BRAND } from "@/lib/brand/config";
import ShippingClient from "./shipping-client";

export const metadata: Metadata = {
  title: `Shipping Policy — ${BRAND.name}`,
  description: `Delivery times, shipping rates, and nationwide courier information for ${BRAND.name} car poshish products in Pakistan.`,
};

export default ShippingClient;
