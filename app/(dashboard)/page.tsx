"use client"

import React, { useEffect, useRef, useState } from 'react';
import Typed from 'typed.js';
import { motion } from 'framer-motion';

interface FeatureItem {
    title: string;
    icon: string;
    items: string[];
    color: string;
}

export default function Home() {
    const typedJsRef = useRef<HTMLSpanElement>(null);
    const [activeTab, setActiveTab] = useState<number>(0);

    useEffect(() => {
        if (!typedJsRef.current) return;
        
        const typed = new Typed(typedJsRef.current, {
            strings: ['MedicalRx', 'Your Health AI', 'Virtual Doctor'],
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

    // Data for feature cards with added icons
    const features: FeatureItem[] = [
        {
            title: "Diagnosis",
            icon: "🔍",
            items: [
                "AI-powered symptom analysis to detect possible medical conditions.",
                "Confidence-based illness detection with refinement options.",
                "User-friendly interface to input symptoms and receive real-time insights."
            ],
            color: "#3b82f6" // Updated blue
        },
        {
            title: "Prescription",
            icon: "📝",
            items: [
                "Personalized drug recommendations based on diagnosis.",
                "Detailed medication insights, including dosage, side effects, and interactions.",
                "AI-driven alternative medicine suggestions.",
                "Contraindication alerts based on user medical history."
            ],
            color: "#ef4444" // Updated red
        },
        {
            title: "Navigation",
            icon: "🏥",
            items: [
                "Google Maps integration for locating nearby hospitals, clinics, and pharmacies.",
                "Real-time medicine availability tracking in partner pharmacies.",
                "Specialization-based filters for finding relevant healthcare professionals.",
                "One-click navigation to the nearest medical facility."
            ],
            color: "#10b981" // Updated green
        },
        {
            title: "Consultation",
            icon: "",
            items: [
                "Virtual doctor consultation for real-time medical advice.",
                "AI chatbot for instant answers to basic medical queries.",
                "Secure patient history storage for personalized treatment recommendations.",
                "Prescription reminders and scheduled follow-ups."
            ],
            color: "" // Updated purple
        },
        {
            title: "Recovery",
            icon: "📊",
            items: [
                "Medication reminders for timely drug intake.",
                "Progress tracking with symptom logging post-treatment.",
                "Drag-and-drop functionality to upload and manage medical reports.",
                "Upload drug prescription with time for reminders."
            ],
            color: "#f59e0b" // Updated orange
        }
    ];

    const benefits: { icon: string; text: string }[] = [
        { icon: "🧠", text: "AI-powered medical insights for faster diagnosis." },
        { icon: "💊", text: "Personalized drug recommendations with safety checks." },
        { icon: "🗺️", text: "Seamless integration with Google Maps for easy access to medical facilities." },
        { icon: "🔒", text: "Secure and private virtual consultations." },
        { icon: "📱", text: "Smart tracking to improve medication adherence and recovery." }
    ];

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                when: "beforeChildren",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#] via-blue-900 to-gray-900 text-white">
            {/* Hero Section with Particles Background */}
            <div className="relative overflow-hidden">
                {/* Animated circles in background */}
                <div className="absolute inset-0 overflow-hidden">
                    {[...Array(20)].map((_, i) => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full bg-blue-500 opacity-10"
                            style={{
                                width: Math.random() * 100 + 50,
                                height: Math.random() * 100 + 50,
                                left: `${Math.random() * 100}%`,
                                top: `${Math.random() * 100}%`,
                            }}
                            animate={{
                                y: [0, Math.random() * 100 - 50],
                                x: [0, Math.random() * 100 - 50],
                            }}
                            transition={{
                                repeat: Infinity,
                                repeatType: "reverse",
                                duration: Math.random() * 10 + 20,
                            }}
                        />
                    ))}
                </div>

                {/* Hero Content */}
                <div className="container mx-auto px-6 pt-16 pb-24 text-center">
                    <motion.h1
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-4xl md:text-6xl font-bold mb-6"
                    >
                        <span ref={typedJsRef} className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"></span>
                    </motion.h1>
                    
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.8 }}
                        className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto mb-10"
                    >
                        Advanced AI-powered medical assistance that helps you diagnose, prescribe, and recover faster.
                    </motion.p>
                    
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.8 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <motion.button
                            className="bg-gradient-to-r from-blue-600 to-indigo-600 px-8 py-3 rounded-xl font-bold shadow-lg"
                            whileHover={{ scale: 1.05, boxShadow: "0 0 15px rgba(59, 130, 246, 0.5)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Start Diagnosis
                        </motion.button>
                        <motion.button
                            className="bg-transparent border-2 border-blue-400 px-8 py-3 rounded-xl font-bold"
                            whileHover={{ scale: 1.05, backgroundColor: "rgba(59, 130, 246, 0.1)" }}
                            whileTap={{ scale: 0.95 }}
                        >
                            Learn More
                        </motion.button>
                    </motion.div>
                </div>
            </div>

            {/* Main Content with Glass Morphism */}
            <div className="container mx-auto px-4 py-16">
                {/* Features Tab Navigation */}
                <div className="mb-16 max-w-4xl mx-auto">
                    <motion.h2
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="text-3xl font-bold text-center mb-12"
                    >
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Comprehensive Healthcare Features
                        </span>
                    </motion.h2>
                    
                    <motion.div
                        className="flex flex-wrap justify-center gap-2 md:gap-4 mb-8"
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {features.map((feature, index) => (
                            <motion.button
                                key={index}
                                variants={itemVariants}
                                className={`px-4 py-2 md:px-6 md:py-3 rounded-full font-medium transition-all duration-300 flex items-center ${
                                    activeTab === index
                                        ? "bg-white text-blue-900 shadow-lg"
                                        : "bg-blue-900 bg-opacity-30 hover:bg-opacity-50 backdrop-blur-sm"
                                }`}
                                onClick={() => setActiveTab(index)}
                            >
                                <span className="mr-2">{feature.icon}</span>
                                {feature.title}
                            </motion.button>
                        ))}
                    </motion.div>

                    {/* Feature Content */}
                    <div className="bg-gradient-to-r from-[#06116f] to-purple-700 bg-opacity-10 backdrop-blur-md rounded-2xl p-6 shadow-xl">
                        {features.map((feature, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ 
                                    opacity: activeTab === index ? 1 : 0,
                                    x: activeTab === index ? 0 : 20,
                                    display: activeTab === index ? "block" : "none"
                                }}
                                transition={{ duration: 0.5 }}
                            >
                                <div className="flex items-center mb-6">
                                    <h3 className="text-2xl font-bold">{feature.title}</h3>
                                </div>
                                
                                <ul className="space-y-4">
                                    {feature.items.map((item, i) => (
                                        <motion.li 
                                            key={i}
                                            className="flex items-start"
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: i * 0.1 }}
                                        >
                                            <div className="h-6 w-6 rounded-full bg-white bg-opacity-20 flex items-center justify-center mr-3 mt-0.5 flex-shrink-0">
                                                <span className="text-black text-sm">✓</span>
                                            </div>
                                            <p className="text-blue-100">{item}</p>
                                        </motion.li>
                                    ))}
                                </ul>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Benefits Section with Cards */}
                <motion.div
                    className="max-w-5xl mx-auto my-24"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl font-bold text-center mb-12">
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                            Why Choose MedicalRx?
                        </span>
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {benefits.map((benefit, index) => (
                            <motion.div
                                key={index}
                                className="bg-gradient-to-r from-[#06116f] to-purple-700 rounded-xl p-6 shadow-lg"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ 
                                    y: -5,
                                    boxShadow: "0px 10px 30px rgba(59, 130, 246, 0.3)"
                                }}
                            >
                                <div className="h-14 w-14 bg-transparent bg-opacity-20 rounded-full flex items-center justify-center mb-4 text-2xl">
                                    {benefit.icon}
                                </div>
                                <p className="text-blue-100">{benefit.text}</p>
                            </motion.div>
                        ))}
                    </div>
                </motion.div>

                {/* CTA Section */}
                <motion.div
                    className="max-w-4xl mx-auto text-center my-24 bg-gradient-to-r from-[#06116f] to-purple-700 rounded-3xl p-10 shadow-2xl"
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                >
                    <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Take Control of Your Health?</h2>
                    <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                        Join <strong>MedicalRx</strong> today and experience the future of healthcare with our cutting-edge AI assistance.
                    </p>
                    <motion.button
                        className="bg-white text-blue-700 px-8 py-4 rounded-xl font-bold shadow-lg flex items-center mx-auto"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <span className="mr-2">Get Started Free</span>
                        <span>→</span>
                    </motion.button>
                </motion.div>
            </div>

            {/* Footer */}
            <footer className="bg-gray-900 py-10">
                <div className="container mx-auto px-6">
                    <div className="flex flex-col md:flex-row justify-between items-center">
                        <div className="flex items-center mb-6 md:mb-0">
                            <div className="h-10 w-10 bg-white rounded-full flex items-center justify-center mr-3">
                                <span className="text-blue-600 text-xl">⚕️</span>
                            </div>
                            <span className="text-xl font-bold">MedicalRx</span>
                        </div>
                        <div className="flex space-x-4 mb-6 md:mb-0">
                            {["Facebook", "Twitter", "Instagram", "LinkedIn"].map((social, index) => (
                                <a key={index} href="#" className="text-gray-400 hover:text-white transition-colors duration-300">
                                    {social}
                                </a>
                            ))}
                        </div>
                        <p className="text-gray-400 text-sm">© 2025 MedicalRx. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
