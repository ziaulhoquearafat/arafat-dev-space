"use client";

import React, { useRef, useState } from "react";
import { Database, Terminal, Sparkles, Layers } from "lucide-react";
import { GithubIcon } from "@/components/shared/icons";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Brand Icon Components
const NextjsIcon = () => (
  <svg viewBox="0 0 180 180" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 text-foreground fill-current">
    <mask id="mask-next" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <circle cx="90" cy="90" r="90" fill="black" />
    </mask>
    <g mask="url(#mask-next)">
      <circle cx="90" cy="90" r="90" fill="currentColor" fillOpacity="0.05" />
      <path d="M149.508 157.52L69.142 54H54V126H67.925V74.453L138.835 166.425C142.664 163.766 146.237 160.778 149.508 157.52Z" fill="currentColor" />
      <rect x="115" y="54" width="14" height="72" fill="currentColor" />
    </g>
  </svg>
);

const ReactIcon = () => (
  <svg viewBox="-11.5 -10.23174 23 20.46348" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 text-[#61DAFB] fill-none stroke-current">
    <circle cx="0" cy="0" r="2.05" fill="currentColor" stroke="none" />
    <g strokeWidth="1">
      <ellipse rx="11" ry="4.2" />
      <ellipse rx="11" ry="4.2" transform="rotate(60)" />
      <ellipse rx="11" ry="4.2" transform="rotate(120)" />
    </g>
  </svg>
);

const TypeScriptIcon = () => (
  <div className="size-6 bg-[#3178C6] text-white flex items-center justify-center font-bold text-[10px] rounded-sm select-none">TS</div>
);

const TailwindIcon = () => (
  <svg viewBox="0 0 24 24" className="size-6 text-[#38bdf8] fill-current">
    <path d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.7 1.2 1.2 2.6 2.7 5.5 2.7 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.7-1.2-1.2-2.6-2.7-5.5-2.7zM6.001 12c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.9.2 1.6.9 2.3 1.7 1.2 1.2 2.6 2.7 5.5 2.7 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.9-.2-1.6-.9-2.3-1.7-1.2-1.2-2.6-2.7-5.5-2.7z" />
  </svg>
);

const JavaScriptIcon = () => (
  <div className="size-6 bg-[#F7DF1E] text-black flex items-end justify-end p-0.5 font-bold text-[10px] rounded-sm select-none leading-none">JS</div>
);

const HtmlIcon = () => (
  <svg viewBox="0 0 24 24" className="size-6 text-[#E34F26] fill-current">
    <path d="M1.5 0h21l-1.91 21.563L12 24l-8.59-2.438L1.5 0zm17.063 6h-11.25l.235 2.625h10.782l-.47 5.25L12 15.313l-5.91-.788-.117-1.313H3.348l.254 2.85 8.398 2.378 8.398-2.378 1.055-11.85.11-.225z" />
  </svg>
);

const NodeIcon = () => (
  <svg viewBox="0 0 24 24" className="size-6 text-[#339933] fill-current">
    <path d="M12 2L2 7.8v10.4L12 24l10-5.8V7.8L12 2zm-1 18.2l-6.8-3.9V8.6L11 4.7v15.5zm8.8-3.9l-6.8 3.9V4.7l6.8 3.9v7.7z" />
  </svg>
);

const ExpressIcon = () => (
  <div className="size-6 border border-foreground/30 text-foreground flex items-center justify-center font-bold text-[9px] rounded-sm select-none bg-muted/40">Ex</div>
);

const MongoIcon = () => (
  <svg viewBox="0 0 24 24" className="size-6 text-[#47A248] fill-current">
    <path d="M12 0C8 5.7 6.3 9.4 6.3 12.3c0 4.1 3 6.9 5.7 6.9 2.7 0 5.7-2.8 5.7-6.9C17.7 9.4 16 5.7 12 0zm0 17.6c-1.8 0-3.9-1.9-3.9-4.7 0-2.3 1.3-5.2 3.9-9.1 2.6 3.9 3.9 6.8 3.9 9.1.1 2.8-2 4.7-3.9 4.7z" />
  </svg>
);

const DockerIcon = () => (
  <svg viewBox="0 0 24 24" className="size-6 text-[#2496ED] fill-current">
    <path d="M13.983 8.871h-1.966V6.905h1.966v1.966zm-2.458 0H9.559V6.905h1.966v1.966zm0-2.458H9.559V4.447h1.966v1.966zm-2.458 2.458H7.1v-1.966h1.966v1.966zm0-2.458H7.1V4.447h1.966v1.966zm-2.458 2.458H4.643v-1.966h1.965v1.966zm2.458-4.915H9.559V1.99h1.966v1.965zm-2.458 2.457H7.1V1.99h1.966v1.965zm-2.458 2.458H4.643V4.447h1.965v1.966zm-2.458 2.458H2.185v-1.966h1.965v1.966zM22.5 13.5c0-1.8-1.5-2.2-2.5-2.2h-.5c-.2 0-.4-.1-.5-.2C18 9 15.5 8 12.8 8v3.5h-1.9V8c-2.7 0-5.2 1-6.2 3.1-.1.1-.3.2-.5.2h-.5c-1 0-2.5.4-2.5 2.2 0 1.8 1.5 2.5 2.5 2.5h15.6c1-.1 2.5-.8 2.5-2.5z" />
  </svg>
);

// Structured data for technologies
const TECH_STACK_DATA = {
  Frontend: [
    { name: "Next.js", icon: <NextjsIcon /> },
    { name: "React", icon: <ReactIcon /> },
    { name: "TypeScript", icon: <TypeScriptIcon /> },
    { name: "Tailwind CSS", icon: <TailwindIcon /> },
    { name: "JavaScript", icon: <JavaScriptIcon /> },
    { name: "HTML5/CSS3", icon: <HtmlIcon /> },
  ],
  Backend: [
    { name: "Node.js", icon: <NodeIcon /> },
    { name: "Express.js", icon: <ExpressIcon /> },
    { name: "REST APIs", icon: <Layers className="size-6 text-orange-500" /> },
  ],
  Database: [
    { name: "MongoDB", icon: <MongoIcon /> },
    { name: "PostgreSQL", icon: <Database className="size-6 text-[#4169E1]" /> },
  ],
  "Tools & AI": [
    { name: "Cursor (AI Editor)", icon: <Terminal className="size-6 text-purple-400" /> },
    { name: "Advanced Prompt Engineering", icon: <Sparkles className="size-6 text-violet-500 animate-pulse" /> },
    { name: "Git/GitHub", icon: <GithubIcon className="size-6 text-foreground" /> },
    { name: "Linux/Docker", icon: <DockerIcon /> },
  ],
};

type TabKeys = keyof typeof TECH_STACK_DATA;

export function TechStack() {
  const [activeTab, setActiveTab] = useState<TabKeys>("Frontend");
  const containerRef = useRef<HTMLDivElement>(null);

  // GSAP animation triggers on activeTab change
  useGSAP(
    () => {
      gsap.fromTo(
        ".tech-card",
        { opacity: 0, scale: 0.9, y: 20 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.45,
          stagger: 0.05,
          ease: "power2.out",
        }
      );
    },
    { dependencies: [activeTab], scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="tech-stack"
      className="py-16 sm:py-24 w-full max-w-6xl mx-auto px-4 sm:px-6 relative overflow-hidden"
    >
      {/* Dynamic Grid Background Accent */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full max-w-4xl bg-primary/2 rounded-full blur-3xl -z-10" />

      {/* Premium Section Title */}
      <div className="text-center mb-12 sm:mb-16">
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-3">
          Skills & Architecture
        </h2>
        <p className="text-muted-foreground max-w-md mx-auto text-sm sm:text-base">
          A modular breakdown of my technical capabilities, languages, frameworks, and deployment tooling.
        </p>
      </div>

      {/* Main Content Layout */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 items-start">
        {/* Left Column (Vertical Tabs list) */}
        <div className="md:col-span-4 flex md:flex-col gap-2 overflow-x-auto md:overflow-x-visible pb-4 md:pb-0 scrollbar-none border-b md:border-b-0 md:border-r border-border/40 pr-0 md:pr-6">
          {(Object.keys(TECH_STACK_DATA) as TabKeys[]).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex items-center justify-between px-5 py-4 text-left font-semibold text-sm rounded-xl transition-all duration-300 whitespace-nowrap cursor-pointer ${
                  isActive
                    ? "bg-primary/10 text-primary border-t-4 md:border-t-0 md:border-l-4 border-primary shadow-sm"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/30 border-t-4 md:border-t-0 md:border-l-4 border-transparent"
                }`}
              >
                <span>{tab}</span>
                <span
                  className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded-full border transition-colors ${
                    isActive
                      ? "bg-primary/20 border-primary/30 text-primary"
                      : "bg-muted/40 border-border/30 text-muted-foreground"
                  }`}
                >
                  {TECH_STACK_DATA[tab].length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Right Column (Grid Showcase) */}
        <div className="md:col-span-8 min-h-[280px]">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {TECH_STACK_DATA[activeTab].map((tech) => (
              <div
                key={tech.name}
                className="tech-card group flex flex-col items-center justify-center p-6 bg-card/60 backdrop-blur-md border border-border/40 rounded-2xl shadow-sm hover:shadow-md hover:border-border/80 transition-all duration-300"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-2xl bg-muted/40 mb-4 text-foreground transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/10">
                  {tech.icon}
                </div>
                <h4 className="text-sm font-semibold text-center text-foreground group-hover:text-primary transition-colors">
                  {tech.name}
                </h4>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
