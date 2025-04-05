// app/api/reminders/route.ts

import { connectDB } from "../../../lib/api/db";
import Reminder from "@/components/modals/Reminder";
import { NextResponse } from "next/server";

export async function GET() {
  await connectDB();
  const reminders = await Reminder.find();
  return NextResponse.json(reminders);
}

export async function POST(req: Request) {
  const { text, time } = await req.json(); // include time
  if (!text) return NextResponse.json({ error: "Text required" }, { status: 400 });

  await connectDB();
  const newReminder = await Reminder.create({ text, time });
  return NextResponse.json(newReminder, { status: 201 });
}
