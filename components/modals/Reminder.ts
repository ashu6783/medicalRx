import mongoose, { Schema, Document } from "mongoose";

// Define a clean TypeScript type for client-side usage (no methods from Mongoose Document)
export interface IReminder {
  _id: string; // It's actually always a string when sent over JSON
  text: string;
  time?: string;
  status: string;
}

// Define a Mongoose Document type separately for server-side
interface IReminderDoc extends Document {
  text: string;
  time?: string;
  status: string;
}

// Mongoose schema
const ReminderSchema = new Schema<IReminderDoc>({
  text: { type: String, required: true },
  time: { type: String },
  status: { type: String, default: "Prescribed" },
});

// Export Mongoose model
export const Reminder =
  mongoose.models.Reminder ||
  mongoose.model<IReminderDoc>("Reminder", ReminderSchema);
