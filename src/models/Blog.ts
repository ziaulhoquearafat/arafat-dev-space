import { IBlog } from "@/types";
import { Schema, model, models } from "mongoose";

const BlogSchema = new Schema<IBlog>(
  {
    title: { type: String, required: true },
    summary: { type: String, required: true },
    content: { type: String, required: true }, // Rich text HTML content
    thumbnail: { type: String, required: true }, // Cloudinary Image URL
    tags: { type: [String], default: [] },
    slug: { type: String, required: true, unique: true },
  },
  { timestamps: true },
);

export default models.Blog || model<IBlog>("Blog", BlogSchema);
