import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import AboutClient from "./about-client";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("about");
}

export default AboutClient;
