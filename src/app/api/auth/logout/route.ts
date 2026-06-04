import { NextResponse } from "next/server";

export async function POST() {
  try {
    // 1. Create a NextResponse json with success message
    const response = NextResponse.json(
      { message: "Logged out successfully." },
      { status: 200 }
    );

    // 2. Clear the token cookie
    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout API error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
