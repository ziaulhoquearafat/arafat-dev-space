"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Logout() {
  const router = useRouter();

  useEffect(() => {
    const performLogout = async () => {
      try {
        await fetch("/api/auth/logout", { method: "POST" });
      } catch (error) {
        console.error("Logout failed:", error);
      } finally {
        router.push("/login");
        router.refresh();
      }
    };
    performLogout();
  }, [router]);

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-background">
      <div className="text-sm font-semibold text-muted-foreground animate-pulse">
        Logging out...
      </div>
    </div>
  );
}
