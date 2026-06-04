import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { v2 as cloudinary } from "cloudinary";

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Retrieve all blogs sorted by newest first
export async function GET() {
  try {
    await dbConnect();
    
    const blogs = await Blog.find({}).sort({ createdAt: -1 });
    
    return NextResponse.json(blogs, { status: 200 });
  } catch (error) {
    console.error("GET Blogs error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// POST: Create and save a new blog post with file upload
export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const slug = formData.get("slug") as string | null;
    const summary = formData.get("summary") as string | null;
    const content = formData.get("content") as string | null;
    const tagsRaw = formData.get("tags") as string | null;
    const thumbnail = formData.get("thumbnail") as File | null;

    // Validate required fields
    if (!title || !slug || !summary || !content || !thumbnail) {
      return NextResponse.json(
        { error: "Title, slug, summary, content, and thumbnail are required fields." },
        { status: 400 }
      );
    }

    await dbConnect();

    // Check if slug is unique
    const existingBlog = await Blog.findOne({ slug });
    if (existingBlog) {
      return NextResponse.json(
        { error: "A blog post with this slug already exists." },
        { status: 409 }
      );
    }

    // Parse tags (tags can be a JSON string or a comma-separated string)
    let tagsArray: string[] = [];
    if (tagsRaw) {
      try {
        tagsArray = JSON.parse(tagsRaw);
      } catch {
        // Fallback if not JSON string
        tagsArray = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    // Upload thumbnail to Cloudinary
    const bytes = await thumbnail.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        { folder: "arafat_portfolio/blogs" },
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

    const newBlog = await Blog.create({
      title,
      summary,
      content,
      thumbnail: uploadResult.secure_url,
      tags: tagsArray,
      slug,
    });

    return NextResponse.json(newBlog, { status: 201 });
  } catch (error) {
    console.error("POST Blogs error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

