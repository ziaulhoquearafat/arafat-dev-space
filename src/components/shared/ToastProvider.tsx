"use client";

import React from "react";
import { Toaster } from "react-hot-toast";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      toastOptions={{
        className: "font-sans text-sm",
        duration: 4000,
        style: {
          background: "var(--card)",
          color: "var(--foreground)",
          border: "1px solid var(--border)",
          borderRadius: "0.75rem",
        },
        success: {
          iconTheme: {
            primary: "oklch(0.6397 0.172 36.4421)",
            secondary: "var(--card)",
          },
        },
        error: {
          iconTheme: {
            primary: "var(--destructive)",
            secondary: "var(--card)",
          },
        },
      }}
    />
  );
}
