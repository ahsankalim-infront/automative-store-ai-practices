"use client";
import Link from "next/link";
import { AppImage as Image } from "@/components/ui/app-image";
import { motion } from "framer-motion";
import { Clock, ArrowRight, Eye } from "lucide-react";
import { SectionHeader } from "@/components/shared/section-header";
import { formatDate } from "@/lib/utils";
import type { BlogPost } from "@/types";

export function BlogSection({ posts: blogPosts }: { posts: BlogPost[] }) {
  const posts = blogPosts.slice(0, 4);

  return (
    <section className="py-16 sm:py-20 bg-card border-t border-border">
      <div className="max-w-screen-xl mx-auto px-4">
        <SectionHeader
          badge="Latest News"
          title="Auto Guides & News"
          subtitle="Expert tips, buying guides, and Pakistan auto industry updates"
          viewAllHref="/blog"
        />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
            >
              <Link
                href={`/blog/${post.slug}`}
                className="group flex flex-col bg-card rounded-2xl border border-border overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300"
              >
                <div className="relative h-44 bg-gray-100 dark:bg-gray-800 overflow-hidden">
                  <Image
                    src={post.coverImage}
                    alt={post.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <span className="absolute top-3 left-3 bg-primary text-white text-xs font-semibold px-2.5 py-1 rounded-full">
                    {post.category}
                  </span>
                </div>
                <div className="p-4 flex flex-col flex-1">
                  <div className="flex items-center gap-3 text-xs text-gray-400 mb-2">
                    <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> {post.readTime} min read</span>
                    <span className="flex items-center gap-1"><Eye className="h-3 w-3" /> {(post.viewCount / 1000).toFixed(1)}K</span>
                  </div>
                  <h3 className="font-bold text-foreground text-sm line-clamp-2 mb-2 group-hover:text-primary transition-colors flex-1">
                    {post.title}
                  </h3>
                  <p className="text-xs text-gray-500 line-clamp-2 mb-3">{post.excerpt}</p>
                  <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-border">
                    <span>{formatDate(post.publishedAt)}</span>
                    <span className="flex items-center gap-1 text-primary font-semibold group-hover:gap-2 transition-all">
                      Read <ArrowRight className="h-3 w-3" />
                    </span>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
