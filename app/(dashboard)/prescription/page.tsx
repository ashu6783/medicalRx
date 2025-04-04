"use client";

import { useState } from "react";

interface Prescription {
    name: string;
    dosage: string;
    sideEffects?: string[];
    alternatives?: string[];
    contraindications?: string[];
}

export default function Prescription() {
    const [prescription, setPrescription] = useState<Prescription | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [diagnosis, setDiagnosis] = useState("");

    const fetchPrescription = async () => {
        if (!diagnosis.trim()) {
            setError("Please enter a diagnosis");
            return;
        }

        setLoading(true);
        setError("");

        try {
            const response = await fetch("/api/prescription", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ diagnosis })
            });

            if (!response.ok) throw new Error("Failed to fetch prescription");

            const data: Prescription = await response.json();
            setPrescription(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError("Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h1 className="text-xl font-bold mb-4">Prescription 💊</h1>

            <div className="mb-4">
                <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700 mb-1">
                    Enter Diagnosis
                </label>
                <input
                    type="text"
                    id="diagnosis"
                    value={diagnosis}
                    onChange={(e) => setDiagnosis(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Migraine, Hypertension, etc."
                />
            </div>

            <button
                onClick={fetchPrescription}
                disabled={loading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
            >
                {loading ? "Fetching..." : "Get Prescription"}
            </button>

            {error && <p className="text-red-500 mt-4">{error}</p>}

            {prescription && (
                <div className="mt-6 p-4 border rounded-md bg-gray-50">
                    <h2 className="font-semibold text-lg">{prescription.name}</h2>
                    <p className="text-gray-600"><strong>Dosage:</strong> {prescription.dosage}</p>

                    {/* Side Effects */}
                    <div className="text-gray-600 mt-2">
                        <strong>Side Effects:</strong>
                        {prescription.sideEffects?.length ? (
                            <ul className="list-disc ml-5 mt-1">
                                {prescription.sideEffects.map((effect, index) => (
                                    <li key={index}>{effect}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Not available</p>
                        )}
                    </div>

                    {/* Alternatives */}
                    <div className="text-gray-600 mt-2">
                        <strong>Alternatives:</strong>
                        {prescription.alternatives?.length ? (
                            <ul className="list-disc ml-5 mt-1">
                                {prescription.alternatives.map((alt, index) => (
                                    <li key={index}>{alt}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Not available</p>
                        )}
                    </div>

                    {/* Contraindications */}
                    <div className="text-gray-600 mt-2">
                        <strong>Contraindications:</strong>
                        {prescription.contraindications?.length ? (
                            <ul className="list-disc ml-5 mt-1">
                                {prescription.contraindications.map((contra, index) => (
                                    <li key={index}>{contra}</li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-500">Not available</p>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
