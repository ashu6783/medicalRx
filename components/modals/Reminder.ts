import mongoose, { Schema, Document } from "mongoose";

export interface IReminder {
  _id: string;
  text: string;
  time?: string;
  status: string;
  priority?: 'high' | 'medium' | 'low';
  date?: string;
}

// Define a Mongoose Document type separately for server-side
interface IReminderDoc extends Document {
  text: string;
  time?: string;
  status: string;
  
}

const ReminderSchema = new Schema<IReminderDoc>({
  text: { type: String, required: true },
  time: { type: String },
  status: { type: String, default: "Prescribed" },
});

export const Reminder =
  mongoose.models.Reminder ||
  mongoose.model<IReminderDoc>("Reminder", ReminderSchema);
