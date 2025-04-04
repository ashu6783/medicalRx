"use client";

import { useState } from "react";

export default function Consultation() {
    const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const sendMessage = async () => {
        if (!input.trim()) return;

        setMessages((prev) => [...prev, { text: input, sender: "user" }]);
        setInput("");
        setLoading(true);

        try {
            const res = await fetch("/api/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: input }),
            });

            const data = await res.json();
            setMessages((prev) => [...prev, { text: data.response, sender: "ai" }]);
        } catch (error) {
            console.error("Error fetching consultation response:", error);
            setMessages((prev) => [...prev, { text: "Error getting response", sender: "ai" }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-xl font-bold mb-4">AI Medical Consultation 🤖</h1>

            <div className="h-64 overflow-y-auto border p-3 mb-3">
                {messages.map((msg, index) => (
                    <p
                        key={index}
                        className={`p-2 rounded-md ${msg.sender === "user" ? "bg-blue-100 text-right" : "bg-gray-100 text-left"
                            }`}
                    >
                        {msg.text}
                    </p>
                ))}
            </div>

            <div className="flex">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="flex-grow border p-2 rounded-md"
                    placeholder="Ask about your symptoms..."
                />
                <button
                    onClick={sendMessage}
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded-md"
                    disabled={loading}
                >
                    {loading ? "Thinking..." : "Send"}
                </button>
            </div>
        </div>
    );
}
