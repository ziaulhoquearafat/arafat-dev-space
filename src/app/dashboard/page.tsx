"use client";

import React, { useRef } from "react";
import { FolderGit2, BookOpen, Users, TrendingUp } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

export default function DashboardOverviewPage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP Entrance stagger animation
  useGSAP(
    () => {
      gsap.fromTo(
        ".animate-dashboard-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
        }
      );
    },
    { scope: containerRef }
  );

  const stats = [
    {
      title: "Total Projects",
      value: "12",
      description: "+2 added this month",
      icon: FolderGit2,
      color: "text-primary",
    },
    {
      title: "Total Blogs",
      value: "8",
      description: "+1 published recently",
      icon: BookOpen,
      color: "text-accent",
    },
    {
      title: "Total Users",
      value: "15",
      description: "+4 registered this week",
      icon: Users,
      color: "text-emerald-500",
    },
  ];

  return (
    <div ref={containerRef} className="space-y-8">
      {/* Header */}
      <div className="space-y-1">
        <h1 className="animate-dashboard-item text-3xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="animate-dashboard-item text-sm text-muted-foreground">
          Welcome back to your workspace.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <div
              key={index}
              className="animate-dashboard-item rounded-xl border border-border/50 bg-card p-6 shadow-sm flex flex-col justify-between h-40"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-lg bg-muted ${stat.color}`}>
                  <Icon className="size-5 shrink-0" />
                </div>
              </div>
              
              <div className="space-y-1">
                <h3 className="text-3xl font-bold text-foreground">
                  {stat.value}
                </h3>
                <p className="text-xs text-muted-foreground flex items-center gap-1">
                  <TrendingUp className="size-3 text-emerald-500" />
                  {stat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder content for modern dashboard feel */}
      <div className="animate-dashboard-item grid gap-6 md:grid-cols-2">
        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm h-64 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">Recent Activity</h4>
            <p className="text-xs text-muted-foreground">Log of actions inside the portal.</p>
          </div>
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/60 border border-dashed border-border/60 rounded-lg mt-4">
            No recent logs to display.
          </div>
        </div>

        <div className="rounded-xl border border-border/50 bg-card p-6 shadow-sm h-64 flex flex-col justify-between">
          <div className="space-y-1">
            <h4 className="text-sm font-semibold text-foreground">Quick Action Checklist</h4>
            <p className="text-xs text-muted-foreground">Review system metrics and content.</p>
          </div>
          <div className="flex-1 flex items-center justify-center text-xs text-muted-foreground/60 border border-dashed border-border/60 rounded-lg mt-4">
            All systems online.
          </div>
        </div>
      </div>
    </div>
  );
}
