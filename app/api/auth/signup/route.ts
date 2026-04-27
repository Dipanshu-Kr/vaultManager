import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing email or password" }, { status: 400 });
    }

    // Check if user already exists
    const [existingUsers]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (existingUsers.length > 0) {
      return NextResponse.json({ success: false, message: "User already exists" }, { status: 400 });
    }

    // Insert new user
    const [result]: any = await db.query(
      "INSERT INTO users (email, password) VALUES (?, ?)",
      [email, password]
    );

    return NextResponse.json({
      success: true,
      message: "User created successfully",
      userId: result.insertId
    });

  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}