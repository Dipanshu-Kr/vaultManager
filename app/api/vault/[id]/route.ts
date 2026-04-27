import db from "@/lib/db";
import { NextResponse } from "next/server";

// PUT: Update a password entry
export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();
    const { title, username, password, url } = body;

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
    }

    await db.query(
      "UPDATE passwords SET website = ?, username = ?, password = ?, url = ? WHERE id = ?",
      [title, username, password, url || "", id]
    );

    return NextResponse.json({ success: true });

  } catch (err) {
    console.error("UPDATE VAULT ERROR:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}

// DELETE: Delete a password entry
export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ success: false, message: "Missing id" }, { status: 400 });
    }

    const [result]: any = await db.query(
      "DELETE FROM passwords WHERE id = ?",
      [id]
    );

    return NextResponse.json({
      success: result.affectedRows > 0
    });

  } catch (err) {
    console.error("DELETE VAULT ERROR:", err);
    return NextResponse.json({ success: false, message: "Internal Server Error" }, { status: 500 });
  }
}