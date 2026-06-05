import { IProject } from "@/types";
import { Schema, model, models } from "mongoose";

const ProjectSchema = new Schema<IProject>(
  {
    title: { type: String, required: true },
    shortDescription: { type: String, required: true },
    detailedDescription: { type: String, required: true }, // Rich Text
    technologies: { type: [String], required: true },
    liveLink: { type: String },
    githubClient: { type: String },
    githubServer: { type: String },
    coverImage: { type: String, required: true },
    galleryImages: { type: [String], default: [] },
    category: { type: String, required: true, default: "Full Stack" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export default models.Project || model<IProject>("Project", ProjectSchema);
