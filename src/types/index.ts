import { Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: "admin" | "user";
  profileImage?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IProject extends Document {
  title: string;
  shortDescription: string;
  detailedDescription: string; // Rich Text HTML
  technologies: string[];
  liveLink?: string;
  githubClient?: string;
  githubServer?: string;
  coverImage: string; // Cloudinary URL
  galleryImages?: string[]; // Array of Cloudinary URLs
  category: string;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IBlog extends Document {
  title: string;
  summary: string;
  content: string; // Rich Text HTML
  thumbnail: string; // Cloudinary URL
  tags: string[];
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

// JWT Payload Interface
export interface IJwtPayload {
  userId: string;
  role: "admin" | "user";
}
