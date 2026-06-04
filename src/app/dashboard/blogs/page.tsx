"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, Calendar, FileText, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

interface Blog {
  _id: string;
  title: string;
  slug: string;
  summary: string;
  createdAt: string;
}

export default function BlogsDashboardPage() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        if (res.ok) {
          const data = await res.json();
          setBlogs(data);
        }
      } catch (error) {
        console.error("Failed to fetch blogs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  // GSAP animation
  useGSAP(
    () => {
      if (!loading) {
        gsap.fromTo(
          ".animate-blog-list-item",
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }
    },
    { scope: containerRef, dependencies: [loading] }
  );

  const handleDelete = async (id: string) => {
    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
      cancelButtonText: "No, cancel!",
      customClass: {
        confirmButton: "bg-destructive text-white border-0 font-semibold px-4 py-2 rounded-lg hover:opacity-90 active:scale-95 transition-all duration-200 shadow-md cursor-pointer ml-3",
        cancelButton: "bg-muted text-muted-foreground border border-border font-semibold px-4 py-2 rounded-lg hover:bg-muted/80 active:scale-95 transition-all duration-200 cursor-pointer",
        popup: "bg-card text-foreground border border-border/80 rounded-2xl shadow-xl font-sans",
        title: "text-foreground font-bold",
        htmlContainer: "text-muted-foreground text-sm",
      },
      buttonsStyling: false,
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const res = await fetch(`/api/blogs/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setBlogs(blogs.filter((blog) => blog._id !== id));
            toast.success("Deleted successfully!");
          } else {
            const errorData = await res.json().catch(() => ({}));
            toast.error(errorData.error || "Failed to delete blog post.");
          }
        } catch (error) {
          console.error("Error deleting blog:", error);
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    });
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header with Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-blog-list-item space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Blogs
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your written articles and publications.
          </p>
        </div>
        
        <div className="animate-blog-list-item">
          <Link
            href="/dashboard/blogs/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 text-sm font-semibold text-white shadow-md hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Plus className="size-4" />
            Create Post
          </Link>
        </div>
      </div>

      {/* Blogs List Card */}
      <div className="animate-blog-list-item rounded-xl border border-border/50 bg-card p-6 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">
              Loading posts...
            </p>
          </div>
        ) : blogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 bg-muted rounded-full text-muted-foreground/60">
              <FileText className="size-10" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="text-sm font-semibold text-foreground">No posts drafted</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                Get started by creating your very first article using the rich text editor.
              </p>
            </div>
            <Link
              href="/dashboard/blogs/create"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              Write First Post
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Title</th>
                  <th className="py-3 px-4">Slug</th>
                  <th className="py-3 px-4">Created Date</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {blogs.map((blog) => (
                  <tr
                    key={blog._id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-4 font-semibold text-foreground max-w-sm truncate">
                      {blog.title}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground/80 max-w-xs truncate font-mono text-xs">
                      {blog.slug}
                    </td>
                    <td className="py-4 px-4 text-muted-foreground/80">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3.5" />
                        {new Date(blog.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        href={`/dashboard/blogs/edit/${blog._id}`}
                        className="inline-flex p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer"
                        title="Edit Post"
                      >
                        <Edit className="size-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(blog._id)}
                        className="inline-flex p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-all duration-200 cursor-pointer"
                        title="Delete Post"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
