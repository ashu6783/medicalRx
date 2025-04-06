"use client";

import { useEffect, useState } from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import { TouchBackend } from "react-dnd-touch-backend";
import DroppableColumn from "@/components/DroppableColumns";
import type { IReminder } from "@/components/modals/Reminder";
import { PlusCircle, Clock } from "lucide-react";
import { useUser } from "@clerk/nextjs"

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


const isMobileDevice =
    typeof window !== "undefined" &&
    (window.innerWidth <= 768 || "ontouchstart" in window);

const backendForDnd = isMobileDevice
    ? (manager: import("dnd-core").DragDropManager) =>
        TouchBackend(manager, { enableMouseEvents: true })
    : HTML5Backend;

export default function ReminderBoard() {
    const [reminders, setReminders] = useState<IReminder[]>([]);
    const [input, setInput] = useState("");
    const [time, setTime] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const { user } = useUser();

    useEffect(() => {
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
        setReminders((prev) => prev.map((r) => (r._id === id ? updated : r)));

        try {
            const res = await fetch(`/api/reminders/${id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(updated),
            });

            if (!res.ok) {
                setReminders((prev) => prev.map((r) => (r._id === id ? reminder : r)));
                setError("Failed to update reminder status. Please try again.");
            }
        } catch (error) {
            console.error("Error updating reminder:", error);
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

        setReminders((prev) => prev.filter((r) => r._id !== id));

        try {
            const res = await fetch(`/api/reminders/${id}`, {
                method: "DELETE",
            });

            if (!res.ok) {
                setReminders((prev) => [...prev, deletedReminder]);
                setError("Failed to delete reminder. Please try again.");
            }
        } catch (error) {
            console.error("Error deleting reminder:", error);
            setReminders((prev) => [...prev, deletedReminder]);
            setError("Failed to connect to server. Please check your connection.");
        }
    };

    return (
        <DndProvider backend={backendForDnd}>
            <div className="p-6 max-w-7xl mx-auto">
                <h1 className="text-2xl font-bold mb-6 text-white">Patient Treatment Tracker</h1>

                <p className="text-white font-bold pb-2 text-base sm:text-lg md:text-xl">
                    Welcome Back <span className="font-bold text-green-400">{user?.firstName ? `, ${user.firstName}` : ''} 👋</span>
                </p>

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

                <div className="flex flex-col">
                    <p className="text-white font-bold pb-3 text-base sm:text-lg md:text-xl">
                        Please drag and drop through the stages to update the reminders on kanban board!
                    </p>
                    <span className="text-green-400 font-bold pb-3 text-sm sm:text-base md:text-lg">
                        Hoping for your speedy recovery ❤️
                    </span>
                </div>


                {loading ? (
                    <div className="flex justify-center my-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                        {STAGES.map((stage) => (
                            <div
                                key={stage}
                                className={`rounded-lg ${STATUS_COLORS[stage]} p-4 shadow-sm`}
                            >
                                <h3 className="font-semibold text-gray-800 mb-3 text-center">
                                    {stage}
                                </h3>
                                <DroppableColumn
                                    stage={stage}
                                    reminders={reminders.filter((r) => r.status === stage)}
                                    onDrop={(id: string) => updateReminderStage(id, stage)}
                                    // columnColor={STATUS_COLORS[stage]}
                                    onDelete={deleteReminder}
                                />
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DndProvider>
    );
}
