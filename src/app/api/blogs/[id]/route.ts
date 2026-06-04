import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/dbConnect";
import Blog from "@/models/Blog";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Retrieve a single blog by ID
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(blog, { status: 200 });
  } catch (error) {
    console.error("GET Blog by ID error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// PUT: Update a specific blog by ID
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const formData = await request.formData();
    const title = formData.get("title") as string | null;
    const slug = formData.get("slug") as string | null;
    const summary = formData.get("summary") as string | null;
    const content = formData.get("content") as string | null;
    const tagsRaw = formData.get("tags") as string | null;
    const thumbnail = formData.get("thumbnail") as File | null;

    await dbConnect();

    // Check if blog exists
    const blog = await Blog.findById(id);
    if (!blog) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    // Check if slug is unique (if it's being updated)
    if (slug && slug !== blog.slug) {
      const existingBlog = await Blog.findOne({ slug });
      if (existingBlog) {
        return NextResponse.json(
          { error: "A blog post with this slug already exists." },
          { status: 409 }
        );
      }
    }

    const updateData: Partial<{
      title: string;
      slug: string;
      summary: string;
      content: string;
      tags: string[];
      thumbnail: string;
    }> = {};
    if (title !== null) updateData.title = title;
    if (slug !== null) updateData.slug = slug;
    if (summary !== null) updateData.summary = summary;
    if (content !== null) updateData.content = content;
    
    if (tagsRaw !== null) {
      try {
        updateData.tags = JSON.parse(tagsRaw);
      } catch {
        updateData.tags = tagsRaw.split(",").map((t) => t.trim()).filter(Boolean);
      }
    }

    // Upload new thumbnail if provided
    if (thumbnail && thumbnail.size > 0) {
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
      updateData.thumbnail = uploadResult.secure_url;
    }

    const updatedBlog = await Blog.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    return NextResponse.json(updatedBlog, { status: 200 });
  } catch (error) {
    console.error("PUT Blog error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

// DELETE: Delete a specific blog by ID
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();
    const { id } = await params;

    const deletedBlog = await Blog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return NextResponse.json(
        { error: "Blog post not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Blog post deleted successfully." },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE Blog error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
