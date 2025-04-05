import mongoose, { Schema, Document } from "mongoose";

export interface IReminder extends Document {
  text: string;
  time: Date;
}

const ReminderSchema: Schema = new Schema({
  text: { type: String, required: true },
  time: { type: Date, required: true },
});

const Reminder = mongoose.models.Reminder || mongoose.model<IReminder>("Reminder", ReminderSchema);

export default Reminder;