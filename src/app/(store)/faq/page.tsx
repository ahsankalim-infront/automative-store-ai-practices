import type { Metadata } from "next";
import { BRAND } from "@/lib/brand/config";
import FaqClient from "./faq-client";

export const metadata: Metadata = {
  title: `FAQ — ${BRAND.name}`,
  description: `Frequently asked questions about car seat covers, floor matting, orders, shipping, returns and poshish services at ${BRAND.name}, Lahore.`,
};

export default FaqClient;
