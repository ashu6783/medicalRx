"use client";

import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend"; // Import the touch backend
import DroppableColumn from "@/components/DroppableColumns";
import type { IReminder } from "@/components/modals/Reminder";
import { PlusCircle, Clock } from "lucide-react";

// Status colors and stages...
const STAGES: (keyof typeof STATUS_COLORS)[] = [
    "Prescribed",
    "First Checkup",
    "Second Checkup",
    "Regular Tests",
    "Recovered",
];

const STATUS_COLORS = {
    "Prescribed": "bg-amber-100 border-amber-300",
    "First Checkup": "bg-blue-100 border-blue-300",
    "Second Checkup": "bg-purple-100 border-purple-300",
    "Regular Tests": "bg-emerald-100 border-emerald-300",
    "Recovered": "bg-green-100 border-green-300",
};

export default function ReminderBoard() {
    const [reminders, setReminders] = useState<IReminder[]>([]);
    const [input, setInput] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [isMobile, setIsMobile] = useState(false); // To track if it's mobile

    useEffect(() => {
        setIsMobile(window.innerWidth <= 768 || 'ontouchstart' in window); // Check for mobile device
        setLoading(true);
        fetch("/api/reminders")
            .then((res) => {
                if (!res.ok) throw new Error("Failed to fetch reminders");
                return res.json();
            })
            .then((data) => {
                setReminders(data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                setError("Failed to load reminders. Please try again.");
                setLoading(false);
            });
    }, []);

    const updateReminderStage = async (id: string, newStage: string) => {
        const reminder = reminders.find((r) => r._id === id);
        if (!reminder || reminder.status === newStage) return;

        const updated = { ...reminder, status: newStage };

        // Optimistic update
        setReminders((prev) => prev.map((r) => (r._id === id ? updated : r)));

        try {
            const res = await fetch(`/api/reminders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });

            if (!res.ok) {
                // Revert if failed
                setReminders((prev) => prev.map((r) => (r._id === id ? reminder : r)));
                setError("Failed to update reminder status. Please try again.");
            }
        } catch (error) {
            console.error("Error updating reminder:", error);
            // Revert on error
            setReminders((prev) => prev.map((r) => (r._id === id ? reminder : r)));
            setError("Failed to connect to server. Please check your connection.");
        }
    };

    const addReminder = async () => {
        if (!input.trim()) {
            setError("Please enter reminder text");
            return;
        }

        const newReminder = {
            text: input,
            time,
            status: "Prescribed",
        };

        try {
            const res = await fetch("/api/reminders", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(newReminder),
            });

            if (res.ok) {
                const saved = await res.json();
                setReminders((prev) => [...prev, saved]);
                setInput("");
                setTime("");
                setError("");
            } else {
                setError("Failed to add reminder. Please try again.");
            }
        } catch (error) {
            console.error("Error adding reminder:", error);
            setError("Failed to connect to server. Please check your connection.");
        }
    };

    const deleteReminder = async (id: string) => {
        const confirmation = window.confirm("Are you sure you want to delete this reminder?");
        if (!confirmation) return;

        const deletedReminder = reminders.find((r) => r._id === id);
        if (!deletedReminder) return;

        // Optimistic delete
        setReminders((prev) => prev.filter((r) => r._id !== id));

        try {
            const res = await fetch(`/api/reminders/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                // Revert if failed
                setReminders((prev) => [...prev, deletedReminder]);
                setError("Failed to delete reminder. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting reminder:", error);
            // Revert on error
            setReminders((prev) => [...prev, deletedReminder]);
            setError("Failed to connect to server. Please check your connection.");
        }
    };

    return (
        <DndProvider backend={isMobile ? TouchBackend : HTML5Backend}> {/* Use mobile backend */}
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-white">Patient Treatment Tracker</h1>

                {/* Error alert */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                        <span className="block sm:inline">{error}</span>
                        <button
                            className="absolute top-0 right-0 px-4 py-3"
                            onClick={() => setError("")}
                        >
                            <span className="text-xl">&times;</span>
                        </button>
                    </div>
                )}

                {/* Input section with improved styling */}
                <div className="bg-white shadow-md rounded-lg p-4 mb-8">
                    <h2 className="text-lg font-semibold mb-3 text-gray-700">Add New Reminder</h2>
                    <div className="flex flex-col md:flex-row gap-3">
                        <div className="relative flex-grow">
                            <input
                                className="border border-gray-300 p-3 rounded-lg text-gray-800 w-full pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                placeholder="Enter reminder text..."
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                            />
                            <PlusCircle className="absolute left-3 top-3 text-gray-400" size={20} />
                        </div>

                        <div className="relative">
                            <input
                                type="time"
                                className="border border-gray-300 p-3 rounded-lg text-gray-800 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                value={time}
                                onChange={(e) => setTime(e.target.value)}
                            />
                            <Clock className="absolute left-3 top-3 text-gray-400" size={20} />
                        </div>

                        <button
                            onClick={addReminder}
                            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                            Add Reminder
                        </button>
                    </div>
                </div>

                {/* Loading state */}
                {loading ? (
                    <div className="flex justify-center my-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {STAGES.map((stage: keyof typeof STATUS_COLORS) => (
                            <div key={stage} className={`rounded-lg ${STATUS_COLORS[stage]} p-4 shadow-sm`}>
                                <h3 className="font-semibold text-gray-800 mb-3 text-center">{stage}</h3>
                                <DroppableColumn
                                    stage={stage}
                                    reminders={reminders.filter((r) => r.status === stage)}
                                    onDrop={(id: string) => updateReminderStage(id, stage)}
                                    columnColor={STATUS_COLORS[stage]}
                                    onDelete={deleteReminder} // Make sure to pass this properly
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DndProvider>
    );
}
