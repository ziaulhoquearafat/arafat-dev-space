"use client";

import React, { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface PreloaderProps {
  small?: boolean;
}

export function Preloader({ small = false }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      if (!small) {
        // Staggered character reveal animation for "ARAFAT.DEV"
        const chars = textRef.current?.querySelectorAll(".char");
        if (chars && chars.length > 0) {
          gsap.fromTo(
            chars,
            { opacity: 0, scale: 0.3, y: 15 },
            {
              opacity: 1,
              scale: 1,
              y: 0,
              duration: 0.6,
              stagger: 0.08,
              ease: "back.out(1.7)",
              repeat: -1,
              yoyo: true,
              repeatDelay: 1.2,
            }
          );
        }

        // Subtitle breathing fade animation
        gsap.fromTo(
          ".preloader-subtitle",
          { opacity: 0.3 },
          { opacity: 1, duration: 1.2, repeat: -1, yoyo: true, ease: "sine.inOut" }
        );
      }
    },
    { scope: containerRef, dependencies: [small] }
  );

  if (small) {
    // A compact, premium version for nested inline loading
    return (
      <div className="flex flex-col items-center justify-center p-8 gap-4 w-full min-h-[250px]">
        <div className="relative size-12 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-2 border-primary/20 border-t-primary animate-spin" />
          <div className="absolute size-8 rounded-full border border-accent/20 border-b-accent animate-[spin_1s_linear_infinite_reverse]" />
          <div className="size-3 rounded-full bg-primary/80 shadow-[0_0_12px_var(--primary)] animate-ping" />
        </div>
        <span className="text-[10px] font-bold text-muted-foreground/60 tracking-widest uppercase animate-pulse">
          Loading Content...
        </span>
      </div>
    );
  }

  // Full-screen preloader with premium GSAP tech aesthetic
  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[9999] bg-background flex flex-col items-center justify-center gap-8 select-none"
    >
      {/* Abstract Tech loading geometry */}
      <div className="relative size-24 flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className="absolute inset-0 rounded-full border-[3px] border-transparent border-t-primary border-r-primary/40 animate-[spin_3s_linear_infinite] shadow-[0_0_15px_rgba(var(--primary),0.1)]" />
        
        {/* Middle reverse ring */}
        <div className="absolute size-18 rounded-full border-2 border-transparent border-b-accent border-l-accent/40 animate-[spin_1.5s_linear_infinite_reverse]" />
        
        {/* Inner pulsing core */}
        <div className="size-8 rounded-full bg-gradient-to-tr from-primary to-accent opacity-85 shadow-[0_0_20px_var(--primary)] flex items-center justify-center">
          <div className="size-3 rounded-full bg-background animate-ping" />
        </div>
      </div>

      {/* Staggered brand title */}
      <div ref={textRef} className="flex gap-1.5 text-lg sm:text-xl font-black tracking-widest text-foreground">
        {"ARAFAT.DEV".split("").map((char, index) => (
          <span key={index} className="char inline-block">
            {char}
          </span>
        ))}
      </div>

      {/* Subtitle status text */}
      <p className="preloader-subtitle text-[10px] sm:text-xs font-semibold tracking-[0.25em] text-muted-foreground/85 uppercase">
        Initializing System
      </p>
    </div>
  );
}
