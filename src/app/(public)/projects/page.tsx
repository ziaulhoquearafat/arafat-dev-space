import React from "react";
import Link from "next/link";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { ExternalLink, ArrowRight, Code } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";

export const revalidate = 0; // Dynamic rendering for latest data

export default async function PublicProjectsPage() {
  await dbConnect();
  const projects = await Project.find({}).sort({ createdAt: -1 });

  return (
    <div className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-5xl mx-auto space-y-12">
        {/* Header */}
        <div className="space-y-4 text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            My Projects
          </h1>
          <p className="max-w-2xl mx-auto text-lg text-muted-foreground">
            A showcase of my recent engineering work, applications, and open-source contributions.
          </p>
        </div>

        {/* Projects Grid */}
        {projects.length === 0 ? (
          <div className="text-center py-20 border border-border/50 rounded-2xl bg-card">
            <p className="text-muted-foreground font-medium">No projects found.</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2">
            {projects.map((project) => (
              <div
                key={project._id.toString()}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-border"
              >
                <div>
                  {/* Cover Image */}
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={project.coverImage}
                      alt={project.title}
                      className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="text-xl font-bold tracking-tight text-foreground">
                          {project.title}
                        </h3>
                        {project.featured && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                            Featured
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground line-clamp-3">
                        {project.shortDescription}
                      </p>
                    </div>

                    {/* Technologies */}
                    <div className="flex flex-wrap gap-1.5 pt-2">
                      {project.technologies.slice(0, 5).map((tech: string) => (
                        <span
                          key={tech}
                          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                        >
                          <Code className="size-3" />
                          {tech}
                        </span>
                      ))}
                      {project.technologies.length > 5 && (
                        <span className="text-xs text-muted-foreground self-center font-medium pl-1">
                          +{project.technologies.length - 5} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div className="p-6 pt-0 flex items-center justify-between border-t border-border/40 mt-4">
                  <Link
                    href={`/projects/${project._id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:text-primary/80 transition-colors"
                  >
                    View Details
                    <ArrowRight className="size-3.5" />
                  </Link>

                  <div className="flex items-center gap-3">
                    {project.githubClient && (
                      <a
                        href={project.githubClient}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                        title="GitHub Client Repository"
                      >
                        <GithubIcon className="size-4.5" />
                      </a>
                    )}
                    {project.liveLink && (
                      <a
                        href={project.liveLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-foreground transition-all duration-200"
                        title="Live Preview"
                      >
                        <ExternalLink className="size-4.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
