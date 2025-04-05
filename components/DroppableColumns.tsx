import { useDrop } from "react-dnd";
import ReminderCard from "./ReminderCard";
import type { IReminder } from "./modals/Reminder";
import { useRef } from "react";

interface DroppableColumnProps {
  stage: string;
  reminders: IReminder[];
  onDrop: (id: string, stage: string) => void;
  columnColor: string; // Added columnColor prop
}

export default function DroppableColumn({ stage, reminders, onDrop }: DroppableColumnProps) {
  const dropRef = useRef<HTMLDivElement>(null);

  const [{ isOver }, drop] = useDrop({
    accept: "REMINDER",
    drop: (item: { id: string }) => onDrop(item.id, stage),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  });

  drop(dropRef);

  return (
    <div
      ref={dropRef}
      className={`bg-gray-100 rounded-md p-2 shadow-md min-h-[200px] transition ${
        isOver ? "bg-green-100" : ""
      }`}
    >
      <h3 className="font-bold text-center mb-2">{stage}</h3>
      {reminders.map((reminder) => (
        <ReminderCard key={reminder._id} reminder={reminder} />
      ))}
    </div>
  );
}
