import type { Metadata } from "next";
import { BRAND } from "@/lib/brand/config";
import ReturnsClient from "./returns-client";

export const metadata: Metadata = {
  title: `Returns & Refunds — ${BRAND.name}`,
  description: `Return, exchange and refund policy for ${BRAND.name}. Custom seat covers, floor matting, and standard product returns explained.`,
};

export default ReturnsClient;
