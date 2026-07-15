import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import StoreLocatorClient from "./store-locator-client";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("storeLocator");
}

export default StoreLocatorClient;
