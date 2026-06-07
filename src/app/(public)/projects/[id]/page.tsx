/* eslint-disable @typescript-eslint/no-unused-vars */
import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { ArrowLeft, ExternalLink, Code, Globe, Layers } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

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

        {/* Full-Width Cover Image Container */}
        <div className="w-full overflow-hidden rounded-2xl border border-border/40 bg-muted/10 shadow-sm flex items-center justify-center p-4 sm:p-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={project.coverImage}
            alt={project.title}
            className="max-h-[60vh] md:max-h-[70vh] w-auto max-w-full object-contain rounded-xl shadow-lg border border-border/20"
          />
        </div>

        {/* Technologies Box (Full-Width Sibling below Image) */}
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm space-y-4 w-full">
          <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2 pb-3 border-b border-border/40">
            <Code className="size-4 text-primary" />
            Technologies
          </h3>
          <div className="flex flex-wrap gap-2.5">
            {project.technologies.map((tech: string) => (
              <span
                key={tech}
                className="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-semibold bg-muted text-muted-foreground border border-border hover:bg-muted/70 transition-colors"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Project Details Description & Gallery Split */}
        <div className="grid gap-8 md:grid-cols-3">
          {/* Main Details (2 cols or 3 cols if no gallery) */}
          <div className={project.galleryImages && project.galleryImages.length > 0 ? "md:col-span-2 space-y-8" : "md:col-span-3 space-y-8"}>
            {/* Detailed Description */}
            <div className="space-y-4">
              <h2 className="text-xl font-bold tracking-tight text-foreground flex items-center gap-2">
                <Layers className="size-5 text-primary" />
                Project Description
              </h2>
              <div className="prose prose-stone dark:prose-invert max-w-none text-foreground/90 leading-relaxed">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    h1: ({ node: _, ...props }) => <h1 className="text-2xl font-bold text-foreground mt-6 mb-3 border-b border-border/40 pb-1" {...props} />,
                    h2: ({ node: _, ...props }) => <h2 className="text-xl font-semibold text-foreground mt-5 mb-2.5 pb-0.5 border-b border-border/20" {...props} />,
                    h3: ({ node: _, ...props }) => <h3 className="text-lg font-semibold text-foreground mt-4 mb-2" {...props} />,
                    p: ({ node: _, ...props }) => <p className="text-muted-foreground text-sm sm:text-base leading-relaxed mb-4" {...props} />,
                    ul: ({ node: _, ...props }) => <ul className="list-disc list-inside space-y-2 mb-4 pl-4 text-muted-foreground text-sm sm:text-base" {...props} />,
                    ol: ({ node: _, ...props }) => <ol className="list-decimal list-inside space-y-2 mb-4 pl-4 text-muted-foreground text-sm sm:text-base" {...props} />,
                    li: ({ node: _, ...props }) => <li className="marker:text-primary" {...props} />,
                    a: ({ node: _, ...props }) => <a className="text-primary hover:text-accent underline underline-offset-4 font-medium transition-colors" target="_blank" rel="noopener noreferrer" {...props} />,
                    blockquote: ({ node: _, ...props }) => <blockquote className="border-l-4 border-primary/40 pl-4 py-2 italic my-4 bg-muted/30 rounded-r-lg text-muted-foreground" {...props} />,
                    code: ({ node: _, inline, className, children, ...props }: { node?: unknown; inline?: boolean; className?: string; children?: React.ReactNode }) => {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline ? (
                        <div className="relative my-4 overflow-hidden rounded-xl border border-border/50 bg-neutral-900 dark:bg-black/40 text-neutral-200">
                          {match && (
                            <div className="flex items-center justify-between border-b border-white/5 bg-white/5 px-4 py-1.5 font-mono text-[10px] text-neutral-400">
                              <span>{match[1]}</span>
                            </div>
                          )}
                          <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed">
                            <code {...props} className={className}>
                              {children}
                            </code>
                          </pre>
                        </div>
                      ) : (
                        <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs text-primary font-medium" {...props}>
                          {children}
                        </code>
                      );
                    },
                    table: ({ node: _, ...props }) => (
                      <div className="overflow-x-auto my-6 rounded-lg border border-border/40">
                        <table className="w-full text-left border-collapse text-sm" {...props} />
                      </div>
                    ),
                    thead: ({ node: _, ...props }) => <thead className="bg-muted text-foreground font-semibold border-b border-border/40" {...props} />,
                    tbody: ({ node: _, ...props }) => <tbody className="divide-y divide-border/20" {...props} />,
                    tr: ({ node: _, ...props }) => <tr className="hover:bg-muted/10 transition-colors" {...props} />,
                    th: ({ node: _, ...props }) => <th className="px-4 py-3 border-r border-border/20 last:border-r-0" {...props} />,
                    td: ({ node: _, ...props }) => <td className="px-4 py-3 text-muted-foreground border-r border-border/20 last:border-r-0" {...props} />,
                  }}
                >
                  {project.detailedDescription}
                </ReactMarkdown>
              </div>
            </div>
          </div>

          {/* Sidebar Gallery Images (1 col) */}
          {project.galleryImages && project.galleryImages.length > 0 && (
            <div className="space-y-6">
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
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
