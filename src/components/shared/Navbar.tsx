"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface NavbarProps {
  isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userProfile, setUserProfile] = useState<{ name: string; email: string; role?: string; profileImage?: string } | null>(null);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const navbarRef = useRef<HTMLDivElement>(null);

  // Fetch user profile on mount / auth change
  useEffect(() => {
    if (isAuthenticated) {
      const fetchProfile = async () => {
        try {
          const res = await fetch("/api/users/profile");
          if (res.ok) {
            const data = await res.json();
            setUserProfile(data);
          }
        } catch (error) {
          console.error("Failed to fetch profile in navbar:", error);
        }
      };
      fetchProfile();
    } else {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUserProfile(null);
    }
  }, [isAuthenticated]);

  // Avoid hydration mismatch by waiting for mount
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Entrance GSAP animation
  useGSAP(
    () => {
      gsap.fromTo(
        navbarRef.current,
        { y: -100, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.2, ease: "power4.out" }
      );
    },
    { scope: navbarRef }
  );

  const toggleTheme = () => {
    if (!mounted) return;
    setTheme(theme === "dark" ? "light" : "dark");
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Blogs", href: "/blogs" },
    ...(isAuthenticated && userProfile?.role === "admin" ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    { label: "Contact", href: "/contact" },
  ];

  return (
    <div
      ref={navbarRef}
      className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/70 backdrop-blur-md transition-all duration-300"
    >
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Left Side: Brand Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-extrabold tracking-tight text-transparent">
            Arafat.dev
          </span>
        </Link>

        {/* Center: Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.label}
                href={link.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive ? "text-primary font-semibold" : "text-muted-foreground"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Actions (Theme Toggle & Auth UI) */}
        <div className="hidden md:flex items-center gap-6">
          {/* Bare Theme Toggle Icon */}
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </button>

          <Link
            href="/#contact"
            className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent-foreground px-5 text-sm font-semibold text-white shadow-sm hover:opacity-90 hover:shadow-md hover:scale-102 active:scale-98 transition-all duration-300 cursor-pointer"
          >
            Hire Me
          </Link>
        </div>

        {/* Mobile Toggle & Bare Actions */}
        <div className="flex md:hidden items-center gap-4">
          <button
            onClick={toggleTheme}
            className="text-muted-foreground hover:text-foreground cursor-pointer transition-colors p-1"
            aria-label="Toggle Theme"
          >
            {mounted && (theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)) ? (
              <Sun className="size-5" />
            ) : (
              <Moon className="size-5" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-muted-foreground hover:text-foreground cursor-pointer p-1"
            aria-label="Toggle Mobile Menu"
          >
            {isMobileMenuOpen ? <X className="size-6" /> : <Menu className="size-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/40 bg-background/95 backdrop-blur-lg animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="space-y-1 px-4 py-4 pb-6">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={`block rounded-md px-3 py-2 text-base font-medium transition-colors hover:bg-muted ${
                    isActive ? "text-primary bg-muted" : "text-muted-foreground"
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}

            <div className="border-t border-border/40 my-4 pt-4 px-3">
              <Link
                href="/#contact"
                onClick={() => setIsMobileMenuOpen(false)}
                className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent-foreground py-2.5 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all duration-300"
              >
                Hire Me
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
