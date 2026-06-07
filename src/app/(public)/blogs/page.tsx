import React from "react";
import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { BlogsGrid } from "@/components/blog/BlogsGrid";

export const revalidate = 0; // Dynamic rendering for latest data

export default async function PublicBlogsPage() {
  await dbConnect();
  const blogs = await Blog.find({}).sort({ createdAt: -1 });

  const serializedBlogs = blogs.map((blog) => ({
    _id: blog._id.toString(),
    title: blog.title,
    slug: blog.slug,
    summary: blog.summary,
    thumbnail: blog.thumbnail,
    tags: blog.tags || [],
    createdAt: blog.createdAt.toISOString(),
  }));

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
          <BlogsGrid blogs={serializedBlogs} />
        )}
      </div>
    </div>
  );
}
