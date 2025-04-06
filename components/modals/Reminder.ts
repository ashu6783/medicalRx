import mongoose, { Schema, Document } from "mongoose";

export interface IReminder {
  _id: string;
  text: string;
  time?: string;
  status: string;
  priority?: 'high' | 'medium' | 'low';
  date?: string;
  userId: string;
}

interface IReminderDoc extends Document {
  text: string;
  time?: string;
  status: string;
  userId: string;
  
}

const ReminderSchema = new Schema<IReminderDoc>({
  text: { type: String, required: true },
  time: { type: String },
  status: { type: String, default: "Prescribed" },
  userId: { type: String, required: true }, // new field
});

export const Reminder =
  mongoose.models.Reminder ||
  mongoose.model<IReminderDoc>("Reminder", ReminderSchema);
