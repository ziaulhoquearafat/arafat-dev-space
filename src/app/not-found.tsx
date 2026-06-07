"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft, Terminal } from "lucide-react";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scale-in & floating animation for the massive 404 text
      gsap.fromTo(
        ".err-code",
        { scale: 0.5, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1, ease: "back.out(1.7)" }
      );

      gsap.to(".err-code", {
        y: -15,
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 1,
      });

      // Staggered fade-in/slide-up for other elements
      gsap.fromTo(
        ".err-animate",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.3,
        }
      );
    },
    { scope: containerRef }
  );

  return (
    <div
      ref={containerRef}
      className="min-h-screen w-full bg-background flex flex-col items-center justify-center p-6 relative overflow-hidden select-none"
    >
      {/* Abstract background blobs for glow */}
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/10 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-2xl text-center space-y-8 relative z-10">
        {/* Massive Glowing 404 */}
        <h1 className="err-code text-[10rem] sm:text-[14rem] font-black leading-none bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(235,94,40,0.3)]">
          404
        </h1>

        {/* Catchy Developer Message Container */}
        <div className="space-y-4">
          <h2 className="err-animate text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">
            Lost in the Code?
          </h2>
          <p className="err-animate text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Oops! Looks like this route is undefined. The request returned a 404 status, meaning the requested compiler path does not exist.
          </p>
        </div>

        {/* Tech-themed Code Block decoration */}
        <div className="err-animate w-full max-w-md mx-auto rounded-2xl border border-border/50 bg-card/60 backdrop-blur-md p-5 text-left font-mono text-xs sm:text-sm text-muted-foreground shadow-xl">
          <div className="flex items-center gap-1.5 border-b border-border/30 pb-3 mb-3">
            <Terminal className="size-4 text-primary" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground/60">
              Terminal Shell
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-primary font-bold">$ find /page/current-route</p>
            <p className="text-destructive">
              Error: PageNotFoundError at line 42
            </p>
            <p className="text-muted-foreground/40">
              {"// Redirecting to root node is recommended..."}
            </p>
          </div>
        </div>

        {/* Action Button */}
        <div className="err-animate pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-primary to-accent-foreground text-white font-bold text-sm shadow-lg hover:shadow-xl hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
