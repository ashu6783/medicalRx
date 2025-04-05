"use client";

import { useState, useEffect } from "react";

type ReminderType = { _id: string; text: string; time?: string };

export default function Recovery() {
    const [reminders, setReminders] = useState<ReminderType[]>([]);
    const [input, setInput] = useState("");
    const [time, setTime] = useState("");
    const [showInfo, setShowInfo] = useState(true);

    const [editId, setEditId] = useState<string | null>(null);
    const [editText, setEditText] = useState("");
    const [editTime, setEditTime] = useState("");

    useEffect(() => {
        fetch("/api/reminders")
            .then(res => res.json())
            .then(data => setReminders(data))
            .catch(console.error);
    }, []);

    const addReminder = async () => {
        if (!input.trim()) return;

        const res = await fetch("/api/reminders", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: input.trim(), time }),
        });

        if (res.ok) {
            const newReminder = await res.json();
            setReminders(prev => [...prev, newReminder]);
            setInput("");
            setTime("");
        }
    };

    const deleteReminder = async (id: string) => {
        const res = await fetch(`/api/reminders/${id}`, {
            method: "DELETE",
        });

        if (res.ok) {
            setReminders(prev => prev.filter(reminder => reminder._id !== id));
        }
    };

    const startEdit = (reminder: ReminderType) => {
        setEditId(reminder._id);
        setEditText(reminder.text);
        setEditTime(reminder.time || "");
    };

    const cancelEdit = () => {
        setEditId(null);
        setEditText("");
        setEditTime("");
    };

    const updateReminder = async () => {
        if (!editId || !editText.trim()) return;

        const res = await fetch(`/api/reminders/${editId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text: editText.trim(), time: editTime }),
        });

        if (res.ok) {
            const updated = await res.json();
            setReminders(prev =>
                prev.map(r => (r._id === updated._id ? updated : r))
            );
            cancelEdit();
        }
    };

    return (
        <div className="max-w-md mx-auto mt-6 p-6 bg-gray-100 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-center">💊 Prescription Reminders</h2>

            <div className="flex flex-col sm:flex-row gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="border p-2 flex-grow rounded"
                    placeholder="Enter reminder..."
                />
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className="border p-2 rounded"
                />
                <button
                    onClick={addReminder}
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                    Add
                </button>
            </div>

            <label className="flex items-center mt-4">
                <input
                    type="checkbox"
                    checked={showInfo}
                    onChange={() => setShowInfo(prev => !prev)}
                    className="mr-2"
                />
                Show additional drug usage info
            </label>

            {reminders.length === 0 ? (
                <p className="text-gray-500 mt-6 text-center">No reminders yet. Add one to get started!</p>
            ) : (
                <ul className="mt-4 space-y-2">
                    {reminders.map((reminder) => (
                        <li
                            key={reminder._id}
                            className="p-3 bg-white border rounded-md"
                        >
                            {editId === reminder._id ? (
                                <div className="flex flex-col gap-2">
                                    <input
                                        type="text"
                                        value={editText}
                                        onChange={(e) => setEditText(e.target.value)}
                                        className="border p-2 rounded"
                                    />
                                    <input
                                        type="time"
                                        value={editTime}
                                        onChange={(e) => setEditTime(e.target.value)}
                                        className="border p-2 rounded"
                                    />
                                    <div className="flex gap-2">
                                        <button
                                            onClick={updateReminder}
                                            className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={cancelEdit}
                                            className="bg-gray-300 px-3 py-1 rounded hover:bg-gray-400"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="flex justify-between items-start">
                                    <div>
                                        <p className="font-medium">{reminder.text}</p>
                                        {reminder.time && (
                                            <p className="text-sm text-gray-500">⏰ {reminder.time}</p>
                                        )}
                                        {showInfo && (
                                            <p className="text-sm text-gray-500 mt-1">
                                                💡 Tip: Take this with food to avoid nausea.
                                            </p>
                                        )}
                                    </div>
                                    <div className="flex flex-col gap-1 ml-4">
                                        <button
                                            onClick={() => startEdit(reminder)}
                                            className="text-blue-600 text-sm hover:underline"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => deleteReminder(reminder._id)}
                                            className="text-red-500 text-sm hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
