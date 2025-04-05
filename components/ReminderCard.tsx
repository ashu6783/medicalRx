import { useDrag } from "react-dnd";
import type { IReminder } from "./modals/Reminder";
import { useRef } from "react";

interface ReminderCardProps {
  reminder: IReminder;
}

export default function ReminderCard({ reminder }: ReminderCardProps) {
  const dragRef = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "REMINDER",
    item: { id: reminder._id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(dragRef);

  return (
    <div
      ref={dragRef}
      className={`p-2 bg-white rounded border shadow-sm mb-2 cursor-move ${
        isDragging ? "opacity-50" : ""
      }`}
    >
      <p className="font-medium">{reminder.text}</p>
      {reminder.time && (
        <p className="text-sm text-gray-500">⏰ {reminder.time}</p>
      )}
    </div>
  );
}
