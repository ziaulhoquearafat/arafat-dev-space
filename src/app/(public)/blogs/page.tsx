import React from "react";
import Link from "next/link";
import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { Calendar, Tag } from "lucide-react";

export const revalidate = 0; // Dynamic rendering for latest data

export default async function PublicBlogsPage() {
  await dbConnect();
  const blogs = await Blog.find({}).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Blogs
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            Insights, tutorials, and thoughts on web development and design systems.
          </p>
        </div>

        {/* Blogs Grid */}
        {blogs.length === 0 ? (
          <div className="text-center py-20 border border-border/50 rounded-2xl bg-card">
            <p className="text-muted-foreground font-medium">No blog posts found.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <article
                key={blog._id.toString()}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-border"
              >
                {/* Thumbnail */}
                <div className="aspect-video relative overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={blog.thumbnail}
                    alt={blog.title}
                    className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="flex-1 p-6 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Tags */}
                    {blog.tags && blog.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {blog.tags.map((tag: string) => (
                          <span
                            key={tag}
                            className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary"
                          >
                            <Tag className="size-3" />
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    <h3 className="text-xl font-bold tracking-tight text-foreground line-clamp-2 group-hover:text-primary transition-colors duration-200">
                      <Link href={`/blogs/${blog.slug}`}>
                        {blog.title}
                      </Link>
                    </h3>

                    <p className="text-sm text-muted-foreground line-clamp-3">
                      {blog.summary}
                    </p>
                  </div>

                  <div className="flex items-center text-xs text-muted-foreground/80 pt-4 border-t border-border/40">
                    <span className="flex items-center gap-1">
                      <Calendar className="size-3.5" />
                      {new Date(blog.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
