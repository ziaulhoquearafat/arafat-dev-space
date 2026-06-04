"use client";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { Download } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect width="4" height="12" x="2" y="9" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Staggered entrance animation for text contents and CTA buttons
      gsap.fromTo(
        ".animate-hero-item",
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.2,
          stagger: 0.2,
          ease: "power4.out",
        },
      );

      // Infinite floating animation for the profile image wrapper
      gsap.fromTo(
        imageRef.current,
        { y: -15 },
        {
          y: 15,
          duration: 3,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        },
      );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
    >
      {/* Background decoration elements */}
      <div className="absolute top-1/4 left-10 -z-10 size-72 rounded-full bg-primary/10 blur-3xl" />
      <div className="absolute bottom-1/4 right-10 -z-10 size-72 rounded-full bg-accent/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-2">
        {/* Left Column: Text Content */}
        <div className="flex flex-col justify-center text-center md:text-left space-y-6">
          <p className="animate-hero-item text-lg font-bold tracking-wider text-primary uppercase">
            {"Hi there, I'm"}
          </p>

          <h1 className="animate-hero-item text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
            <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Md Ziaul Hoque Arafat
            </span>
          </h1>

          <h2 className="animate-hero-item text-2xl font-bold text-foreground sm:text-3xl">
            Full-Stack Web Developer
          </h2>

          <p className="animate-hero-item max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
            I build fast, scalable, and responsive web applications using the
            MERN stack and Next.js. I leverage AI-assisted coding and advanced
            prompt engineering to deliver high-quality, optimized solutions at
            production speed.
          </p>

          {/* Call to Actions */}
          <div className="animate-hero-item flex flex-wrap items-center justify-center md:justify-start gap-4 pt-4">
            <a
              href="/resume.pdf"
              download
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-primary to-accent px-6 text-sm font-semibold text-white shadow-md hover:opacity-90 hover:shadow-lg hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <Download className="size-4" />
              Download Resume
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center justify-center gap-2 rounded-full border border-border bg-background px-6 text-sm font-semibold text-muted-foreground hover:border-primary hover:text-primary hover:scale-105 active:scale-95 transition-all duration-300"
            >
              <LinkedInIcon className="size-4" />
              LinkedIn
            </a>
          </div>
        </div>

        {/* Right Column: Image and Glowing Blob */}
        <div className="flex items-center justify-center">
          <div ref={imageRef} className="relative group">
            {/* Glowing background blob matching custom colors */}
            <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary to-accent opacity-20 blur-3xl group-hover:opacity-30 transition duration-1000 animate-pulse" />

            {/* Styled border container */}
            <div className="relative flex size-64 sm:size-80 items-center justify-center rounded-full border-4 border-double border-primary/30 bg-card p-3 shadow-2xl overflow-hidden">
              <Image
                src="/image/ProfilePicture.png"
                alt="Md Ziaul Hoque Arafat Profile"
                width={300}
                height={300}
                priority
                className="h-full w-full rounded-full object-cover grayscale-25 group-hover:grayscale-0 transition-all duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
