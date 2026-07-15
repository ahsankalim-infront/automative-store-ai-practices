import { getBlogBySlug } from "@/lib/data/repositories";
import { ok, notFound } from "@/lib/api/helpers";

export async function GET(_: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getBlogBySlug(slug);
  if (!post) return notFound("Blog post not found");
  return ok(post);
}
