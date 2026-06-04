"use client";

import React, { useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { toast } from "react-hot-toast";

// Define registration validation schema using Zod
const registerSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Please enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters long."),
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  // Entrance GSAP animation
  useGSAP(
    () => {
      // Fade in and slide up the card container
      gsap.fromTo(
        cardRef.current,
        { y: 40, opacity: 0 },
        { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
      );
      // Stagger elements from bottom up
      gsap.fromTo(
        ".animate-auth-item",
        { y: 15, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.1,
        }
      );
    },
    { scope: cardRef }
  );

  const onSubmit = async (data: RegisterFormValues) => {
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        throw new Error(result.error || "Something went wrong.");
      }

      setSuccessMsg("Account created successfully! Redirecting...");
      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to register. Please try again.";
      setErrorMsg(msg);
      toast.error(msg);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div
          ref={cardRef}
          className="rounded-2xl border border-border/50 bg-card p-8 shadow-xl opacity-0"
        >
          {/* Brand Logo Link */}
          <Link
            href="/"
            className="animate-auth-item bg-gradient-to-r from-primary to-accent bg-clip-text text-2xl font-extrabold text-center block mb-6 text-transparent"
          >
            Arafat.dev
          </Link>

          {/* Header */}
          <div className="text-center space-y-2 mb-6">
            <h2 className="animate-auth-item bg-gradient-to-r from-primary to-accent bg-clip-text text-3xl font-extrabold tracking-tight text-transparent">
              Create an Account
            </h2>
            <p className="animate-auth-item text-sm text-muted-foreground">
              Join Arafat.dev space
            </p>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            <div className="space-y-4">
              {/* Name Field */}
              <div className="animate-auth-item space-y-1">
                <label
                  htmlFor="name"
                  className="text-xs font-semibold text-muted-foreground"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  autoComplete="name"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                  placeholder="John Doe"
                  disabled={isSubmitting}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-destructive mt-0.5">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field */}
              <div className="animate-auth-item space-y-1">
                <label
                  htmlFor="email"
                  className="text-xs font-semibold text-muted-foreground"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  autoComplete="email"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                  placeholder="you@example.com"
                  disabled={isSubmitting}
                  {...register("email")}
                />
                {errors.email && (
                  <p className="text-xs font-medium text-destructive mt-0.5">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password Field */}
              <div className="animate-auth-item space-y-1">
                <label
                  htmlFor="password"
                  className="text-xs font-semibold text-muted-foreground"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    autoComplete="new-password"
                    className="w-full rounded-lg border border-border bg-background pl-3 pr-10 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/50"
                    placeholder="••••••••"
                    disabled={isSubmitting}
                    {...register("password")}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-muted-foreground hover:text-foreground cursor-pointer"
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="size-4" />
                    ) : (
                      <Eye className="size-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs font-medium text-destructive mt-0.5">
                    {errors.password.message}
                  </p>
                )}
              </div>
            </div>

            {/* Error or Success Msg */}
            {errorMsg && (
              <div className="rounded-lg border border-destructive/20 bg-destructive/10 p-3 text-xs font-medium text-destructive">
                {errorMsg}
              </div>
            )}

            {successMsg && (
              <div className="rounded-lg border border-primary/20 bg-primary/10 p-3 text-xs font-medium text-primary">
                {successMsg}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="animate-auth-item flex w-full h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-98 transition duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Sign up"
              )}
            </button>
          </form>

          {/* Footer Link */}
          <div className="animate-auth-item mt-6 text-center text-xs">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link
              href="/login"
              className="font-semibold text-primary hover:underline transition"
            >
              Log in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
