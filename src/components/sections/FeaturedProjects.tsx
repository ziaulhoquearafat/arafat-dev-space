"use client";

import { GithubIcon } from "@/components/shared/icons";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ArrowRight, Code, ExternalLink } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

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

export function FeaturedProjects() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [projects, setProjects] = useState<ProjectType[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch projects from the API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          let fetchedProjects: ProjectType[] = [];
          if (Array.isArray(data)) {
            fetchedProjects = data;
          } else if (data && typeof data === "object") {
            fetchedProjects = data.projects || [];
          }

          // Keep only featured projects and limit to the latest 4
          const featuredOnly = fetchedProjects.filter((project) => project.featured);
          setProjects(featuredOnly.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch projects in FeaturedProjects:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // GSAP ScrollTrigger Stacked Cards Animation using CSS Sticky
  useGSAP(
    () => {
      const wrappers = gsap.utils.toArray<HTMLElement>(".card-wrapper");
      if (wrappers.length === 0) return;

      wrappers.forEach((wrapper, i) => {
        // Don't animate the very last card
        if (i === wrappers.length - 1) return;

        const innerCard = wrapper.querySelector(".project-inner-card");

        gsap.to(innerCard, {
          scale: 0.9,
          opacity: 0,
          yPercent: -10, // Moves slightly up as it fades
          ease: "none",
          scrollTrigger: {
            trigger: wrapper,
            start: "top top", // When this wrapper hits the top
            end: "bottom top", // When the NEXT wrapper hits the top
            scrub: true, // Tied perfectly to scroll bar
          },
        });
      });
    },
    { scope: containerRef, dependencies: [projects, isLoading] },
  );

  return (
    <section
      ref={containerRef}
      id="featured-projects"
      className="relative w-full"
    >
      {/* Absolute Section Header */}
      <div className="absolute top-6 left-0 right-0 z-50 text-center pointer-events-none px-4">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(235,94,40,0.3)] mb-4">
          Featured Projects
        </h2>
      </div>

      {/* Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/10 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/10 w-80 h-80 bg-accent/5 rounded-full blur-3xl -z-10" />

      {/* Dynamic Content */}
      {isLoading ? (
        /* Loading Skeleton Card */
        <div className="h-screen w-full flex items-center justify-center p-4 md:p-10 pt-16">
          <div className="w-full max-w-6xl h-[80vh] bg-card/60 backdrop-blur-md border border-border/40 rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-pulse">
            <div className="w-full md:w-1/2 h-48 sm:h-64 md:h-full bg-muted" />
            <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-center space-y-4">
              <div className="h-6 w-24 bg-muted rounded-full" />
              <div className="h-8 w-2/3 bg-muted rounded-md" />
              <div className="space-y-2">
                <div className="h-4 w-full bg-muted rounded-md" />
                <div className="h-4 w-5/6 bg-muted rounded-md" />
              </div>
              <div className="flex gap-2">
                <div className="h-6 w-16 bg-muted rounded-full" />
                <div className="h-6 w-16 bg-muted rounded-full" />
              </div>
              <div className="flex gap-3 pt-2">
                <div className="h-10 w-28 bg-muted rounded-xl" />
                <div className="h-10 w-28 bg-muted rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      ) : projects.length === 0 ? (
        /* Empty State */
        <div className="h-screen w-full flex items-center justify-center p-4">
          <div className="text-center py-20 px-10 border border-border/40 rounded-3xl bg-card/60 backdrop-blur-md max-w-lg w-full">
            <p className="text-muted-foreground font-medium text-lg">
              No featured projects available yet.
            </p>
          </div>
        </div>
      ) : (
        /* Stacked Cards Stack using CSS Sticky */
        <div className="w-full">
          {projects.map((project, index) => {
            return (
              <div
                key={project._id}
                className="card-wrapper sticky top-0 h-screen w-full flex items-center justify-center p-4 md:p-10"
                style={{ zIndex: index + 1 }}
              >
                {/* Visual Glassmorphic Border Card */}
                <div
                  className={`project-inner-card relative w-full max-w-6xl h-[80vh] bg-card border border-border/50 rounded-3xl shadow-2xl flex flex-col overflow-hidden ${
                    index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
                  }`}
                >
                  {/* Left Side: Cover Image */}
                  <div className="relative w-full md:w-1/2 h-44 sm:h-60 md:h-full flex-shrink-0 bg-muted">
                    {/* Status Badge */}
                    <div className="absolute top-4 left-4 z-20">
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold shadow-lg border ${
                          project.status === "ongoing"
                            ? "border-amber-500/30 text-amber-500"
                            : "border-emerald-500/30 text-emerald-500"
                        } bg-background/80 backdrop-blur-md`}
                      >
                        <span
                          className={`w-2 h-2 rounded-full ${
                            project.status === "ongoing"
                              ? "bg-amber-500 animate-pulse"
                              : "bg-emerald-500"
                          }`}
                        ></span>
                        {project.status === "ongoing" ? "Ongoing" : "Completed"}
                      </span>
                    </div>

                    {project.coverImage ? (
                      <Image
                        src={project.coverImage}
                        alt={project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 hover:scale-102"
                        priority={index === 0}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        No Image Available
                      </div>
                    )}
                  </div>

                  {/* Right Side: Details */}
                  <div className="w-full md:w-1/2 p-6 sm:p-8 md:p-12 flex flex-col justify-between space-y-4 overflow-y-auto">
                    <div className="space-y-4">
                      {/* Badge */}
                      <div>
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                          {project.category || "Full Stack"}
                        </span>
                      </div>

                      {/* Title */}
                      <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                        {project.title}
                      </h3>

                      {/* Description */}
                      <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                        {project.shortDescription}
                      </p>

                      {/* Technology Pills */}
                      <div className="flex flex-wrap gap-2 pt-1">
                        {project.technologies.slice(0, 6).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground"
                          >
                            <Code className="size-3" />
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 6 && (
                          <span className="text-xs text-muted-foreground self-center font-medium pl-1">
                            +{project.technologies.length - 6} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Actions Row */}
                    <div className="flex flex-wrap items-center justify-between gap-4 pt-4 border-t border-border/20">
                      <div className="flex flex-wrap gap-3">
                        {project.liveLink && (
                          <a
                            href={project.liveLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold text-xs shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer"
                          >
                            <ExternalLink className="size-3.5" />
                            Live Preview
                          </a>
                        )}
                        {project.githubClient && (
                          <a
                            href={project.githubClient}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-border/60 bg-card/60 backdrop-blur-md text-muted-foreground hover:text-foreground hover:border-border font-semibold text-xs shadow-sm hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer"
                          >
                            <GithubIcon className="size-3.5" />
                            GitHub
                          </a>
                        )}
                      </div>

                      {/* Details Link */}
                      <Link
                        href={`/projects/${project._id}`}
                        className="inline-flex items-center justify-center gap-1 text-xs font-bold text-primary hover:text-accent transition-colors"
                      >
                        Full Details
                        <ArrowRight className="size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}
