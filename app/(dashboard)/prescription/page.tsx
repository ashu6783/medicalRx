'use client';

import { useState } from 'react';

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
    const [error, setError] = useState('');
    const [diagnosis, setDiagnosis] = useState('');

    const fetchPrescription = async () => {
        if (!diagnosis.trim()) {
            setError('Please enter a diagnosis');
            return;
        }

        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/prescription', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ diagnosis }),
            });

            if (!response.ok) throw new Error('Failed to fetch prescription');

            const data: Prescription = await response.json();
            setPrescription(data);
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('Something went wrong');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto mt-12 px-4">
            <div className="bg-white shadow-xl rounded-xl p-6 space-y-6">
                <h1 className="text-2xl font-bold text-gray-800">Prescription Assistant 💊</h1>

                <div className="space-y-2">
                    <label htmlFor="diagnosis" className="block text-sm font-medium text-gray-700">
                        Enter Diagnosis
                    </label>
                    <input
                        type="text"
                        id="diagnosis"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                        placeholder="e.g., Migraine, Hypertension..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    onClick={fetchPrescription}
                    disabled={loading}
                    className="w-full py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition disabled:bg-blue-300"
                >
                    {loading ? 'Fetching...' : 'Get Prescription'}
                </button>

                {error && <p className="text-red-500">{error}</p>}

                {prescription && (
                    <div className="mt-6 p-5 bg-gray-50 rounded-xl border space-y-4">
                        <h2 className="text-xl font-semibold text-gray-800">{prescription.name}</h2>
                        <p className="text-gray-700">
                            <span className="font-medium">Dosage:</span> {prescription.dosage}
                        </p>

                        {/* Side Effects */}
                        <div>
                            <h3 className="font-medium text-gray-800">Side Effects</h3>
                            {prescription.sideEffects?.length ? (
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    {prescription.sideEffects.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Not available</p>
                            )}
                        </div>

                        {/* Alternatives */}
                        <div>
                            <h3 className="font-medium text-gray-800">Alternatives</h3>
                            {prescription.alternatives?.length ? (
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    {prescription.alternatives.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Not available</p>
                            )}
                        </div>

                        {/* Contraindications */}
                        <div>
                            <h3 className="font-medium text-gray-800">Contraindications</h3>
                            {prescription.contraindications?.length ? (
                                <ul className="list-disc list-inside text-gray-700 space-y-1">
                                    {prescription.contraindications.map((item, index) => (
                                        <li key={index}>{item}</li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-500">Not available</p>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
