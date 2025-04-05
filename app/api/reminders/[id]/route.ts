import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import Reminder from "@/components/modals/Reminder"; // ✅ default import


export async function PUT(req: NextRequest) {
  try {
    const { text, time } = await req.json();

    const url = new URL(req.url);
    const id = url.pathname.split("/").pop(); // Extract `id` manually

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await connectDB();

    const updated = await Reminder.findByIdAndUpdate(
      id,
      { text, time },
      { new: true }
    );

    if (!updated) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json(updated);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop();

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await connectDB();

    const deleted = await Reminder.findByIdAndDelete(id);

    if (!deleted) {
      return NextResponse.json({ error: "Reminder not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

async function connectDB() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI || "");
  }
}
