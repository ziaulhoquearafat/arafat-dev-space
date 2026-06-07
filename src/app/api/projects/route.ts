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
    const contentType = request.headers.get("content-type") || "";
    let title: string | null = null;
    let shortDescription: string | null = null;
    let detailedDescription: string | null = null;
    let technologies: string | null = null;
    let liveLink: string | null = null;
    let githubClient: string | null = null;
    let githubServer: string | null = null;
    let coverImage: File | string | null = null;
    let category = "Full Stack";
    let featured = false;
    let status = "completed";

    if (contentType.includes("application/json")) {
      const body = await request.json();
      title = body.title || null;
      shortDescription = body.shortDescription || null;
      detailedDescription = body.detailedDescription || null;
      technologies = Array.isArray(body.technologies) ? body.technologies.join(", ") : (body.technologies || null);
      liveLink = body.liveLink || null;
      githubClient = body.githubClient || null;
      githubServer = body.githubServer || null;
      coverImage = body.coverImage || null;
      category = body.category || "Full Stack";
      featured = !!body.featured;
      status = body.status || "completed";
    } else {
      const formData = await request.formData();
      title = formData.get("title") as string | null;
      shortDescription = formData.get("shortDescription") as string | null;
      detailedDescription = formData.get("detailedDescription") as string | null;
      technologies = formData.get("technologies") as string | null;
      liveLink = formData.get("liveLink") as string | null;
      githubClient = formData.get("githubClient") as string | null;
      githubServer = formData.get("githubServer") as string | null;
      coverImage = formData.get("coverImage") as File | null;
      category = formData.get("category") as string | null || "Full Stack";
      featured = formData.get("featured") === "true";
      status = formData.get("status") as string | null || "completed";
    }

    // Validate required fields
    if (!title || !shortDescription || !detailedDescription || !technologies || !coverImage) {
      return NextResponse.json(
        { error: "Title, shortDescription, detailedDescription, technologies, and coverImage are required fields." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Upload cover image to Cloudinary if it is a File
    let coverImageUrl = "";
    if (coverImage instanceof File) {
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
      coverImageUrl = uploadResult.secure_url;
    } else if (typeof coverImage === "string") {
      coverImageUrl = coverImage;
    }

    const techArray = technologies.split(",").map((t) => t.trim()).filter(Boolean);

    const newProject = await Project.create({
      title,
      shortDescription,
      detailedDescription,
      technologies: techArray,
      liveLink: liveLink || "",
      githubClient: githubClient || "",
      githubServer: githubServer || "",
      coverImage: coverImageUrl,
      galleryImages: [],
      category,
      featured,
      status,
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
