"use client"

import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as THREE from 'three';

function FloatingParticles() {
    const ref = useRef<THREE.Points>(null);
    const [positions, setPositions] = useState<Float32Array | null>(null);

    useEffect(() => {
        const temp = new Float32Array(6000);
        for (let i = 0; i < 2000; i++) {
            temp[i * 3] = (Math.random() - 0.5) * 25;
            temp[i * 3 + 1] = (Math.random() - 0.5) * 20;
            temp[i * 3 + 2] = (Math.random() - 0.5) * 20;
        }
        setPositions(temp);
    }, []);

    useFrame(() => {
        if (ref.current) {
            ref.current.rotation.x += 0.0005;
            ref.current.rotation.y += 0.0003;
        }
    });

    if (!positions) return null;

    return (
        <Points ref={ref} positions={positions} stride={3} frustumCulled={false}>
            <PointMaterial
                transparent
                color="#67e8f9"
                size={0.05}
                sizeAttenuation
                depthWrite={false}
                opacity={0.8}
            />
        </Points>
    );
}

export default function Home() {
    const typedJsRef = useRef(null);

    useEffect(() => {
        const typed = new Typed(typedJsRef.current, {
            strings: ['MedicalRx'],
            typeSpeed: 80,
            backSpeed: 50,
            backDelay: 1500,
            startDelay: 500,
            loop: true,
            showCursor: true,
            cursorChar: '⚕️',
        });

        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <>
            {/* Three.js background - fixed positioning */}
            <div className="fixed inset-0 w-full h-full bg-black" style={{ zIndex: 1 }}>
                <Canvas camera={{ position: [0, 0, 5], fov: 60 }}>
                    <color attach="background" args={["#000000"]} />
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 10, 10]} intensity={1} />
                    <FloatingParticles />
                </Canvas>
            </div>

            <div className="relative z-10 flex flex-col min-h-screen p-8 w-full" style={{ paddingTop: "25px" }}>
                <header className="mb-12 text-center">
                    <h1 className="text-white text-5xl font-bold mb-4">
                        <span ref={typedJsRef}></span>
                    </h1>
                    <p className="text-white font-semibold text-xl">
                        AI-Powered Medical Assistance
                    </p>
                </header>

                <div className="max-w-4xl mx-auto">
                    <section className="overflow-hidden">
                        <div className="bg-gray-200 bg-opacity-90 p-8 rounded-lg shadow-md backdrop-blur-sm">
                            <div className="mb-8">
                                <h2 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-3 px-8 rounded-full transition duration-300 mb-2 mr-2 w-fit">Overview</h2>
                                <p className="text-gray-700">
                                    <strong className='text-black font-semibold'>MedicalRx</strong> is an advanced AI-powered medical assistant designed to help users analyze symptoms,
                                    receive drug recommendations, locate nearby medical facilities, consult with healthcare professionals,
                                    and track their recovery journey. By leveraging artificial intelligence and real-time data,
                                    DrugLens simplifies healthcare decision-making and enhances medical accessibility.

                                    <strong>Things this application can offer you:</strong>
                                </p>
                            </div>

                            <div className='border-b border-gray-950 mb-7'></div>

                            <div className="mb-8">
                                <div className="mb-6">
                                    <h3 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-3 px-8 rounded-full transition duration-300 mb-2 mr-2 w-fit">🔍 Diagnosis</h3>
                                    <ul className="list-disc pl-6 text-gray-700">
                                        <li>AI-powered symptom analysis to detect possible medical conditions.</li>
                                        <li>Confidence-based illness detection with refinement options.</li>
                                        <li>User-friendly interface to input symptoms and receive real-time insights.</li>
                                    </ul>
                                </div>

                                <div className='border-b border-gray-950 mb-7'></div>

                                <div className="mb-6">
                                    <h3 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-3 px-8 rounded-full transition duration-300 mb-2 mr-2 w-fit" >📝 Prescription</h3>
                                    <ul className="list-disc pl-6 text-gray-700">
                                        <li>Personalized drug recommendations based on diagnosis.</li>
                                        <li>Detailed medication insights, including dosage, side effects, and interactions.</li>
                                        <li>AI-driven alternative medicine suggestions.</li>
                                        <li>Contraindication alerts based on user medical history.</li>
                                    </ul>
                                </div>

                                <div className='border-b border-gray-950 mb-7'></div>

                                <div className="mb-6">
                                    <h3 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-3 px-8 rounded-full transition duration-300 mb-2 mr-2 w-fit">🏥 Navigation</h3>
                                    <ul className="list-disc pl-6 text-gray-700">
                                        <li>Google Maps integration for locating nearby hospitals, clinics, and pharmacies.</li>
                                        <li>Real-time medicine availability tracking in partner pharmacies.</li>
                                        <li>Specialization-based filters for finding relevant healthcare professionals.</li>
                                        <li>One-click navigation to the nearest medical facility.</li>
                                    </ul>
                                </div>

                                <div className='border-b border-gray-950 mb-7'></div>

                                <div className="mb-6">
                                    <h3 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-3 px-8 rounded-full transition duration-300 mb-2 mr-2 w-fit">📞 Consultation</h3>
                                    <ul className="list-disc pl-6 text-gray-700">
                                        <li>Virtual doctor consultation for real-time medical advice.</li>
                                        <li>AI chatbot for instant answers to basic medical queries.</li>
                                        <li>Secure patient history storage for personalized treatment recommendations.</li>
                                        <li>Prescription reminders and scheduled follow-ups.</li>
                                    </ul>
                                </div>

                                <div className='border-b border-gray-950 mb-7'></div>

                                <div className="mb-6">
                                    <h3 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-3 px-8 rounded-full transition duration-300 mb-2 mr-2 w-fit">📊 Recovery</h3>
                                    <ul className="list-disc pl-6 text-gray-700">
                                        <li>Medication reminders for timely drug intake.</li>
                                        <li>Progress tracking with symptom logging post-treatment.</li>
                                        <li>AI-driven recovery predictions and insights.</li>
                                        <li>Easy report generation for doctor consultations.</li>
                                        <li>Drag-and-drop functionality to upload and manage medical reports, prescriptions, and test results.</li>
                                        <li>Organized document storage with secure access and preview options.</li>
                                        <li>Automatic parsing of uploaded medical documents for faster data extraction and history tracking.</li>
                                        <li>Smart file categorization: prescriptions, lab reports, imaging results, and discharge summaries.</li>
                                    </ul>
                                </div>

                                <div className='border-b border-gray-950 mb-7'></div>
                            </div>

                            <div className="mb-8">
                                <h2 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-3 px-8 rounded-full transition duration-300 mb-2 mr-2 w-fit">💊 Why Choose MedicalRx?</h2>
                                <div className="flex flex-col space-y-2 text-gray-700">
                                    <div className="flex items-start">
                                        <span className="text-green-500 mr-2">⚕️</span>
                                        <p>AI-powered medical insights for faster diagnosis.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-green-500 mr-2">⚕️</span>
                                        <p>Personalized drug recommendations with safety checks.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-green-500 mr-2">⚕️</span>
                                        <p>Seamless integration with Google Maps for easy access to medical facilities.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-green-500 mr-2">⚕️</span>
                                        <p>Secure and private virtual consultations.</p>
                                    </div>
                                    <div className="flex items-start">
                                        <span className="text-green-500 mr-2">⚕️</span>
                                        <p>Smart tracking to improve medication adherence and recovery.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-2xl font-bold mb-4">Get Started Today!</h2>
                                <p className="text-gray-700 mb-6">
                                    Join <strong>MedicalRx</strong> and take control of your health with cutting-edge AI assistance.
                                    Whether you need a quick diagnosis, drug information, or medical guidance,
                                    <strong>MedicalRx</strong> is your go-to healthcare companion.
                                </p>
                                <button className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-3 px-8 rounded-full transition duration-300">
                                    Take Care! ❤️
                                </button>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </>
    );
}