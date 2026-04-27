import db from "@/lib/db";
import { NextResponse } from "next/server";

// GET: Fetch passwords for a specific user
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");

    if (!userId) {
      return NextResponse.json({ success: false, message: "Missing userId" }, { status: 400 });
    }

    const [rows]: any = await db.query(
      "SELECT * FROM passwords WHERE user_id = ? ORDER BY id DESC",
      [userId]
    );

    // Return an array directly as expected by the frontend, but handle empty cases gracefully
    return NextResponse.json(rows || []);

  } catch (err) {
    console.error("GET VAULT ERROR:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// POST: Add a new password entry
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { title, username, password, url, userId } = body;

    if (!title || !username || !password || !userId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const [result]: any = await db.query(
      "INSERT INTO passwords (website, username, password, url, user_id) VALUES (?, ?, ?, ?, ?)",
      [title, username, password, url || "", userId]
    );

    return NextResponse.json({
      success: true,
      id: result.insertId
    });

  } catch (err) {
    console.error("POST VAULT ERROR:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}