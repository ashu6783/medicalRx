import mongoose, { Schema, Document } from "mongoose";

interface IPatient extends Document {
    name: string;
    diagnosis: string;
    medications: string[];
}

const PatientSchema = new Schema<IPatient>({
    name: { type: String, required: true },
    diagnosis: { type: String, required: true },
    medications: { type: [String], required: true },
});

export const Patient = mongoose.models.Patient || mongoose.model<IPatient>("Patient", PatientSchema);
