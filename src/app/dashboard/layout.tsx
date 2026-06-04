import React from "react";
import { Sidebar } from "@/components/dashboard/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen w-full bg-background">
      {/* Sidebar Panel */}
      <Sidebar />

      {/* Main Panel Content Area */}
      <main className="flex-1 h-screen overflow-y-auto p-8 pl-[284px]">
        {children}
      </main>
    </div>
  );
}
