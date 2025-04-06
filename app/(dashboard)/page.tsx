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
        // Reduce particle count on mobile for better performance
        const isMobile = window.innerWidth < 768;
        const particleCount = isMobile ? 1000 : 2000;

        const temp = new Float32Array(particleCount * 3);
        for (let i = 0; i < particleCount; i++) {
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
    // Removed unused isMobile state and associated logic

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

            <div className="relative z-10 flex flex-col min-h-screen p-4 md:p-8 w-full">
                <header className="mb-6 md:mb-12 text-center mt-4 md:mt-8">
                    <h1 className="text-white text-3xl md:text-5xl font-bold mb-2 md:mb-4">
                        <span ref={typedJsRef}></span>
                    </h1>
                    <p className="text-white font-semibold text-lg md:text-xl">
                        AI-Powered Medical Assistance
                    </p>
                </header>

                <div className="max-w-4xl mx-auto w-full px-2 md:px-0">
                    <section className="overflow-hidden">
                        <div className="bg-gray-200 bg-opacity-90 p-4 md:p-8 rounded-lg shadow-md backdrop-blur-sm">
                            <div className="mb-6 md:mb-8">
                                <h2 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-2 px-4 md:py-3 md:px-8 rounded-full transition duration-300 mb-2 mr-2 text-sm md:text-base inline-block">Overview</h2>
                                <p className="text-gray-700 text-sm md:text-base">
                                    <strong className='text-black font-semibold'>MedicalRx</strong> is an advanced AI-powered medical assistant designed to help users analyze symptoms,
                                    receive drug recommendations, locate nearby medical facilities, consult with healthcare professionals,
                                    and track their recovery journey. By leveraging artificial intelligence and real-time data,
                                    MedicalRx simplifies healthcare decision-making and enhances medical accessibility.
                                </p>
                                <p className="text-gray-700 text-sm md:text-base mt-2">
                                    <strong>Things this application can offer you:</strong>
                                </p>
                            </div>

                            <div className='border-b border-gray-300 mb-5 md:mb-7'></div>

                            {/* Feature sections with improved mobile layout */}
                            {[
                                {
                                    title: "🔍 Diagnosis",
                                    items: [
                                        "AI-powered symptom analysis to detect possible medical conditions.",
                                        "Confidence-based illness detection with refinement options.",
                                        "User-friendly interface to input symptoms and receive real-time insights."
                                    ]
                                },
                                {
                                    title: "📝 Prescription",
                                    items: [
                                        "Personalized drug recommendations based on diagnosis.",
                                        "Detailed medication insights, including dosage, side effects, and interactions.",
                                        "AI-driven alternative medicine suggestions.",
                                        "Contraindication alerts based on user medical history."
                                    ]
                                },
                                {
                                    title: "🏥 Navigation",
                                    items: [
                                        "Google Maps integration for locating nearby hospitals, clinics, and pharmacies.",
                                        "Real-time medicine availability tracking in partner pharmacies.",
                                        "Specialization-based filters for finding relevant healthcare professionals.",
                                        "One-click navigation to the nearest medical facility.",
                                        "OSM for offline map access.",
                                        "Location-based services for personalized healthcare recommendations."
                                    ]
                                },
                                {
                                    title: "📞 Consultation",
                                    items: [
                                        "Virtual doctor consultation for real-time medical advice.",
                                        "AI chatbot for instant answers to basic medical queries.",
                                        "Secure patient history storage for personalized treatment recommendations.",
                                        "Prescription reminders and scheduled follow-ups.",
                                        "Redis for handling rate-limited requests."
                                    ]
                                },
                                {
                                    title: "📊 Recovery",
                                    items: [
                                        "Medication reminders for timely drug intake.",
                                        "Progress tracking with symptom logging post-treatment.",
                                        "Drag-and-drop functionality to upload and manage medical reports.",
                                        "Upload drug prescription with time for reminders.",
                                        "Kanban board for managing recovery stages."
                                    ]
                                }
                            ].map((feature, index) => (
                                <React.Fragment key={index}>
                                    <div className="mb-5 md:mb-6">
                                        <h3 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-2 px-4 md:py-3 md:px-8 rounded-full transition duration-300 mb-2 text-sm md:text-base inline-block">{feature.title}</h3>
                                        <ul className="list-disc pl-5 md:pl-6 text-gray-700 text-sm md:text-base space-y-1">
                                            {feature.items.map((item, i) => (
                                                <li key={i}>{item}</li>
                                            ))}
                                        </ul>
                                    </div>
                                    <div className='border-b border-gray-300 mb-5 md:mb-7'></div>
                                </React.Fragment>
                            ))}

                            <div className="mb-6 md:mb-8">
                                <h2 className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] text-white font-bold py-2 px-4 md:py-3 md:px-8 rounded-full transition duration-300 mb-3 text-sm md:text-base inline-block">💊 Why Choose MedicalRx?</h2>
                                <div className="flex flex-col space-y-2 text-gray-700 text-sm md:text-base">
                                    {[
                                        "AI-powered medical insights for faster diagnosis.",
                                        "Personalized drug recommendations with safety checks.",
                                        "Seamless integration with Google Maps for easy access to medical facilities.",
                                        "Secure and private virtual consultations.",
                                        "Smart tracking to improve medication adherence and recovery."
                                    ].map((benefit, index) => (
                                        <div key={index} className="flex items-start">
                                            <span className="text-green-500 mr-2 flex-shrink-0">⚕️</span>
                                            <p>{benefit}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="text-center">
                                <h2 className="text-xl md:text-2xl font-bold mb-3 md:mb-4">Get Started Today!</h2>
                                <p className="text-gray-700 mb-4 md:mb-6 text-sm md:text-base">
                                    Join <strong>MedicalRx</strong> and take control of your health with cutting-edge AI assistance.
                                    Whether you need a quick diagnosis, drug information, or medical guidance,
                                    <strong> MedicalRx</strong> is your go-to healthcare companion.
                                </p>
                                <button className="bg-gradient-to-r from-[#12122b] to-[#0e0e1d] hover:from-[#1e1e46] hover:to-[#1a1a36] text-white font-bold py-2 px-6 md:py-3 md:px-8 rounded-full transition duration-300 text-sm md:text-base">
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