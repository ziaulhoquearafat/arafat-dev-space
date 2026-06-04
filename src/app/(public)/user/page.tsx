"use client";

import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Loader2, Camera, User } from "lucide-react";
import { toast } from "react-hot-toast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRouter } from "next/navigation";

const profileFormSchema = z.object({
  name: z.string().min(1, "Name is required."),
  email: z.string().email("Invalid email address."),
  profileImage: z.any().optional(),
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;

export default function UserProfilePage() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [loadingData, setLoadingData] = useState(true);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      name: "",
      email: "",
    },
  });

  const selectedImage = watch("profileImage");

  // Fetch current user data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch("/api/users/profile");
        if (res.ok) {
          const user = await res.json();
          reset({
            name: user.name,
            email: user.email,
          });
          if (user.profileImage) {
            setAvatarPreview(user.profileImage);
          }
        } else if (res.status === 401) {
          toast.error("Please log in to view your profile.");
          router.push("/login");
        } else {
          toast.error("Failed to load user profile.");
        }
      } catch (error) {
        console.error("Error loading user profile:", error);
        toast.error("An error occurred while loading profile data.");
      } finally {
        setLoadingData(false);
      }
    };

    fetchProfile();
  }, [reset, router]);

  // Update avatar preview when a new file is chosen
  useEffect(() => {
    if (selectedImage && selectedImage.length > 0) {
      const file = selectedImage[0];
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);

      // Clean up the object URL when components unmount
      return () => URL.revokeObjectURL(previewUrl);
    }
  }, [selectedImage]);

  // GSAP animation
  useGSAP(
    () => {
      if (!loadingData) {
        gsap.fromTo(
          ".animate-profile-item",
          { y: 30, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.1,
            ease: "power3.out",
          }
        );
      }
    },
    { scope: containerRef, dependencies: [loadingData] }
  );

  const onSubmit = async (data: ProfileFormValues) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("email", data.email);

      if (data.profileImage && data.profileImage.length > 0) {
        formData.append("profileImage", data.profileImage[0]);
      }

      const res = await fetch("/api/users/profile", {
        method: "PUT",
        body: formData,
      });

      if (res.ok) {
        const updatedUser = await res.json();
        toast.success("Profile updated successfully!");
        
        // Reset form values to clear file inputs and update fields
        reset({
          name: updatedUser.name,
          email: updatedUser.email,
        });

        if (updatedUser.profileImage) {
          setAvatarPreview(updatedUser.profileImage);
        }
      } else {
        const errorData = await res.json().catch(() => ({}));
        toast.error(errorData.error || "Failed to update profile.");
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("An unexpected error occurred.");
    }
  };

  if (loadingData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground font-medium animate-pulse">
          Loading profile data...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div ref={containerRef} className="space-y-6 w-full max-w-2xl">
        {/* Page Header */}
        <div className="animate-profile-item space-y-1 text-center sm:text-left">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Profile
          </h1>
          <p className="text-sm text-muted-foreground">
            Update your personal details and upload a custom avatar.
          </p>
        </div>

        {/* Main card */}
        <div className="animate-profile-item rounded-xl border border-border/50 bg-card p-6 sm:p-8 shadow-sm">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            
            {/* Profile Picture Upload & Preview */}
            <div className="flex flex-col items-center sm:flex-row gap-6 pb-6 border-b border-border/40">
              <div className="relative group">
                <div className="size-24 rounded-full border border-border overflow-hidden bg-muted flex items-center justify-center shadow-inner">
                  {avatarPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={avatarPreview}
                      alt="Profile Preview"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="size-10 text-muted-foreground/60" />
                  )}
                </div>
                <label
                  htmlFor="avatar-upload"
                  className="absolute inset-0 bg-black/40 text-white flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 cursor-pointer"
                >
                  <Camera className="size-5" />
                </label>
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={isSubmitting}
                  {...register("profileImage")}
                />
              </div>
              
              <div className="space-y-1 text-center sm:text-left">
                <h3 className="font-semibold text-foreground">Profile Picture</h3>
                <p className="text-xs text-muted-foreground leading-normal max-w-xs">
                  Upload a square picture of yourself. Supports PNG, JPG, or GIF formats.
                </p>
                <label
                  htmlFor="avatar-upload"
                  className="inline-flex h-8 items-center justify-center rounded-lg border border-border bg-background px-3 text-xs font-semibold text-muted-foreground hover:bg-muted hover:text-foreground cursor-pointer transition duration-200"
                >
                  Change Picture
                </label>
              </div>
            </div>

            {/* Form Fields */}
            <div className="space-y-4">
              {/* Name Field */}
              <div className="space-y-1.5">
                <label
                  htmlFor="name"
                  className="text-sm font-semibold text-muted-foreground"
                >
                  Name
                </label>
                <input
                  id="name"
                  type="text"
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/45"
                  placeholder="Your full name"
                  disabled={isSubmitting}
                  {...register("name")}
                />
                {errors.name && (
                  <p className="text-xs font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email Field (Readonly) */}
              <div className="space-y-1.5">
                <label
                  htmlFor="email"
                  className="text-sm font-semibold text-muted-foreground"
                >
                  Email Address (Read-only)
                </label>
                <input
                  id="email"
                  type="email"
                  className="w-full rounded-lg border border-border bg-muted/50 px-3 py-2 text-sm text-muted-foreground outline-none cursor-not-allowed select-none"
                  readOnly
                  {...register("email")}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center justify-end gap-4 pt-4 border-t border-border/50">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-10 items-center justify-center gap-2 rounded-lg bg-gradient-to-r from-primary to-accent px-5 text-sm font-semibold text-white shadow-md hover:opacity-90 active:scale-98 transition duration-200 disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Saving Changes...
                  </>
                ) : (
                  "Save Changes"
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
