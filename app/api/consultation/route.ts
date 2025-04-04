import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini API with API key
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { message } = await req.json();

        if (!message || message.trim().length === 0) {
            return NextResponse.json({ error: "Please provide a valid message." }, { status: 400 });
        }

        const prompt = `You are a healthcare AI chatbot. Answer the following query in a helpful and concise manner:
        "${message}"
        Provide medically relevant advice in a professional yet simple-to-understand tone.`;

        // Call Gemini API
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent({ contents: [{ role: "user", parts: [{ text: prompt }] }] });

        // Extract response text properly
        const responseText = result?.response?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            throw new Error("No response from AI.");
        }

        return NextResponse.json({ response: responseText.trim() });
    } catch (error) {
        console.error("Error in chatbot response:", error);
        return NextResponse.json({ error: "AI chatbot failed to generate a response." }, { status: 500 });
    }
}
