import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";

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
    await dbConnect();

    const body = await request.json().catch(() => ({}));
    const {
      title,
      shortDescription,
      detailedDescription,
      technologies,
      liveLink,
      githubClient,
      githubServer,
      coverImage,
      galleryImages,
      featured,
    } = body;

    // Validate required fields
    if (!title || !shortDescription || !detailedDescription || !technologies || !coverImage) {
      return NextResponse.json(
        { error: "Title, shortDescription, detailedDescription, technologies, and coverImage are required." },
        { status: 400 }
      );
    }

    const techArray = Array.isArray(technologies)
      ? technologies
      : typeof technologies === "string"
      ? technologies.split(",").map((t) => t.trim()).filter(Boolean)
      : [];

    const galleryArray = Array.isArray(galleryImages) ? galleryImages : [];

    const newProject = await Project.create({
      title,
      shortDescription,
      detailedDescription,
      technologies: techArray,
      liveLink: liveLink || "",
      githubClient: githubClient || "",
      githubServer: githubServer || "",
      coverImage,
      galleryImages: galleryArray,
      featured: !!featured,
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
