import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import ContactClient from "./contact-client";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("contact");
}

export default ContactClient;
