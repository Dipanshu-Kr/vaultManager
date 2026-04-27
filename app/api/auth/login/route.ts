import db from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ success: false, message: "Missing email or password" }, { status: 400 });
    }

    const [users]: any = await db.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    const user = users[0];

    if (user.password !== password) {
      return NextResponse.json({ success: false, message: "Invalid email or password" }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      userId: user.id
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}