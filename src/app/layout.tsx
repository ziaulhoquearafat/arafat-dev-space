import { cn } from "@/lib/utils";
import type { Metadata } from "next";
import { Geist, Geist_Mono, Oxanium } from "next/font/google";
import "./globals.css";

import { ToastProvider } from "@/components/shared/ToastProvider";
import { ThemeProvider } from "@/components/theme/theme-provider";

const oxanium = Oxanium({ subsets: ["latin"], variable: "--font-sans" });

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Md Ziaul Hoque Arafat | Full-Stack Developer",
    template: "%s | Md Ziaul Hoque Arafat",
  },
  description:
    "Portfolio of Md Ziaul Hoque Arafat, a MERN Stack and Frontend Developer specializing in Next.js, React, and high-efficiency AI-assisted coding & prompt engineering.",
  keywords: [
    "Md Ziaul Hoque Arafat",
    "Full-Stack Developer",
    "MERN Stack",
    "Frontend Developer",
    "Next.js",
    "React",
    "AI-assisted Coding",
    "Prompt Engineering",
    "Web Developer Bangladesh",
  ],
  authors: [{ name: "Md Ziaul Hoque Arafat" }],
  openGraph: {
    type: "website",
    title: "Md Ziaul Hoque Arafat | Full-Stack Developer",
    description:
      "Portfolio of Md Ziaul Hoque Arafat, a MERN Stack and Frontend Developer specializing in Next.js, React, and high-efficiency AI-assisted coding & prompt engineering.",
    siteName: "Md Ziaul Hoque Arafat Portfolio",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Md Ziaul Hoque Arafat Portfolio Preview",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Md Ziaul Hoque Arafat | Full-Stack Developer",
    description:
      "MERN Stack and Frontend Developer specializing in Next.js, React, and AI-assisted coding.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={cn(
        "h-full",
        "antialiased",
        geistSans.variable,
        geistMono.variable,
        "font-sans",
        oxanium.variable,
      )}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ToastProvider />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
