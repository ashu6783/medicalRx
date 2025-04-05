import { NextResponse } from "next/server";
import { connectDB } from "@/lib/api/db";
import { Reminder } from "@/components/modals/Reminder";

export async function GET() {
  await connectDB();
  const reminders = await Reminder.find({}).lean();
  return NextResponse.json(reminders);
}

export async function POST(req: Request) {
  await connectDB();
  const body = await req.json();
  const newReminder = await Reminder.create(body);
  return NextResponse.json(newReminder);
}
