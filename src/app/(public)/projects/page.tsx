"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, ArrowRight, Code } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface ProjectType {
  _id: string;
  title: string;
  shortDescription: string;
  detailedDescription: string;
  technologies: string[];
  liveLink?: string;
  githubClient?: string;
  githubServer?: string;
  coverImage: string;
  category: string;
  featured: boolean;
  status?: "completed" | "ongoing";
}

const CATEGORIES = ["All", "Frontend", "Full Stack", "SaaS", "AI Integrations"];

export default function PublicProjectsPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState("All");

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          // Critical data parsing check
          if (Array.isArray(data)) {
            setProjects(data);
          } else if (data && typeof data === "object") {
            setProjects(data.projects || []);
          } else {
            setProjects([]);
          }
        } else {
          setProjects([]);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
        setProjects([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // Bulletproof filtering logic with category fallback for legacy entries
  const filteredProjects = activeCategory === "All"
    ? projects
    : projects.filter((p) => (p.category || "Full Stack") === activeCategory);

  // Entrance & Filter change animation using GSAP
  useGSAP(
    () => {
      if (!isLoading && filteredProjects.length > 0) {
        gsap.fromTo(
          ".project-card",
          { opacity: 0, y: 30, scale: 0.95 },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.6,
            stagger: 0.08,
            ease: "power2.out",
            clearProps: "transform",
          }
        );
      }
    },
    { scope: containerRef, dependencies: [activeCategory, isLoading] }
  );

  return (
    <div ref={containerRef} className="min-h-screen py-16 px-4 sm:px-6 lg:px-8 bg-background">
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

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          {CATEGORIES.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-sm font-semibold rounded-full border transition-all duration-300 cursor-pointer ${
                  isActive
                    ? "bg-primary text-white border-primary shadow-md scale-105"
                    : "bg-card border-border/60 text-muted-foreground hover:text-foreground hover:border-border"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* Dynamic States */}
        {isLoading ? (
          /* Pulsating Skeleton Grid mimicking real cards */
          <div className="grid gap-8 md:grid-cols-2">
            {[1, 2, 3, 4].map((num) => (
              <div
                key={num}
                className="overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm p-0 space-y-4 animate-pulse"
              >
                <div className="aspect-video w-full bg-muted" />
                <div className="p-6 space-y-4">
                  <div className="h-6 w-2/3 bg-muted rounded-md" />
                  <div className="space-y-2">
                    <div className="h-4 w-full bg-muted rounded-md" />
                    <div className="h-4 w-5/6 bg-muted rounded-md" />
                  </div>
                  <div className="flex gap-2 pt-2">
                    <div className="h-6 w-16 bg-muted rounded-full" />
                    <div className="h-6 w-16 bg-muted rounded-full" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : filteredProjects.length === 0 ? (
          /* Centered Sleek Empty State */
          <div className="text-center py-20 border border-border/50 rounded-2xl bg-card">
            <p className="text-muted-foreground font-medium text-lg">No projects found.</p>
          </div>
        ) : (
          /* Projects Grid */
          <div className="grid gap-8 md:grid-cols-2">
            {filteredProjects.map((project) => (
              <div
                key={project._id}
                className="project-card group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md hover:border-border opacity-0"
              >
                <div>
                  {/* Cover Image */}
                  <div className="aspect-video relative overflow-hidden bg-muted">
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-lg border ${
                        project.status === "ongoing"
                          ? "border-amber-500/30 text-amber-500"
                          : "border-emerald-500/30 text-emerald-500"
                      } bg-background/80 backdrop-blur-md`}>
                        <span className={`w-2 h-2 rounded-full ${
                          project.status === "ongoing" ? "bg-amber-500 animate-pulse" : "bg-emerald-500"
                        }`}></span>
                        {project.status === "ongoing" ? "Ongoing" : "Completed"}
                      </span>
                    </div>

                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-103"
                        priority
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image Available
                      </div>
                    )}
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-xl font-bold tracking-tight text-foreground truncate">
                          {project.title}
                        </h3>
                        <div className="flex gap-1.5 flex-shrink-0">
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-muted text-muted-foreground border border-border/60">
                            {project.category || "Full Stack"}
                          </span>
                          {project.featured && (
                            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-primary/10 text-primary border border-primary/20">
                              Featured
                            </span>
                          )}
                        </div>
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
                        title="GitHub Repository"
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
