import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Retrieve all projects sorted by newest first
export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json(projects, { status: 200 });
  } catch (error) {
    console.error("GET Projects error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// POST: Create and save a new project
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const shortDescription = formData.get("shortDescription") as string | null;
    const detailedDescription = formData.get("detailedDescription") as string | null;
    const technologies = formData.get("technologies") as string | null;
    const liveLink = formData.get("liveLink") as string | null;
    const githubClient = formData.get("githubClient") as string | null;
    const githubServer = formData.get("githubServer") as string | null;
    const coverImage = formData.get("coverImage") as File | null;
    const category = formData.get("category") as string | null || "Full Stack";
    const featured = formData.get("featured") === "true";

    // Validate required fields
    if (!title || !shortDescription || !detailedDescription || !technologies || !coverImage) {
      return NextResponse.json(
        { error: "Title, shortDescription, detailedDescription, technologies, and coverImage are required fields." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Upload cover image to Cloudinary
    const bytes = await coverImage.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "arafat_portfolio/projects" },
        (error, result) => {
          if (error) {
            reject(error);
          } else if (result) {
            resolve({ secure_url: result.secure_url });
          } else {
            reject(new Error("Cloudinary returned no result."));
          }
        }
      ).end(buffer);
    });

    const techArray = technologies.split(",").map((t) => t.trim()).filter(Boolean);

    const newProject = await Project.create({
      title,
      shortDescription,
      detailedDescription,
      technologies: techArray,
      liveLink: liveLink || "",
      githubClient: githubClient || "",
      githubServer: githubServer || "",
      coverImage: uploadResult.secure_url,
      galleryImages: [],
      category,
      featured,
    });

    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error("POST Projects error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
