"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { QuillEditor } from "@/components/editor/QuillEditor";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "react-hot-toast";

// Define form validation schema using Zod
const blogFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  slug: z
    .string()
    .min(1, "Slug is required.")
    .regex(
      /^[a-z0-9-]+$/,
      "Slug must only contain lowercase letters, numbers, and hyphens."
    ),
  summary: z.string().min(1, "Summary is required."),
  tags: z.string().optional(),
  thumbnail: z
    .any()
    .refine(
      (files) => files && files.length > 0,
      "Thumbnail image is required."
    ),
  content: z.string().min(1, "Content is required."),
});

type BlogFormValues = z.infer<typeof blogFormSchema>;

export default function CreateBlogPage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { errors, isSubmitting, dirtyFields },
  } = useForm<BlogFormValues>({
    resolver: zodResolver(blogFormSchema),
    defaultValues: {
      title: "",
      slug: "",
      summary: "",
      tags: "",
      content: "",
    },
  });

  const title = watch("title");
  const isSlugDirty = dirtyFields.slug;

  // Auto-generate slug from title if the slug input hasn't been manually dirtied
  useEffect(() => {
    if (title && !isSlugDirty) {
      const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // remove special characters
        .trim()
        .replace(/\s+/g, "-") // replace spaces with hyphens
        .replace(/-+/g, "-"); // remove double hyphens
      setValue("slug", generatedSlug, { shouldValidate: true });
    }
  }, [title, isSlugDirty, setValue]);

  // Entrance GSAP animation
  useGSAP(
    () => {
      gsap.fromTo(
        ".animate-form-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    },
    { scope: containerRef }
  );

  const onSubmit = async (data: BlogFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("slug", data.slug);
      formData.append("summary", data.summary);
      formData.append("content", data.content);
      if (data.tags) {
        formData.append("tags", data.tags);
      }

      // Extract File object from the FileList
      if (data.thumbnail && data.thumbnail.length > 0) {
        formData.append("thumbnail", data.thumbnail[0]);
      }

      const res = await fetch("/api/blogs", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        toast.success("Blog post created successfully!");
        router.push("/dashboard/blogs");
        router.refresh();
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to create blog post.");
      }
    } catch (error) {
      console.error("Error creating blog:", error);
      toast.error("An unexpected error occurred. Please try again.");
    }
  };

  return (
    <div ref={containerRef} className="space-y-6 max-w-4xl">
      {/* Back link */}
      <div className="animate-form-item">
        <Link
          href="/dashboard/blogs"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Blogs
        </Link>
      </div>

      {/* Page Header */}
      <div className="animate-form-item space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Blog
        </h1>
        <p className="text-sm text-muted-foreground">
          Draft and publish a new post to your portfolio.
        </p>
      </div>

      {/* Main card */}
      <div className="animate-form-item rounded-xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Title & Slug Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Title Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-muted-foreground"
              >
                Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                placeholder="How to build Next.js apps"
                disabled={isSubmitting}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs font-medium text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Slug Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="slug"
                className="text-sm font-semibold text-muted-foreground"
              >
                Slug
              </label>
              <input
                id="slug"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                placeholder="how-to-build-nextjs-apps"
                disabled={isSubmitting}
                {...register("slug")}
              />
              {errors.slug && (
                <p className="text-xs font-medium text-destructive">
                  {errors.slug.message}
                </p>
              )}
            </div>
          </div>

          {/* Summary Area */}
          <div className="space-y-1.5">
            <label
              htmlFor="summary"
              className="text-sm font-semibold text-muted-foreground"
            >
              Summary
            </label>
            <textarea
              id="summary"
              rows={3}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45 resize-none"
              placeholder="Provide a brief overview of this blog post..."
              disabled={isSubmitting}
              {...register("summary")}
            />
            {errors.summary && (
              <p className="text-xs font-medium text-destructive">
                {errors.summary.message}
              </p>
            )}
          </div>

          {/* Tags & Thumbnail Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Tags Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="tags"
                className="text-sm font-semibold text-muted-foreground"
              >
                Tags (Comma separated)
              </label>
              <input
                id="tags"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                placeholder="nextjs, react, tailwind"
                disabled={isSubmitting}
                {...register("tags")}
              />
              {errors.tags && (
                <p className="text-xs font-medium text-destructive">
                  {errors.tags.message}
                </p>
              )}
            </div>

            {/* Thumbnail Image upload */}
            <div className="space-y-1.5">
              <label
                htmlFor="thumbnail"
                className="text-sm font-semibold text-muted-foreground"
              >
                Thumbnail Image
              </label>
              <input
                id="thumbnail"
                type="file"
                accept="image/*"
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer transition duration-200 focus:border-primary placeholder:text-muted-foreground/45"
                disabled={isSubmitting}
                {...register("thumbnail")}
              />
              {errors.thumbnail && (
                <p className="text-xs font-medium text-destructive">
                  {(errors.thumbnail.message as string) || "Invalid file."}
                </p>
              )}
            </div>
          </div>

          {/* Tiptap Rich Text Content Editor */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">
              Content
            </label>
            <Controller
              name="content"
              control={control}
              render={({ field }) => (
                <QuillEditor
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.content && (
              <p className="text-xs font-medium text-destructive">
                {errors.content.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50">
            <Link
              href="/dashboard/blogs"
              className="inline-flex h-10 items-center justify-center rounded-lg border border-border bg-background px-5 text-sm font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition duration-200"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-5 text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-98 transition duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Saving...
                </>
              ) : (
                "Save Post"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
