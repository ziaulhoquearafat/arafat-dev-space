import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { ArrowLeft, ExternalLink, Code, Globe, Layers } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";

export const revalidate = 0; // Dynamic rendering for latest data

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PublicProjectDetailPage({ params }: Props) {
  const { id } = await params;

  await dbConnect();
  
  // Find project by ID
  let project;
  try {
    project = await Project.findById(id);
  } catch (error) {
    console.error("Invalid project ID format:", error);
    notFound();
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Back Link */}
        <div>
          <Link
            href="/projects"
            className="inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="size-4" />
            Back to Projects
          </Link>
        </div>

        {/* Project Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 pb-6 border-b border-border/40">
          <div className="space-y-2">
            <div className="flex items-center gap-3">
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-foreground">
                {project.title}
              </h1>
              {project.featured && (
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                  Featured
                </span>
              )}
            </div>
            <p className="text-muted-foreground text-lg max-w-2xl">
              {project.shortDescription}
            </p>
          </div>

          {/* Action Links */}
          <div className="flex flex-wrap gap-3">
            {project.liveLink && (
              <a
                href={project.liveLink}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 text-sm font-semibold text-white shadow-md hover:opacity-90 transition-all duration-200"
              >
                <Globe className="size-4" />
                Live Demo
                <ExternalLink className="size-3.5" />
              </a>
            )}
            {project.githubClient && (
              <a
                href={project.githubClient}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm hover:bg-muted transition-all duration-200"
              >
                <GithubIcon className="size-4" />
                GitHub Client
              </a>
            )}
            {project.githubServer && (
              <a
                href={project.githubServer}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-semibold text-foreground shadow-sm hover:bg-muted transition-all duration-200"
              >
                <GithubIcon className="size-4" />
                GitHub Server
              </a>
            )}
          </div>
        </div>

        {/* Project Layout Split */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Details (2 cols) */}
          <div className="md:col-span-2 space-y-8">
            {/* Cover Image */}
            <div className="aspect-video w-full overflow-hidden rounded-2xl border border-border/40 shadow-sm">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.coverImage}
                alt={project.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Detailed Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Layers className="size-5 text-primary" />
                Project Description
              </h2>
              <div 
                className="prose prose-stone dark:prose-invert max-w-none text-foreground/90 leading-relaxed space-y-4"
                dangerouslySetInnerHTML={{ __html: project.detailedDescription }}
              />
            </div>
          </div>

          {/* Sidebar Tech Specs (1 col) */}
          <div className="space-y-6">
            {/* Tech Stack */}
            <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-4">
              <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-border/40">
                <Code className="size-4 text-primary" />
                Technologies
              </h3>
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech: string) => (
                  <span
                    key={tech}
                    className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>

            {/* Gallery Images (if any) */}
            {project.galleryImages && project.galleryImages.length > 0 && (
              <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-4">
                <h3 className="text-sm font-bold text-foreground uppercase tracking-wider pb-3 border-b border-border/40">
                  Project Gallery
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {project.galleryImages.map((img: string, idx: number) => (
                    <div key={idx} className="aspect-square rounded-lg overflow-hidden border border-border bg-muted">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={img}
                        alt={`${project.title} screenshot ${idx + 1}`}
                        className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
