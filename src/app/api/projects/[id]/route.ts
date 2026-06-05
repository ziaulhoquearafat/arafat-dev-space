import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Project from "@/models/Project";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Retrieve a single project by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(project, { status: 200 });
  } catch (error) {
    console.error("GET Project by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// PUT: Update a specific project by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const shortDescription = formData.get("shortDescription") as string | null;
    const detailedDescription = formData.get("detailedDescription") as string | null;
    const technologies = formData.get("technologies") as string | null;
    const liveLink = formData.get("liveLink") as string | null;
    const githubClient = formData.get("githubClient") as string | null;
    const githubServer = formData.get("githubServer") as string | null;
    const coverImage = formData.get("coverImage") as File | null;
    const category = formData.get("category") as string | null;
    const featuredRaw = formData.get("featured") as string | null;

    await dbConnect();

    // Check if project exists
    const project = await Project.findById(id);
    if (!project) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    const updateData: Partial<{
      title: string;
      shortDescription: string;
      detailedDescription: string;
      technologies: string[];
      liveLink: string;
      githubClient: string;
      githubServer: string;
      coverImage: string;
      category: string;
      featured: boolean;
    }> = {};

    if (title !== null) updateData.title = title;
    if (shortDescription !== null) updateData.shortDescription = shortDescription;
    if (detailedDescription !== null) updateData.detailedDescription = detailedDescription;
    if (liveLink !== null) updateData.liveLink = liveLink;
    if (githubClient !== null) updateData.githubClient = githubClient;
    if (githubServer !== null) updateData.githubServer = githubServer;
    if (category !== null) updateData.category = category;
    if (featuredRaw !== null) updateData.featured = featuredRaw === "true";

    if (technologies !== null) {
      updateData.technologies = technologies.split(",").map((t) => t.trim()).filter(Boolean);
    }

    // Upload cover image to Cloudinary if a new one is selected
    if (coverImage && coverImage.size > 0) {
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
      updateData.coverImage = uploadResult.secure_url;
    }

    const updatedProject = await Project.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedProject, { status: 200 });
  } catch (error) {
    console.error("PUT Project error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific project by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedProject = await Project.findByIdAndDelete(id);
    if (!deletedProject) {
      return NextResponse.json(
        { error: "Project not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Project deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Project error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
