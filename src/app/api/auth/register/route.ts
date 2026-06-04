import { dbConnect } from "@/lib/dbConnect";
import { generateToken } from "@/lib/jwt";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Connect to database
    await dbConnect();

    // 2. Extract name, email, password
    const body = await request.json().catch(() => ({}));
    const { name, email, password } = body;

    // 3. Return 400 if any field is missing
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Name, email, and password are required fields." },
        { status: 400 },
      );
    }

    // 4. Check if user already exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists." },
        { status: 409 },
      );
    }

    // 5. Hash password with salt rounds of 10
    const hashedPassword = await bcrypt.hash(password, 10);

    // 6. Create and save new user
    const newUser = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: "user",
    });

    // 7. Generate JWT using user's ID and role
    const token = generateToken({
      userId: (newUser._id as string).toString(),
      role: newUser.role,
    });

    // 8. Create success JSON response with status 201
    const response = NextResponse.json(
      {
        message: "User registered successfully.",
        user: {
          id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
        },
      },
      { status: 201 },
    );

    // 9. Set JWT as HTTP-only, secure, sameSite="strict" cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60, // 7 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Registration API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
