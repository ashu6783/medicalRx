import { NextResponse } from "next/server";
import { connectDB } from "@/lib/api/db";
import { Reminder } from "@/components/modals/Reminder";


export async function PUT(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();
  const body = await req.json();

  const { id } = await context.params;

  if (!id) {
    return new NextResponse("Missing reminder ID", { status: 400 });
  }

  const updated = await Reminder.findByIdAndUpdate(id, body, { new: true }).lean();
  if (!updated) {
    return new NextResponse("Reminder not found", { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  await connectDB();

  const { id } = await context.params;

  if (!id) {
    return new NextResponse("Missing reminder ID", { status: 400 });
  }

  const deleted = await Reminder.findByIdAndDelete(id);
  if (!deleted) {
    return new NextResponse("Reminder not found", { status: 404 });
  }

  return NextResponse.json({ message: "Deleted successfully" });
}