import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/dbConnect";
import User from "@/models/User";
import { verifyToken } from "@/lib/jwt";
import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// GET: Fetch currently logged-in user's profile
export async function GET() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. No token provided." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized. Invalid token." }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    return NextResponse.json(user, { status: 200 });
  } catch (error) {
    console.error("GET Profile error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}

// PUT: Update currently logged-in user's profile
export async function PUT(request: Request) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Unauthorized. No token provided." }, { status: 401 });
    }

    let decoded;
    try {
      decoded = verifyToken(token);
    } catch {
      return NextResponse.json({ error: "Unauthorized. Invalid token." }, { status: 401 });
    }

    await dbConnect();
    const user = await User.findById(decoded.userId);
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const formData = await request.formData();
    const name = formData.get("name") as string | null;
    const email = formData.get("email") as string | null;
    const profileImage = formData.get("profileImage") as File | null;

    if (name) user.name = name;
    if (email) {
      // Validate uniqueness if changing email
      if (email !== user.email) {
        const emailExists = await User.findOne({ email });
        if (emailExists) {
          return NextResponse.json({ error: "Email is already in use." }, { status: 409 });
        }
        user.email = email;
      }
    }

    if (profileImage && profileImage.size > 0) {
      const bytes = await profileImage.arrayBuffer();
      const buffer = Buffer.from(bytes);

      const uploadResult = await new Promise<{ secure_url: string }>((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          { folder: "arafat_portfolio/users" },
          (error, result) => {
            if (error) reject(error);
            else if (result) resolve({ secure_url: result.secure_url });
            else reject(new Error("Cloudinary upload failed."));
          }
        ).end(buffer);
      });

      user.profileImage = uploadResult.secure_url;
    }

    await user.save();

    // Return updated user data (excluding password)
    const updatedUser = {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileImage: user.profileImage,
    };

    return NextResponse.json(updatedUser, { status: 200 });
  } catch (error) {
    console.error("PUT Profile error:", error);
    return NextResponse.json({ error: "Internal server error." }, { status: 500 });
  }
}
