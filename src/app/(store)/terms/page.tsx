import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import TermsClient from "./terms-client";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("terms");
}

export default TermsClient;
