"use client";
import { useState } from "react";

export default function DiagnosisPage() {
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [commonIssues, setCommonIssues] = useState<{ name: string, recommendation: string }[]>([]);
    const [severeIssues, setSevereIssues] = useState<{ name: string, recommendation: string }[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAddSymptom = () => {
        if (input && !symptoms.includes(input)) {
            setSymptoms([...symptoms, input]);
            setInput("");
        }
    };

    const handleDiagnose = async () => {
        setLoading(true);
        const res = await fetch("/api/diagnosis", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ symptoms })
        });

        const data = await res.json();
        setCommonIssues(data.common_issues || []);
        setSevereIssues(data.severe_issues || []);
        setLoading(false);
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-xl font-bold mb-4">Symptom-Based Diagnosis</h1>
            <div className="flex gap-2">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enter a symptom..."
                    className="border p-2 w-full"
                />
                <button
                    onClick={handleAddSymptom}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md"
                >
                    Add
                </button>
            </div>
            <div className="mt-3">
                {symptoms.map((symptom, index) => (
                    <span key={index} className="inline-block bg-gray-200 px-3 py-1 rounded-full text-sm mr-2">
                        {symptom}
                    </span>
                ))}
            </div>
            <button
                onClick={handleDiagnose}
                disabled={loading || symptoms.length === 0}
                className="mt-4 w-full bg-green-500 text-white px-4 py-2 rounded-md"
            >
                {loading ? "Analyzing..." : "Diagnose"}
            </button>

            {(commonIssues.length > 0 || severeIssues.length > 0) && (
                <div className="mt-4">
                    <h2 className="font-semibold">Diagnosis Results:</h2>

                    {commonIssues.length > 0 && (
                        <div className="mt-3">
                            <h3 className="text-blue-600 font-medium">Common Issues:</h3>
                            <ul className="list-disc ml-5">
                                {commonIssues.map((issue, index) => (
                                    <li key={index}>
                                        <span className="font-semibold">{issue.name}</span>: {issue.recommendation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {severeIssues.length > 0 && (
                        <div className="mt-3">
                            <h3 className="text-red-600 font-medium">Severe Issues:</h3>
                            <ul className="list-disc ml-5">
                                {severeIssues.map((issue, index) => (
                                    <li key={index}>
                                        <span className="font-semibold">{issue.name}</span>: {issue.recommendation}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
