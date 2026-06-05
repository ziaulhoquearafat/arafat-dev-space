"use client";

import React, { useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import { Phone, Mail, MapPin, Calendar, Send, Loader2 } from "lucide-react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

// Form validation schema using Zod
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email address."),
  phone: z.string().optional().refine((val) => {
    if (!val) return true;
    return /^[+]?[0-9\s-]{6,15}$/.test(val);
  }, "Invalid phone number format."),
  subject: z.string().min(3, "Subject must be at least 3 characters."),
  message: z.string().min(10, "Message must be at least 10 characters."),
});

type ContactFormValues = z.infer<typeof contactSchema>;

interface ContactSectionProps {
  showBorder?: boolean;
}

export function ContactSection({ showBorder = true }: ContactSectionProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: "",
      message: "",
    },
  });

  // Entrance stagger animations using GSAP
  useGSAP(
    () => {
      // Stagger items inside the contact section
      gsap.fromTo(
        ".animate-contact-item",
        { y: 30, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.1,
          ease: "power3.out",
        }
      );
    },
    { scope: containerRef }
  );

  const onSubmit = async (data: ContactFormValues) => {
    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Message sent successfully!");
        reset();
      } else {
        toast.error(result.error || "Failed to send message.");
      }
    } catch (error) {
      console.error("Contact form submission error:", error);
      toast.error("Something went wrong. Please try again later.");
    }
  };

  return (
    <section
      ref={containerRef}
      id="contact"
      className={`py-20 px-4 sm:px-6 lg:px-8 bg-background relative overflow-hidden ${
        showBorder ? "border-t border-border/20" : ""
      }`}
    >
      {/* Background Decorative Glow Blobs */}
      <div className="absolute top-1/4 left-1/10 w-72 h-72 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/10 w-96 h-96 bg-accent/5 rounded-full blur-3xl -z-10" />

      <div className="max-w-6xl mx-auto space-y-12">
        {/* Section Header */}
        <div className="space-y-4 text-center">
          <h2 className="animate-contact-item text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Get In Touch
          </h2>
          <p className="animate-contact-item max-w-2xl mx-auto text-base sm:text-lg text-muted-foreground">
            Have a project in mind or want to discuss a potential collaboration? Feel free to drop a message.
          </p>
        </div>

        {/* Contact Container Grid */}
        <div className="grid gap-8 lg:grid-cols-12 items-stretch">
          
          {/* Left Column: Contact Details */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8 p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm animate-contact-item">
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-foreground">Contact Information</h3>
              <p className="text-sm text-muted-foreground">
                Reach out directly via phone or email, or drop by for a chat if you&apos;re in the city.
              </p>

              {/* Info Stack */}
              <div className="space-y-4">
                
                {/* Phone */}
                <a
                  href="tel:+8801766952640"
                  className="flex items-center gap-4 p-3 rounded-xl border border-border/30 bg-background/40 hover:bg-background hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <Phone className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Phone</p>
                    <p className="text-sm font-bold text-foreground">+880 1766 952640</p>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:mdarafat3167@gmail.com"
                  className="flex items-center gap-4 p-3 rounded-xl border border-border/30 bg-background/40 hover:bg-background hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300 group"
                >
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary group-hover:scale-105 transition-transform">
                    <Mail className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Email</p>
                    <p className="text-sm font-bold text-foreground truncate max-w-full">
                      mdarafat3167@gmail.com
                    </p>
                  </div>
                </a>

                {/* Address */}
                <div className="flex items-center gap-4 p-3 rounded-xl border border-border/30 bg-background/40 group">
                  <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                    <MapPin className="size-5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-muted-foreground">Location</p>
                    <p className="text-sm font-bold text-foreground">Chattogram, Bangladesh</p>
                  </div>
                </div>

              </div>
            </div>

            {/* Calendly CTA */}
            <div className="pt-4 border-t border-border/30">
              <a
                href="https://calendly.com/mdarafat3167/30min"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-md hover:shadow-lg hover:scale-102 active:scale-98 transition-all duration-300 w-full sm:w-fit cursor-pointer"
              >
                <Calendar className="size-4" />
                Schedule a meeting
              </a>
            </div>
          </div>

          {/* Right Column: Contact Form */}
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="lg:col-span-7 flex flex-col justify-between p-6 sm:p-8 rounded-2xl border border-border/40 bg-card/60 backdrop-blur-md shadow-sm space-y-5 animate-contact-item"
          >
            <h3 className="text-xl font-bold text-foreground">Send a Message</h3>

            {/* Inputs Stagger Container */}
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Name */}
                <div className="space-y-1">
                  <label htmlFor="name" className="text-xs font-semibold text-muted-foreground">
                    Your Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/40"
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

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="email" className="text-xs font-semibold text-muted-foreground">
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/40"
                    placeholder="john@example.com"
                    disabled={isSubmitting}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p className="text-xs font-medium text-destructive mt-0.5">
                      {errors.email.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                {/* Phone */}
                <div className="space-y-1">
                  <label htmlFor="phone" className="text-xs font-semibold text-muted-foreground">
                    Phone (Optional)
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/40"
                    placeholder="+1 (555) 000-0000"
                    disabled={isSubmitting}
                    {...register("phone")}
                  />
                  {errors.phone && (
                    <p className="text-xs font-medium text-destructive mt-0.5">
                      {errors.phone.message}
                    </p>
                  )}
                </div>

                {/* Subject */}
                <div className="space-y-1">
                  <label htmlFor="subject" className="text-xs font-semibold text-muted-foreground">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/40"
                    placeholder="Project Discussion"
                    disabled={isSubmitting}
                    {...register("subject")}
                  />
                  {errors.subject && (
                    <p className="text-xs font-medium text-destructive mt-0.5">
                      {errors.subject.message}
                    </p>
                  )}
                </div>
              </div>

              {/* Message */}
              <div className="space-y-1">
                <label htmlFor="message" className="text-xs font-semibold text-muted-foreground">
                  Your Message
                </label>
                <textarea
                  id="message"
                  rows={5}
                  className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition duration-200 focus:border-primary focus:ring-1 focus:ring-primary placeholder:text-muted-foreground/40 resize-none"
                  placeholder="Tell me about your project or inquiry..."
                  disabled={isSubmitting}
                  {...register("message")}
                />
                {errors.message && (
                  <p className="text-xs font-medium text-destructive mt-0.5">
                    {errors.message.message}
                  </p>
                )}
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-gradient-to-r from-primary to-accent text-white font-semibold shadow-md hover:shadow-lg hover:scale-101 active:scale-99 disabled:opacity-50 disabled:pointer-events-none transition-all duration-300 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Sending Message...
                  </>
                ) : (
                  <>
                    <Send className="size-4" />
                    Send Message
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
