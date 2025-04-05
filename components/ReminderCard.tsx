import { useDrag } from "react-dnd";
import { useRef } from "react";
import type { IReminder } from "./modals/Reminder";
import { Trash2 } from "lucide-react";

interface ReminderCardProps {
    reminder: IReminder;
    onDelete: (id: string) => void;
}

export default function ReminderCard({ reminder, onDelete }: ReminderCardProps) {
    const dragRef = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: "REMINDER",
        item: { id: reminder._id },
        collect: (monitor) => ({
            isDragging: monitor.isDragging(),
        }),
    });


    drag(dragRef);

    const handleDelete = () => {
        onDelete(reminder._id); 
    };

    return (
        <div
            ref={dragRef}
            className={`p-4 bg-white rounded border shadow-sm mb-2 transition-all ${isDragging ? "opacity-50" : "opacity-100"
                }`}
            style={{
                cursor: "move",
                touchAction: "none",
            }}
        >
            <div className="flex justify-between items-center">
                <div>
                    <p className="font-medium">{reminder.text}</p>
                    {reminder.time && (
                        <p className="text-sm text-gray-500">⏰ {reminder.time}</p>
                    )}
                </div>
                {/* Delete Button */}
                <button
                    onClick={handleDelete}
                    className="text-red-500 hover:text-red-700 transition"
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </div>
    );
}
