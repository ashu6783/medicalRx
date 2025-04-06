import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Rate limit: store timestamps per IP
const rateLimitMap = new Map<string, number[]>();

const RATE_LIMIT = 5; // max requests
const TIME_WINDOW_MS = 60 * 1000; // 1 minute

const removeAsterisks = (text: string): string => {
    return text.replace(/\*/g, '').trim();
};

export async function POST(req: Request) {
    try {
        const ip = req.headers.get("x-forwarded-for") || "unknown";

        const now = Date.now();
        const timestamps = rateLimitMap.get(ip) || [];

        // Remove timestamps older than 1 min
        const recentTimestamps = timestamps.filter(ts => now - ts < TIME_WINDOW_MS);

        if (recentTimestamps.length >= RATE_LIMIT) {
            return NextResponse.json({
                error: "Rate limit exceeded. Please wait a minute before trying again."
            }, { status: 429 });
        }

        // Update the map with new timestamp
        recentTimestamps.push(now);
        rateLimitMap.set(ip, recentTimestamps);

        const { message } = await req.json();

        if (!message || message.trim().length === 0) {
            return NextResponse.json({ error: "Please provide a valid message." }, { status: 400 });
        }

        const prompt = `You are a healthcare AI chatbot. Answer the following query in a helpful and concise manner:
        "${message}"
        Provide medically relevant advice in a professional yet simple-to-understand tone.`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error("No response from AI.");
        }

        const cleanedResponseText = removeAsterisks(responseText);

        return NextResponse.json({ response: cleanedResponseText });

    } catch (error) {
        if (error instanceof Error && (error.message.includes('rate limit') || error.message.includes('quota'))) {
            return NextResponse.json({
                error: "We're currently experiencing high demand. Please try again after some time."
            }, { status: 429 });
        }

        console.error("Error in chatbot response:", error);
        return NextResponse.json({ error: "AI chatbot failed to generate a response." }, { status: 500 });
    }
}
