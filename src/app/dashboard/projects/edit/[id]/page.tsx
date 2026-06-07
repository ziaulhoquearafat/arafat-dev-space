"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { ArrowLeft, Loader2 } from "lucide-react";
import { TiptapEditor } from "@/components/editor/TiptapEditor";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "react-hot-toast";

const projectFormSchema = z.object({
  title: z.string().min(1, "Title is required."),
  shortDescription: z.string().min(1, "Short description is required."),
  detailedDescription: z.string().min(1, "Detailed description is required."),
  technologies: z.string().min(1, "At least one technology is required."),
  liveLink: z.string().url("Must be a valid URL").or(z.literal("")),
  githubClient: z.string().url("Must be a valid URL").or(z.literal("")),
  githubServer: z.string().url("Must be a valid URL").or(z.literal("")),
  coverImage: z.any().optional(),
  category: z.string().min(1, "Category is required."),
  featured: z.boolean(),
  status: z.enum(["Completed", "Ongoing"]),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function EditProjectPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [loadingProject, setLoadingProject] = useState(true);
  const [currentCoverImage, setCurrentCoverImage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      title: "",
      shortDescription: "",
      detailedDescription: "",
      technologies: "",
      liveLink: "",
      githubClient: "",
      githubServer: "",
      category: "Full Stack",
      featured: false,
      status: "Completed",
    },
  });

  // Fetch initial project data
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const res = await fetch(`/api/projects/${id}`);
        if (res.ok) {
          const project = await res.json();
          reset({
            title: project.title,
            shortDescription: project.shortDescription,
            detailedDescription: project.detailedDescription,
            technologies: project.technologies ? project.technologies.join(", ") : "",
            liveLink: project.liveLink || "",
            githubClient: project.githubClient || "",
            githubServer: project.githubServer || "",
            category: project.category || "Full Stack",
            featured: !!project.featured,
            status: project.status || "Completed",
          });
          if (project.coverImage) {
            setCurrentCoverImage(project.coverImage);
          }
        } else {
          toast.error("Failed to load project details.");
          router.push("/dashboard/projects");
        }
      } catch (error) {
        console.error("Error loading project:", error);
        toast.error("An error occurred while loading project details.");
      } finally {
        setLoadingProject(false);
      }
    };

    fetchProject();
  }, [id, reset, router]);

  // Entrance GSAP animation
  useGSAP(
    () => {
      if (!loadingProject) {
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
      }
    },
    { scope: containerRef, dependencies: [loadingProject] }
  );

  const onSubmit = async (data: ProjectFormValues) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("shortDescription", data.shortDescription);
      formData.append("detailedDescription", data.detailedDescription);
      formData.append("technologies", data.technologies);
      formData.append("liveLink", data.liveLink || "");
      formData.append("githubClient", data.githubClient || "");
      formData.append("githubServer", data.githubServer || "");
      formData.append("category", data.category);
      formData.append("featured", String(data.featured));
      formData.append("status", data.status);

      // Append new image only if selected
      if (data.coverImage && data.coverImage.length > 0) {
        formData.append("coverImage", data.coverImage[0]);
      }

      const res = await fetch(`/api/projects/${id}`, {
        method: "PUT",
        body: formData,
      });

      const result = await res.json();

      if (res.ok) {
        toast.success("Project updated successfully!");
        router.push("/dashboard/projects");
      } else {
        toast.error(result.error || "Failed to update project.");
      }
    } catch (error) {
      console.error("Error updating project:", error);
      toast.error("An unexpected error occurred while updating the project.");
    }
  };

  if (loadingProject) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Loading project data...
        </p>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="space-y-6 max-w-4xl">
      {/* Back link */}
      <div className="animate-form-item">
        <Link
          href="/dashboard/projects"
          className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to Projects
        </Link>
      </div>

      {/* Page Header */}
      <div className="animate-form-item space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Edit Project
        </h1>
        <p className="text-sm text-muted-foreground">
          Modify the case study details and technology stacks.
        </p>
      </div>

      {/* Main card */}
      <div className="animate-form-item rounded-xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          
          {/* Title, Technologies, Category & Status Grid */}
          <div className="grid gap-6 md:grid-cols-4">
            {/* Title Field */}
            <div className="space-y-1.5">
              <label
                htmlFor="title"
                className="text-sm font-semibold text-muted-foreground"
              >
                Project Title
              </label>
              <input
                id="title"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                placeholder="E-Commerce API Gateway"
                disabled={isSubmitting}
                {...register("title")}
              />
              {errors.title && (
                <p className="text-xs font-medium text-destructive">
                  {errors.title.message}
                </p>
              )}
            </div>

            {/* Technologies Input */}
            <div className="space-y-1.5">
              <label
                htmlFor="technologies"
                className="text-sm font-semibold text-muted-foreground"
              >
                Technologies (Comma separated)
              </label>
              <input
                id="technologies"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                placeholder="nextjs, typescript, graphql, tailwindcss"
                disabled={isSubmitting}
                {...register("technologies")}
              />
              {errors.technologies && (
                <p className="text-xs font-medium text-destructive">
                  {errors.technologies.message}
                </p>
              )}
            </div>

            {/* Category Select Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="category"
                className="text-sm font-semibold text-muted-foreground"
              >
                Category
              </label>
              <select
                id="category"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                disabled={isSubmitting}
                {...register("category")}
              >
                <option value="Frontend">Frontend</option>
                <option value="Full Stack">Full Stack</option>
                <option value="SaaS">SaaS</option>
                <option value="AI Integrations">AI Integrations</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && (
                <p className="text-xs font-medium text-destructive">
                  {errors.category.message}
                </p>
              )}
            </div>

            {/* Project Status Dropdown */}
            <div className="space-y-1.5">
              <label
                htmlFor="status"
                className="text-sm font-semibold text-muted-foreground"
              >
                Project Status
              </label>
              <select
                id="status"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary cursor-pointer"
                disabled={isSubmitting}
                {...register("status")}
              >
                <option value="Completed">Completed</option>
                <option value="Ongoing">Ongoing</option>
              </select>
              {errors.status && (
                <p className="text-xs font-medium text-destructive">
                  {errors.status.message}
                </p>
              )}
            </div>
          </div>

          {/* Short Description */}
          <div className="space-y-1.5">
            <label
              htmlFor="shortDescription"
              className="text-sm font-semibold text-muted-foreground"
            >
              Short Description
            </label>
            <textarea
              id="shortDescription"
              rows={2}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45 resize-none"
              placeholder="Provide a quick summary of what this project does..."
              disabled={isSubmitting}
              {...register("shortDescription")}
            />
            {errors.shortDescription && (
              <p className="text-xs font-medium text-destructive">
                {errors.shortDescription.message}
              </p>
            )}
          </div>

          {/* Repository & Demo Links Grid */}
          <div className="grid gap-6 md:grid-cols-3">
            {/* Live Link */}
            <div className="space-y-1.5">
              <label
                htmlFor="liveLink"
                className="text-sm font-semibold text-muted-foreground"
              >
                Live Link
              </label>
              <input
                id="liveLink"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                placeholder="https://example.com"
                disabled={isSubmitting}
                {...register("liveLink")}
              />
              {errors.liveLink && (
                <p className="text-xs font-medium text-destructive">
                  {errors.liveLink.message}
                </p>
              )}
            </div>

            {/* GitHub Client */}
            <div className="space-y-1.5">
              <label
                htmlFor="githubClient"
                className="text-sm font-semibold text-muted-foreground"
              >
                GitHub Client Link
              </label>
              <input
                id="githubClient"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                placeholder="https://github.com/username/repo-client"
                disabled={isSubmitting}
                {...register("githubClient")}
              />
              {errors.githubClient && (
                <p className="text-xs font-medium text-destructive">
                  {errors.githubClient.message}
                </p>
              )}
            </div>

            {/* GitHub Server */}
            <div className="space-y-1.5">
              <label
                htmlFor="githubServer"
                className="text-sm font-semibold text-muted-foreground"
              >
                GitHub Server Link
              </label>
              <input
                id="githubServer"
                type="text"
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                placeholder="https://github.com/username/repo-server"
                disabled={isSubmitting}
                {...register("githubServer")}
              />
              {errors.githubServer && (
                <p className="text-xs font-medium text-destructive">
                  {errors.githubServer.message}
                </p>
              )}
            </div>
          </div>

          {/* Uploads & Featured Settings */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Cover Image Upload */}
            <div className="space-y-1.5">
              <label
                htmlFor="coverImage"
                className="text-sm font-semibold text-muted-foreground"
              >
                Cover Image
              </label>
              <input
                id="coverImage"
                type="file"
                accept="image/*"
                className="w-full rounded-lg border border-border bg-background px-3 py-1.5 text-sm text-foreground file:mr-4 file:py-1 file:px-3 file:rounded-md file:border-0 file:text-xs file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20 file:cursor-pointer transition duration-200 focus:border-primary placeholder:text-muted-foreground/45"
                disabled={isSubmitting}
                {...register("coverImage")}
              />
              {errors.coverImage && (
                <p className="text-xs font-medium text-destructive">
                  {(errors.coverImage.message as string) || "Invalid file."}
                </p>
              )}
              {currentCoverImage && (
                <div className="mt-1 text-xs text-muted-foreground flex items-center gap-2">
                  <span className="font-semibold text-muted-foreground/70">Current Cover:</span>
                  <a
                    href={currentCoverImage}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline truncate max-w-xs block font-mono"
                  >
                    {currentCoverImage.substring(currentCoverImage.lastIndexOf("/") + 1)}
                  </a>
                </div>
              )}
            </div>

            {/* Featured Setting */}
            <div className="flex items-center space-x-2 pt-8">
              <input
                id="featured"
                type="checkbox"
                className="size-4 rounded border-border text-primary focus:ring-primary bg-background transition duration-200"
                disabled={isSubmitting}
                {...register("featured")}
              />
              <label
                htmlFor="featured"
                className="text-sm font-semibold text-muted-foreground cursor-pointer select-none"
              >
                Featured Project (Highlights on Homepage)
              </label>
            </div>
          </div>

          {/* Tiptap Detailed Description Editor */}
          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-muted-foreground">
              Detailed Case Study (Detailed Description)
            </label>
            <Controller
              name="detailedDescription"
              control={control}
              render={({ field }) => (
                <TiptapEditor
                  content={field.value}
                  onChange={field.onChange}
                />
              )}
            />
            {errors.detailedDescription && (
              <p className="text-xs font-medium text-destructive">
                {errors.detailedDescription.message}
              </p>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50">
            <Link
              href="/dashboard/projects"
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
                  Updating...
                </>
              ) : (
                "Update Project"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
