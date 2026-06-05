"use client";

import React, { useRef } from "react";
import { GraduationCap, Award } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

// Structured data for education and certifications
const EDUCATION_DATA = [
  {
    title: "Complete Web Development Course",
    institution: "Programming Hero",
    year: "2025",
    description: "Mastered MERN stack development, built multiple full-stack projects, and gained hands-on experience in modern web technologies.",
    icon: <Award className="size-5" />,
  },
  {
    title: "BA (Hons) in Arabic Language and Literature",
    institution: "International Islamic University Chittagong",
    year: "2022 - 2026",
    description: "Focused on academic studies alongside developing a strong foundation in self-taught programming.",
    icon: <GraduationCap className="size-5" />,
  },
];

export function Education() {
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP ScrollTrigger timeline and card entry animations
  useGSAP(
    () => {
      // 1. Draw the timeline line from top to bottom on scroll
      gsap.fromTo(
        ".timeline-line",
        { scaleY: 0 },
        {
          scaleY: 1,
          ease: "none",
          scrollTrigger: {
            trigger: containerRef.current,
            start: "top 75%",
            end: "bottom 75%",
            scrub: true,
          },
        }
      );

      // 2. Animate nodes and cards individually as they enter the screen
      const items = gsap.utils.toArray<HTMLElement>(".education-item");
      const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

      items.forEach((item, i) => {
        const card = item.querySelector(".education-card");
        const node = item.querySelector(".timeline-node");
        const isEven = i % 2 === 0;

        // Node scale-up
        gsap.fromTo(
          node,
          { scale: 0, opacity: 0 },
          {
            scale: 1,
            opacity: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );

        // Card slide-in
        gsap.fromTo(
          card,
          {
            opacity: 0,
            x: isMobile ? 40 : (isEven ? -60 : 60),
          },
          {
            opacity: 1,
            x: 0,
            duration: 0.7,
            ease: "power2.out",
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none",
            },
          }
        );
      });
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="education"
      className="py-16 sm:py-24 w-full max-w-5xl mx-auto px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Decorative Glow Blob */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10" />

      {/* Premium Section Title */}
      <div className="text-center mb-16 sm:mb-20">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
          Education & Journey
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
          My academic foundation and formal training achievements.
        </p>
      </div>

      {/* Vertical Timeline container */}
      <div className="relative w-full">
        {/* Timeline Center Line (Dynamic scroll-drawing) */}
        <div className="timeline-line absolute left-6 md:left-1/2 -translate-x-1/2 top-0 bottom-0 w-0.5 bg-border/40 origin-top -z-10" />

        {/* Timeline Items */}
        <div className="relative w-full flex flex-col">
          {EDUCATION_DATA.map((item, index) => {
            const isEven = index % 2 === 0;
            return (
              <div
                key={index}
                className={`education-item relative flex flex-col md:flex-row w-full mb-12 sm:mb-16 last:mb-0 ${
                  isEven ? "md:flex-row-reverse" : ""
                }`}
              >
                {/* Timeline Node */}
                <div className="timeline-node absolute left-6 md:left-1/2 -translate-x-1/2 top-6 md:top-8 z-20 w-10 h-10 rounded-full bg-card border-2 border-primary flex items-center justify-center text-primary shadow-md">
                  {item.icon}
                </div>

                {/* Empty Spacer Column for Desktop */}
                <div className="hidden md:block md:w-1/2" />

                {/* Content Card Column */}
                <div
                  className={`w-full pl-14 pr-4 md:w-1/2 ${
                    isEven ? "md:pl-0 md:pr-12 md:text-right" : "md:pl-12 md:pr-0"
                  }`}
                >
                  <div className="education-card p-6 sm:p-8 bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300">
                    {/* Year Badge */}
                    <div className={`mb-3 ${isEven ? "md:justify-end" : ""} flex`}>
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
                        {item.year}
                      </span>
                    </div>

                    {/* Degree/Course Title */}
                    <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mb-1.5">
                      {item.title}
                    </h3>

                    {/* Institution */}
                    <h4 className="text-sm font-semibold text-primary mb-4">
                      {item.institution}
                    </h4>

                    {/* Description */}
                    <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
