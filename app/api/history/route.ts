import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Patient } from "@/components/modals/patients";

export async function POST(req: Request) {
    await connectDB();
    const { name, diagnosis, medications } = await req.json();

    if (!name || !diagnosis || !medications) {
        return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const patient = new Patient({ name, diagnosis, medications });
    await patient.save();

    return NextResponse.json({ message: "Patient history saved successfully" });
}
