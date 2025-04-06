import { NextResponse } from "next/server";
import { connectDB } from "@/lib/api/db";
import { Reminder } from "@/components/modals/Reminder";
import { currentUser } from "@clerk/nextjs/server";

export async function GET() {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const reminders = await Reminder.find({ userId: user.id }).lean();
  return NextResponse.json(reminders);
}

export async function POST(req: Request) {
  await connectDB();
  const user = await currentUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();

  // Attach userId to the reminder
  const newReminder = await Reminder.create({ ...body, userId: user.id });
  return NextResponse.json(newReminder);
}
