import type { Metadata } from "next";
import { buildPageMetadata } from "@/lib/seo/metadata";
import BlogClient from "./blog-client";

export async function generateMetadata(): Promise<Metadata> {
  return buildPageMetadata("blog");
}

export default BlogClient;
