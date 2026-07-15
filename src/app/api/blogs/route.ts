import { getBlogPosts, getBlogBySlug } from "@/lib/data/repositories";
import { ok, notFound } from "@/lib/api/helpers";

export async function GET(request: Request) {
  const slug = new URL(request.url).searchParams.get("slug");
  if (slug) {
    const post = await getBlogBySlug(slug);
    if (!post) return notFound("Blog post not found");
    return ok(post);
  }
  return ok(await getBlogPosts());
}
