import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import ServicesClient from "./services-client";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("services");
}

export default ServicesClient;
