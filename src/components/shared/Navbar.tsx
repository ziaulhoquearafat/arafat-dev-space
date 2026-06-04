"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Sun, Moon, Menu, X, LogOut, User } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface NavbarProps {
  isAuthenticated: boolean;
}

export function Navbar({ isAuthenticated }: NavbarProps) {
  const [mounted, setMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const navbarRef = useRef<HTMLDivElement>(null);

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

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Failed to log out:", error);
    }
  };

  const navLinks = [
    { label: "Home", href: "/" },
    { label: "Projects", href: "/projects" },
    { label: "Blogs", href: "/blogs" },
    ...(isAuthenticated ? [{ label: "Dashboard", href: "/dashboard" }] : []),
    { label: "Contact", href: "#contact" },
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

          {/* Conditional Auth UI */}
          {isAuthenticated ? (
            <div className="flex items-center gap-4">
              {/* Profile Avatar */}
              <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent p-0.5 shadow-sm">
                <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-card-foreground">
                  <User className="size-4 text-muted-foreground" />
                </div>
              </div>
              
              {/* Logout bare button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-destructive cursor-pointer transition-colors"
              >
                <LogOut className="size-4" />
                Logout
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-4">
              <Link
                href="/login"
                className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
              >
                Log in
              </Link>
              <Link
                href="/register"
                className="inline-flex h-9 items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent px-4 text-sm font-semibold text-white shadow-sm hover:opacity-90 hover:shadow-md transition-all active:scale-95"
              >
                Sign up
              </Link>
            </div>
          )}
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
              {isAuthenticated ? (
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="flex size-9 items-center justify-center rounded-full bg-linear-to-br from-primary to-accent p-0.5">
                      <div className="flex h-full w-full items-center justify-center rounded-full bg-card text-card-foreground">
                        <User className="size-4 text-muted-foreground" />
                      </div>
                    </div>
                    <span className="text-sm font-medium text-foreground">My Profile</span>
                  </div>
                  <button
                    onClick={() => {
                      setIsMobileMenuOpen(false);
                      handleLogout();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-full border border-border/60 bg-card py-2 text-sm font-medium text-muted-foreground hover:text-destructive hover:bg-muted cursor-pointer transition-all"
                  >
                    <LogOut className="size-4" />
                    Logout
                  </button>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  <Link
                    href="/login"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-full border border-border/60 bg-card py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-all"
                  >
                    Log in
                  </Link>
                  <Link
                    href="/register"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex w-full items-center justify-center rounded-full bg-gradient-to-r from-primary to-accent py-2 text-sm font-semibold text-white shadow-sm hover:opacity-90 transition-all"
                  >
                    Sign up
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
