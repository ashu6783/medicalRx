"use client";

import { AlertCircle, Mic } from "lucide-react";
import { useState, useEffect, useCallback, useRef } from "react";

export default function Consultation() {
    const [messages, setMessages] = useState<{ text: string; sender: "user" | "ai" }[]>([]);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [speechEnabled, setSpeechEnabled] = useState(false);
    const [speechLanguage, setSpeechLanguage] = useState<'en-US' | 'hindi'>('en-US');
    const [availableVoices, setAvailableVoices] = useState<SpeechSynthesisVoice[]>([]);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const messageContainerRef = useRef<HTMLDivElement>(null);

    const containsHindi = (text: string) => {
        const hindiRange = /[\u0900-\u097F]/;
        return hindiRange.test(text);
    };

    useEffect(() => {
        if ('speechSynthesis' in window) {
            setSpeechEnabled(true);
        } else {
            console.error('Speech Synthesis API not supported in this browser.');
        }
    }, []);
    useEffect(() => {
        if (!speechEnabled) return;

        const loadVoices = () => {
            const voices = window.speechSynthesis.getVoices();
            if (voices.length > 0) {
                setAvailableVoices(voices);
                console.log("Available voices:", voices.map(v => `${v.name} (${v.lang})`));
                const hindiVoices = voices.filter(v =>
                    v.lang === 'hi-IN' ||
                    v.lang.includes('hi') ||
                    v.name.toLowerCase().includes('hindi') ||
                    v.name.toLowerCase().includes('indian')
                );
                console.log("Hindi voices available:", hindiVoices.length, hindiVoices.map(v => `${v.name} (${v.lang})`));
            } else {
                console.log("No voices available yet");
                setTimeout(loadVoices, 500);
            }
        };

        // Chrome needs this event
        window.speechSynthesis.onvoiceschanged = loadVoices;
        loadVoices();

        const voiceCheckInterval = setTimeout(loadVoices, 1000);

        return () => clearTimeout(voiceCheckInterval);
    }, [speechEnabled]);

    // Scroll to bottom when messages change
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const readAloudResponse = useCallback((responseText: string, language: 'en-US' | 'hindi' = 'en-US') => {
        if (!speechEnabled) return;

        window.speechSynthesis.cancel();

        const speech = new SpeechSynthesisUtterance(responseText);
        if (containsHindi(responseText)) {
            language = 'hindi';
        }
        speech.lang = language === 'hindi' ? 'hi-IN' : 'en-US';
        speech.pitch = 1;
        speech.rate = 0.9;
        speech.volume = 1;

        const voices = availableVoices.length > 0 ? availableVoices : window.speechSynthesis.getVoices();

        if (language === 'hindi') {
            const hindiVoice = voices.find(voice =>
                voice.lang === 'hi-IN' ||
                voice.lang.includes('hi') ||
                voice.name.toLowerCase().includes('hindi') ||
                voice.name.toLowerCase().includes('indian')
            );

            if (hindiVoice) {
                speech.voice = hindiVoice;
                console.log("Using Hindi voice:", hindiVoice.name, hindiVoice.lang);
            } else {
                console.log("No Hindi voice found, using default");
                const fallbackVoices = voices.filter(v =>
                    v.lang.startsWith('hi') ||
                    v.name.includes('India') ||
                    v.name.includes('Google')
                );

                if (fallbackVoices.length > 0) {
                    speech.voice = fallbackVoices[0];
                    console.log("Using fallback voice:", speech.voice.name);
                }
            }
        } else {
            const englishVoice = voices.find(voice =>
                voice.lang === 'en-US' ||
                voice.lang.startsWith('en-')
            );

            if (englishVoice) {
                speech.voice = englishVoice;
                console.log("Using English voice:", englishVoice.name);
            }
        }

        speech.onstart = () => console.log(`Speech started in ${speech.lang} using voice ${speech.voice?.name || 'default'}`);
        speech.onend = () => console.log("Speech ended");
        speech.onerror = (event) => console.error("Speech error:", event);

        if (responseText.length > 200) {
            const sentences = responseText.match(/[^.!?]+[.!?]+/g) || [responseText];

            let sentenceIndex = 0;

            const speakNextSentence = () => {
                if (sentenceIndex < sentences.length) {
                    const currentSpeech = new SpeechSynthesisUtterance(sentences[sentenceIndex]);
                    currentSpeech.lang = speech.lang;
                    currentSpeech.voice = speech.voice;
                    currentSpeech.pitch = speech.pitch;
                    currentSpeech.rate = speech.rate;

                    currentSpeech.onend = () => {
                        sentenceIndex++;
                        speakNextSentence();
                    };

                    currentSpeech.onerror = (event) => console.error("Speech error:", event);

                    window.speechSynthesis.speak(currentSpeech);
                }
            };

            speakNextSentence();
        } else {
            // For shorter text, speak directly
            window.speechSynthesis.speak(speech);
        }
    }, [speechEnabled, availableVoices]);

    useEffect(() => {
        const latestMessage = messages[messages.length - 1];
        if (latestMessage && latestMessage.sender === "ai") {
            setTimeout(() => {
                readAloudResponse(latestMessage.text, speechLanguage);
            }, 100);
        }
    }, [messages, readAloudResponse, speechLanguage]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const userMessage = input.trim();
        setMessages((prev) => [...prev, { text: userMessage, sender: "user" }]);
        setInput("");
        setLoading(true);

        try {

            const useHindi = speechLanguage === 'hindi' || containsHindi(userMessage);

            const res = await fetch("/api/consultation", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: userMessage,
                    language: useHindi ? 'hindi' : 'english' // Send language preference to backend
                }),
            });

            const data = await res.json();

            if (!res.ok) {
                if (res.status === 429) {
                    setMessages((prev) => [...prev, {
                        text: "We're currently experiencing high demand. Please try again after some time.",
                        sender: "ai"
                    }]);
                } else {

                    setMessages((prev) => [...prev, {
                        text: data.error || "Sorry, I couldn't process your request. Please try again.",
                        sender: "ai"
                    }]);
                }
            } else {
                const aiResponse = data.response;
                setMessages((prev) => [...prev, { text: aiResponse, sender: "ai" }]);
            }
        } catch (error) {
            console.error("Error fetching consultation response:", error);
            setMessages((prev) => [...prev, { text: "Sorry, I couldn't process your request. Please try again.", sender: "ai" }]);
        } finally {
            setLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    useEffect(() => {
        if (input.trim().length > 0) {
            window.speechSynthesis.cancel();
        }
    }, [input]);

    return (
        <div className="h-screen flex flex-col bg-transparent">
            <header className="bg-transparent text-white shadow-sm p-4">
                <div className="max-w-4xl mx-auto flex items-center">
                    <svg className="w-8 h-8 text-green-300 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    <h1 className="text-2xl font-semibold text-white">AI Medical Consultation</h1>
                </div>
            </header>
            <main className="flex-grow flex flex-col max-w-4xl mx-auto w-full p-4 overflow-hidden">
                {!speechEnabled && (
                    <div className="mb-4 p-3 bg-transparent border border-green-300 rounded text-white text-center">
                        <AlertCircle className="inline-block mr-2" size={20} />
                        Speech synthesis is not available in your browser.
                    </div>
                )}

                {speechEnabled && availableVoices.length === 0 && (
                    <div className="mb-4 p-3 bg-transparent border border-yellow-300 rounded text-white text-center">
                        <AlertCircle className="inline-block mr-2" size={20} />
                        Loading voice options...
                    </div>
                )}

                <div
                    ref={messageContainerRef}
                    className="flex-grow overflow-y-auto bg-transparent shadow-sm mb-4"
                >
                    <div className="p-4">
                        {messages.length === 0 && (
                            <div className="text-center text-green-300 bg-black border rounded-xl border-green-300 py-8">
                                <svg className="w-12 h-8 mx-auto mb-3 text-green-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" />
                                </svg>
                                <p className="text-md lg:text-lg">Start your MedicalRx AI powered speech supported medical consultation by describing your symptoms or asking a health question.</p>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`mb-4 max-w-3/4 ${msg.sender === "user" ? "ml-auto" : "mr-auto"}`}
                            >
                                <div
                                    className={`p-3 rounded-lg ${msg.sender === "user"
                                        ? "text-white border bg-green-950 backdrop-blur-lg border-white rounded-br-none"
                                        : "text-white border bg-gray-600 border-green-400 rounded-bl-none"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                                <div className={`text-xs mt-1 text-white ${msg.sender === "user" ? "text-right" : "text-left"}`}>
                                    {msg.sender === "user" ? "You" : "AI Assistant"}
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="mb-4 max-w-3/4">
                                <div className="p-3 text-white rounded-lg rounded-bl-none">
                                    <div className="flex space-x-2">
                                        <div className="w-2 h-2 rounded-full bg-white animate-bounce"></div>
                                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                                        <div className="w-2 h-2 rounded-full bg-white animate-bounce" style={{ animationDelay: "0.4s" }}></div>
                                    </div>
                                </div>
                                <div className="text-xs mt-1 text-gray-500">AI Assistant</div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                </div>

                {speechEnabled && (
                    <div className="mb-3 flex items-center justify-between">
                        <button
                            onClick={() => {
                                const lastAiMessage = [...messages].reverse().find(m => m.sender === "ai");
                                if (lastAiMessage) {
                                    window.speechSynthesis.cancel();
                                    readAloudResponse(lastAiMessage.text, speechLanguage);
                                }
                            }}
                            className="flex items-center bg-transparent hover:bg-green-500 text-white px-4 py-2 rounded-lg transition"
                            disabled={!messages.some(m => m.sender === "ai")}
                        >
                            <Mic className="mr-2" size={20} />
                            Read Last Response
                        </button>

                        <div className="flex items-center">
                            <span className="text-white mr-2">Language:</span>
                            <select
                                value={speechLanguage}
                                onChange={(e) => {
                                    // Cancel any ongoing speech when language changes
                                    window.speechSynthesis.cancel();
                                    setSpeechLanguage(e.target.value as 'en-US' );
                                }}
                                className="bg-transparent text-white border border-gray-300 rounded-lg px-3 py-1"
                            >
                                <option value="en-US">English</option>
                                {/* <option value="hindi">Hindi</option> */}
                            </select>
                        </div>
                    </div>
                )}

                {/* Input area */}
                <div className="bg-transparent">
                    <div className="flex items-center">
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={handleKeyPress}
                            className="flex-grow text-white px-4 py-2 border border-gray-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            placeholder={speechLanguage === 'hindi' ? "अपने लक्षणों के बारे में पूछें..." : "Ask about your symptoms..."}
                            disabled={loading}
                        />
                        <button
                            onClick={sendMessage}
                            className={`px-4 py-2 rounded-r-lg transition ${loading ? "bg-gray-400" : "bg-green-600 hover:bg-green-700"
                                } text-white`}
                            disabled={loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing
                                </span>
                            ) : (
                                <span className="flex items-center">
                                    <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                    </svg>
                                    Send
                                </span>
                            )}
                        </button>
                    </div>
                </div>


                <button
                    onClick={() => window.speechSynthesis.cancel()}
                    className="mt-2 w-full bg-green-500 hover:bg-green-600 font-bold text-black px-4 py-2 rounded-lg transition"
                >
                    Stop Hearing!
                </button>
            </main>
        </div>
    );
}