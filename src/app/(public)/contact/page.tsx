import React from "react";
import { ContactSection } from "@/components/sections/ContactSection";

export default function ContactPage() {
  return (
    <div className="flex-1 flex flex-col justify-center">
      <ContactSection showBorder={false} />
    </div>
  );
}
