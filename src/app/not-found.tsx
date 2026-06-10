"use client";

import React, { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      // Scale-in & floating animation for the massive 404 text
      gsap.fromTo(
        ".err-code",
        { scale: 0.8, opacity: 0 },
        { scale: 1, opacity: 1, duration: 1.2, ease: "power4.out" }
      );

      gsap.to(".err-code", {
        y: -10,
        duration: 2.5,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
        delay: 0.8,
      });

      // Staggered fade-in/slide-up for subtitle and action button
      gsap.fromTo(
        ".err-animate",
        { y: 20, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.15,
          ease: "power3.out",
          delay: 0.4,
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
      <div className="absolute top-1/4 left-1/4 w-80 h-80 bg-primary/5 rounded-full blur-3xl -z-10 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10 animate-pulse" style={{ animationDelay: "1.2s" }} />

      <div className="w-full max-w-md text-center space-y-6 relative z-10">
        {/* Massive Glowing 404 */}
        <h1 className="err-code text-8xl sm:text-9xl font-black leading-none bg-gradient-to-r from-primary to-accent-foreground bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(235,94,40,0.25)]">
          404
        </h1>

        {/* Clean, minimalist text content */}
        <div className="err-animate space-y-2">
          <p className="text-muted-foreground text-center mt-4 text-base sm:text-lg">
            Oops! The page you are looking for doesn&apos;t exist.
          </p>
        </div>

        {/* Action Button */}
        <div className="err-animate pt-4">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-primary to-accent-foreground text-white font-semibold text-sm shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer"
          >
            <ArrowLeft className="size-4" />
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
