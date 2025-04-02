"use client"

import React, { useEffect, useRef } from 'react';
import Typed from 'typed.js';

export default function Home() {
    // Create a reference for the element where Typed.js will be initialized
    const typedJsRef = useRef(null);

    useEffect(() => {
        // Initialize Typed.js once the component mounts
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

        // Clean up the Typed instance on component unmount
        return () => {
            typed.destroy();
        };
    }, []);

    return (
        <div className="flex flex-col justify-center min-h-screen p-8 bg-gradient-to-r from-[#12122b] to-[#0e0e1d]">
            <header className="mb-12 text-center ">
                <h1 className="text-white text-5xl font-bold mb-4">
                    <span ref={typedJsRef}></span>
                </h1>
                <p className="text-white font-semibold text-xl">
                    AI-Powered Medical Assistance
                </p>
            </header>

            <section className="max-w-4xl mx-auto bg-gray-200 p-8 rounded-lg shadow-md">
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
                    {/* <h2 className="text-2xl font-bold mb-8 ">Capsules:</h2> */}

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
            </section>
        </div>
    );
}