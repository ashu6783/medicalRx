import { useDrop } from "react-dnd";
import ReminderCard from "./ReminderCard";
import type { IReminder } from "./modals/Reminder";
import { useRef } from "react";

interface DroppableColumnProps {
  stage: string;
  reminders: IReminder[];
  onDrop: (id: string) => void;
  // columnColor: string;
  onDelete: (id: string) => void;
}

export default function DroppableColumn({
  reminders,
  onDrop,
  // columnColor,
  onDelete,
}: DroppableColumnProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: "REMINDER",
    drop: (item: { id: string }) => onDrop(item.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`rounded-md min-h-52 p-4 shadow-md transition-all ${isOver ? "bg-green-100" : ""}`}
      style={{ cursor: "default" }}
    >
      {reminders.map((reminder) => (
        <ReminderCard 
          key={reminder._id} 
          reminder={reminder} 
          onDelete={onDelete}
        />
      ))}
    </div>
  );
}