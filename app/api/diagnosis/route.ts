import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { symptoms } = await req.json();

        if (!symptoms || symptoms.length === 0) {
            return NextResponse.json({ error: "Please provide symptoms." }, { status: 400 });
        }

        const prompt = `A patient reports the following symptoms: ${symptoms.join(", ")}.
        Based on medical knowledge, classify them into either 'common_issues' or 'severe_issues'. 
        Also, provide recommendations for each.
        Respond in JSON format like this (without markdown formatting):
        {
          "common_issues": [
            { "name": "Common Cold", "recommendation": "Drink fluids, rest, and take over-the-counter medication." },
            { "name": "Mild Allergy", "recommendation": "Take antihistamines and avoid allergens." }
          ],
          "severe_issues": [
            { "name": "Pneumonia", "recommendation": "Consult a doctor immediately and monitor oxygen levels." },
            { "name": "Heart Attack", "recommendation": "Seek emergency medical care immediately!" }
          ]
        }`;

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const responseText = result.response.text();

        const cleanedResponse = responseText.replace(/```json|```/g, "").trim();

        const aiResponse = JSON.parse(cleanedResponse || "{}");
        
        const diagnosis = [
            ...(aiResponse.common_issues || []).map((issue: { name: string; recommendation: string }) => ({
                ...issue,
                confidence: 0.6 + Math.random() * 0.2 // Random confidence between 0.6-0.8 for common issues
            })),
            ...(aiResponse.severe_issues || []).map((issue: { name: string; recommendation: string }) => ({
                ...issue,
                confidence: 0.8 + Math.random() * 0.2 // Random confidence between 0.8-1.0 for severe issues
            }))
        ];

        return NextResponse.json({ diagnosis });
    } catch (error) {
        console.error("Error fetching diagnosis:", error);
        return NextResponse.json({ error: "AI diagnosis failed." }, { status: 500 });
    }
}