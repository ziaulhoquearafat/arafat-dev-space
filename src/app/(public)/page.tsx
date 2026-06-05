import React from "react";
import { Hero } from "@/components/home/Hero";
import { TechStack } from "@/components/sections/TechStack";
import { FeaturedProjects } from "@/components/sections/FeaturedProjects";
import { Education } from "@/components/sections/Education";
import { ContactSection } from "@/components/sections/ContactSection";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TechStack />
      <FeaturedProjects />
      <Education />
      <ContactSection />
    </>
  );
}
