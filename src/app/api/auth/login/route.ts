import { dbConnect } from "@/lib/dbConnect";
import { generateToken } from "@/lib/jwt";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // 1. Connect to database
    await dbConnect();

    // 2. Extract email and password from request body
    const body = await request.json().catch(() => ({}));
    const { email, password } = body;

    // 3. Return 400 if email or password is missing
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required fields." },
        { status: 400 },
      );
    }

    // 4. Find user by email and explicitly select password field
    const user = await User.findOne({ email: email.toLowerCase() }).select(
      "+password",
    );
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // 5. Compare credentials using bcryptjs.compare
    const isPasswordValid = await bcrypt.compare(password, user.password || "");
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Invalid email or password." },
        { status: 401 },
      );
    }

    // 6. Generate JWT using user's ID and role
    const token = generateToken({
      userId: (user._id as string).toString(),
      role: user.role,
    });

    // 7. Create success JSON response with status 200
    const response = NextResponse.json(
      {
        message: "Logged in successfully.",
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
      { status: 200 },
    );

    // 8. Set JWT as HTTP-only, secure, sameSite="strict" cookie
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3 * 24 * 60 * 60, // 3 days in seconds
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 },
    );
  }
}
