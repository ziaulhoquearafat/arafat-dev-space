import React from "react";
import Link from "next/link";
import { GithubIcon, LinkedinIcon } from "@/components/shared/icons";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border/40 bg-card/30 backdrop-blur-md py-12 px-4 sm:px-6 lg:px-8 mt-auto">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Footer Top Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start justify-between">
          
          {/* Brand Info */}
          <div className="space-y-3 md:max-w-xs">
            <h3 className="text-lg font-bold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Md Ziaul Hoque Arafat
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Full-Stack Developer focused on building high-performance web applications and SaaS solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3 md:text-center">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Quick Links
            </h4>
            <ul className="flex flex-col md:flex-row md:justify-center gap-2 md:gap-6 text-sm">
              <li>
                <Link
                  href="/"
                  className="text-muted-foreground hover:text-accent transition-colors duration-200"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/projects"
                  className="text-muted-foreground hover:text-accent transition-colors duration-200"
                >
                  Projects
                </Link>
              </li>
              <li>
                <Link
                  href="/blogs"
                  className="text-muted-foreground hover:text-accent transition-colors duration-200"
                >
                  Blogs
                </Link>
              </li>
            </ul>
          </div>

          {/* Socials Column */}
          <div className="space-y-3 md:text-right flex flex-col md:items-end">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-foreground">
              Connect
            </h4>
            <div className="flex items-center gap-4">
              <a
                href="https://github.com/ziaulhoquearafat"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Profile"
                className="p-2 rounded-lg border border-border/30 bg-background/50 hover:bg-background hover:text-primary hover:border-primary/30 transition-all duration-200"
              >
                <GithubIcon className="size-4.5" />
              </a>
              <a
                href="https://www.linkedin.com/in/ziaul-hoque-arafat/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                className="p-2 rounded-lg border border-border/30 bg-background/50 hover:bg-background hover:text-primary hover:border-primary/30 transition-all duration-200"
              >
                <LinkedinIcon className="size-4.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Footer Bottom Content (Copyright) */}
        <div className="border-t border-border/20 pt-6 flex flex-col sm:flex-row items-center justify-between text-center sm:text-left gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {currentYear} Arafat. All rights reserved.
          </p>
          <p className="text-2xs text-muted-foreground/40">
            Designed & Built with Next.js & Tailwind CSS
          </p>
        </div>

      </div>
    </footer>
  );
}
