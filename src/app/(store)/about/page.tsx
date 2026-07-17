import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import { getAboutPageContent } from "@/lib/about-content";
import AboutClient from "./about-client";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("about");
}

export default async function AboutPage() {
  const content = await getAboutPageContent();
  return <AboutClient content={content} />;
}
