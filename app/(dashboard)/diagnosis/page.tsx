"use client";
import { useState } from "react";

interface DiagnosisIssue {
    name: string;
    recommendation: string;
    confidence: number; // Confidence score for refinement options
}

export default function DiagnosisPage() {
    const [symptoms, setSymptoms] = useState<string[]>([]);
    const [input, setInput] = useState("");
    const [diagnosisResults, setDiagnosisResults] = useState<DiagnosisIssue[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAddSymptom = () => {
        if (input.trim() && !symptoms.includes(input.trim())) {
            setSymptoms([...symptoms, input.trim()]);
            setInput("");
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleAddSymptom();
        }
    };

    const handleRemoveSymptom = (symptomToRemove: string) => {
        setSymptoms(symptoms.filter(symptom => symptom !== symptomToRemove));
    };

    const handleDiagnose = async () => {
        try {
            setLoading(true);
            const res = await fetch("/api/diagnosis", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ symptoms })
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setDiagnosisResults(data.diagnosis || []);
        } catch (error) {
            console.error("Diagnosis error:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-xl font-bold mb-4">AI-Powered Symptom Diagnosis 🤒🔍</h1>
            <p className="text-sm text-gray-600 mb-4">
                Enter symptoms to receive AI-based medical insights with confidence scores.
            </p>
            <div className="flex gap-2 mb-4">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Enter a symptom..."
                    className="border p-2 w-full rounded-md"
                    aria-label="Symptom input"
                />
                <button
                    onClick={handleAddSymptom}
                    className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
                    aria-label="Add symptom"
                >
                    Add
                </button>
            </div>

            {symptoms.length > 0 && (
                <div className="mt-3 mb-4">
                    {symptoms.map((symptom, index) => (
                        <span
                            key={index}
                            className="inline-flex items-center bg-gray-200 px-3 py-1 rounded-full text-sm mr-2 mb-2"
                        >
                            {symptom}
                            <button
                                onClick={() => handleRemoveSymptom(symptom)}
                                className="ml-2 text-gray-500 hover:text-red-500 focus:outline-none"
                                aria-label={`Remove ${symptom}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
            )}

            <button
                onClick={handleDiagnose}
                disabled={loading || symptoms.length === 0}
                className={`w-full px-4 py-2 rounded-md text-white ${symptoms.length === 0 || loading
                        ? "bg-gray-400 cursor-not-allowed"
                        : "bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-300"
                    }`}
            >
                {loading ? "Analyzing..." : "Diagnose"}
            </button>

            {diagnosisResults.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-md">
                    <h2 className="font-semibold text-lg mb-2">Diagnosis Results:</h2>
                    <ul className="space-y-3">
                        {diagnosisResults.map((issue, index) => (
                            <li key={index} className="pb-2 border-b border-gray-200 last:border-0">
                                <div className="font-semibold text-md">{issue.name}</div>
                                <div className="text-sm mt-1">{issue.recommendation}</div>
                                <div className="flex items-center mt-2">
                                    <div className="w-full bg-gray-200 rounded-full h-2">
                                        <div
                                            className="bg-blue-600 h-2 rounded-full"
                                            style={{ width: `${Math.round(issue.confidence * 100)}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-xs text-gray-500 ml-2">
                                        {Math.round(issue.confidence * 100)}%
                                    </span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            <div className="mt-6 text-xs text-gray-500">
                <p>Note: This tool provides informational insights only and should not replace professional medical advice.</p>
            </div>
        </div>
    );
}