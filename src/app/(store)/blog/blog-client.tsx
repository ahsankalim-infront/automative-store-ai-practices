"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { Clock, Eye, ArrowRight, Search } from "lucide-react";
import { useBlogPosts } from "@/hooks/use-api-data";
import { formatDate } from "@/lib/utils";
import { Breadcrumb } from "@/components/shared/breadcrumb";

export default function BlogPage() {
  const { data, loading } = useBlogPosts();
  const blogPosts = data ?? [];
  const featured = blogPosts.find(p => p.isFeatured);
  const rest = blogPosts.filter(p => !p.isFeatured || p.id !== featured?.id);
  const categories = [...new Set(blogPosts.map(p => p.category))];

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <p className="text-gray-500">Loading articles...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-screen-xl mx-auto px-4 py-8">
        <Breadcrumb items={[{ label: "Blog" }]} className="mb-6" />
        <div className="flex items-start justify-between gap-4 mb-8 flex-wrap">
          <div>
            <h1 className="text-3xl font-black text-foreground">Auto Guides & News</h1>
            <p className="text-gray-500 mt-1">Expert tips, buying guides, and Pakistan auto industry updates</p>
          </div>
          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input placeholder="Search articles..." className="w-full sm:w-56 pl-9 pr-4 py-2 text-sm border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary dark:bg-gray-900 dark:text-white" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-8">
          <button className="px-4 py-1.5 rounded-full bg-primary text-white text-xs font-semibold">All</button>
          {categories.map(cat => (
            <button key={cat} className="px-4 py-1.5 rounded-full bg-card border border-border text-xs font-medium text-gray-600 dark:text-gray-400 hover:border-primary hover:text-primary transition-colors">{cat}</button>
          ))}
        </div>

        {featured && (
          <Link href={`/blog/${featured.slug}`} className="block mb-10 group">
            <div className="grid md:grid-cols-2 gap-6 bg-card rounded-3xl border border-border overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative aspect-video md:aspect-auto md:min-h-[280px]">
                <Image src={featured.coverImage} alt={featured.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 50vw" />
              </div>
              <div className="p-6 md:p-8 flex flex-col justify-center">
                <span className="text-xs font-bold text-primary uppercase tracking-wider mb-2">{featured.category}</span>
                <h2 className="text-2xl font-black text-foreground mb-3 group-hover:text-primary transition-colors">{featured.title}</h2>
                <p className="text-gray-500 text-sm line-clamp-3 mb-4">{featured.excerpt}</p>
                <div className="flex items-center gap-4 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {featured.readTime} min read</span>
                  <span className="flex items-center gap-1"><Eye className="h-3.5 w-3.5" /> {featured.viewCount.toLocaleString()}</span>
                  <span>{formatDate(featured.publishedAt)}</span>
                </div>
              </div>
            </div>
          </Link>
        )}

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {rest.map(post => (
            <Link key={post.id} href={`/blog/${post.slug}`} className="group bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg transition-all">
              <div className="relative aspect-video">
                <Image src={post.coverImage} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <span className="text-[10px] font-bold text-primary uppercase">{post.category}</span>
                <h3 className="font-bold text-foreground mt-1 mb-2 line-clamp-2 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                <span className="text-xs text-primary font-semibold flex items-center gap-1">Read more <ArrowRight className="h-3 w-3" /></span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
