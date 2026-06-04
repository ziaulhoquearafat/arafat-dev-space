"use client";

import React, { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { Plus, Edit, Trash2, ExternalLink, Code, Loader2, FolderKanban } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Swal from "sweetalert2";
import { toast } from "react-hot-toast";

interface Project {
  _id: string;
  title: string;
  shortDescription: string;
  technologies: string[];
  liveLink?: string;
  coverImage: string;
}

export default function ProjectsDashboardPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch projects from API
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch("/api/projects");
        if (res.ok) {
          const data = await res.json();
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProjects();
  }, []);

  // GSAP animation
  useGSAP(
    () => {
      if (!loading) {
        gsap.fromTo(
          ".animate-project-list-item",
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
          const res = await fetch(`/api/projects/${id}`, {
            method: "DELETE",
          });
          if (res.ok) {
            setProjects(projects.filter((project) => project._id !== id));
            toast.success("Deleted successfully!");
          } else {
            const errorData = await res.json().catch(() => ({}));
            toast.error(errorData.error || "Failed to delete project.");
          }
        } catch (error) {
          console.error("Error deleting project:", error);
          toast.error("An unexpected error occurred. Please try again.");
        }
      }
    });
  };

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Header with Create Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="animate-project-list-item space-y-1">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Projects
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage your engineering projects and case studies.
          </p>
        </div>
        
        <div className="animate-project-list-item">
          <Link
            href="/dashboard/projects/create"
            className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-4 text-sm font-semibold text-white shadow-md hover:opacity-90 hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <Plus className="size-4" />
            Add Project
          </Link>
        </div>
      </div>

      {/* Projects List Card */}
      <div className="animate-project-list-item rounded-xl border border-border/50 bg-card p-6 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium">
              Loading projects...
            </p>
          </div>
        ) : projects.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="p-4 bg-muted rounded-full text-muted-foreground/60">
              <FolderKanban className="size-10" />
            </div>
            <div className="space-y-1 max-w-xs">
              <h3 className="text-sm font-semibold text-foreground">No projects uploaded</h3>
              <p className="text-xs text-muted-foreground leading-normal">
                Add projects to showcase on your public portfolio page.
              </p>
            </div>
            <Link
              href="/dashboard/projects/create"
              className="inline-flex h-9 items-center justify-center rounded-lg border border-border bg-background px-4 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition-all duration-200"
            >
              Add First Project
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Project</th>
                  <th className="py-3 px-4">Technologies</th>
                  <th className="py-3 px-4">Links</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {projects.map((project) => (
                  <tr
                    key={project._id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-4 font-semibold text-foreground max-w-sm truncate">
                      <div className="flex items-center gap-3">
                        <div className="size-10 rounded bg-muted overflow-hidden border border-border flex-shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={project.coverImage}
                            alt={project.title}
                            className="object-cover w-full h-full"
                          />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground leading-snug">{project.title}</div>
                          <div className="text-xs text-muted-foreground font-normal line-clamp-1">{project.shortDescription}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground/80 max-w-xs">
                      <div className="flex flex-wrap gap-1">
                        {project.technologies.slice(0, 3).map((tech) => (
                          <span
                            key={tech}
                            className="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-muted text-muted-foreground border border-border/40"
                          >
                            <Code className="size-2.5" />
                            {tech}
                          </span>
                        ))}
                        {project.technologies.length > 3 && (
                          <span className="text-[10px] text-muted-foreground font-medium self-center">
                            +{project.technologies.length - 3}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground/80">
                      {project.liveLink ? (
                        <a
                          href={project.liveLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-primary hover:underline"
                        >
                          Live Link
                          <ExternalLink className="size-3" />
                        </a>
                      ) : (
                        <span className="text-xs text-muted-foreground font-medium">-</span>
                      )}
                    </td>
                    <td className="py-4 px-4 text-right space-x-2 whitespace-nowrap">
                      <Link
                        href={`/dashboard/projects/edit/${project._id}`}
                        className="inline-flex p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-primary transition-all duration-200 cursor-pointer"
                        title="Edit Project"
                      >
                        <Edit className="size-4" />
                      </Link>
                      
                      <button
                        onClick={() => handleDelete(project._id)}
                        className="inline-flex p-1.5 rounded-md hover:bg-muted text-muted-foreground hover:text-destructive transition-all duration-200 cursor-pointer"
                        title="Delete Project"
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
