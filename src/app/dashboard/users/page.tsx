"use client";

import React, { useEffect, useState, useRef } from "react";
import { Loader2, User, Calendar } from "lucide-react";
import { toast } from "react-hot-toast";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  profileImage?: string;
  createdAt: string;
}

export default function AdminUsersPage() {
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  // Fetch registered users list
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch("/api/users");
        if (res.ok) {
          const data = await res.json();
          setUsers(data);
        } else {
          const errorData = await res.json().catch(() => ({}));
          toast.error(errorData.error || "Failed to load registered users.");
        }
      } catch (error) {
        console.error("Error loading users list:", error);
        toast.error("An error occurred while fetching users list.");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // GSAP animation
  useGSAP(
    () => {
      if (!loading) {
        gsap.fromTo(
          ".animate-user-row",
          { y: 25, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            stagger: 0.08,
            ease: "power3.out",
          }
        );
      }
    },
    { scope: containerRef, dependencies: [loading] }
  );

  return (
    <div ref={containerRef} className="space-y-6">
      {/* Page Header */}
      <div className="animate-user-row space-y-1">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Users Management
        </h1>
        <p className="text-sm text-muted-foreground">
          View and monitor all registered accounts in your system.
        </p>
      </div>

      {/* Users List Card */}
      <div className="animate-user-row rounded-xl border border-border/50 bg-card p-6 shadow-sm">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="size-8 animate-spin text-primary" />
            <p className="text-sm text-muted-foreground font-medium animate-pulse">
              Loading users...
            </p>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <User className="size-10 text-muted-foreground/60 mb-2" />
            <h3 className="text-sm font-semibold text-foreground">No users found</h3>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">User</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Role</th>
                  <th className="py-3 px-4">Join Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40 text-sm">
                {users.map((user) => (
                  <tr
                    key={user._id}
                    className="animate-user-row hover:bg-muted/30 transition-colors group"
                  >
                    <td className="py-4 px-4 font-semibold text-foreground max-w-sm truncate">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-full bg-muted overflow-hidden border border-border flex items-center justify-center flex-shrink-0">
                          {user.profileImage ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={user.profileImage}
                              alt={user.name}
                              className="object-cover w-full h-full"
                            />
                          ) : (
                            <User className="size-4 text-muted-foreground" />
                          )}
                        </div>
                        <div className="font-semibold text-foreground leading-snug">{user.name}</div>
                      </div>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground/80 font-mono text-xs max-w-xs truncate">
                      {user.email}
                    </td>
                    <td className="py-4 px-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                        user.role === "admin" 
                          ? "bg-primary/10 text-primary border border-primary/20" 
                          : "bg-muted text-muted-foreground border border-border"
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="py-4 px-4 text-muted-foreground/80">
                      <span className="flex items-center gap-1.5 text-xs">
                        <Calendar className="size-3.5" />
                        {new Date(user.createdAt).toLocaleDateString(undefined, {
                          year: "numeric",
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
