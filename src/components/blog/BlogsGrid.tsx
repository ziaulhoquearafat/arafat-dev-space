"use client";

import React, { useRef } from "react";
import Link from "next/link";
import { Calendar, Tag } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface BlogItem {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  thumbnail: string;
  tags: string[];
  createdAt: string;
}

interface BlogsGridProps {
  blogs: BlogItem[];
}

export function BlogsGrid({ blogs }: BlogsGridProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        ".animate-blog-card",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div ref={containerRef} className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <article
          key={blog._id}
          className="animate-blog-card group relative flex flex-col overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-border opacity-0"
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
                <Link href={`/blogs/${blog.slug}`}>{blog.title}</Link>
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
  );
}
