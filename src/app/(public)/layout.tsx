import React from "react";
import { cookies } from "next/headers";
import { Navbar } from "@/components/shared/Navbar";
import { Footer } from "@/components/shared/Footer";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;
  const isAuthenticated = !!token;

  return (
    <>
      <Navbar isAuthenticated={isAuthenticated} />
      <main className="flex-1 flex flex-col">{children}</main>
      <Footer />
    </>
  );
}
