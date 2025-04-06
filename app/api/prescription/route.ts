import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
    try {
        const { diagnosis } = await req.json();

        if (!diagnosis) {
            return NextResponse.json({ error: "Diagnosis is required" }, { status: 400 });
        }

        console.log(`Processing prescription request for diagnosis: ${diagnosis}`);

        const prompt = `You are a medical assistant. Given a diagnosis, suggest a safe and basic prescription.

        Diagnosis: ${diagnosis}
        
        Respond in the following format, keeping each section clear and on separate lines. Limit each list to a maximum of 5 items.
        
        Name: [Medication Name]
        Dosage: [Dosage Instructions]
        Side Effects:
        - [Side effect 1]
        - [Side effect 2]
        - ...
        Alternatives:
        - [Alternative 1]
        - ...
        Contraindications:
        - [Contraindication 1]
        - ...
        `;
        

        const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
        const result = await model.generateContent(prompt);
        const outputText = result.response.text();

        if (!outputText) {
            console.error("Empty response from Gemini API");
            return NextResponse.json({ 
                error: "Could not extract text from Gemini response" 
            }, { status: 500 });
        }

        const parsedData = parsePrescription(outputText);

        return NextResponse.json(parsedData);
    } catch (error) {
        console.error("Error in prescription API:", error);
        return NextResponse.json({ 
            error: "Internal Server Error" 
        }, { status: 500 });
    }
}

function parsePrescription(text: string) {
    const prescription = {
        name: extractValue(text, "Name:") || "Unknown medication",
        dosage: extractValue(text, "Dosage:") || "Consult with doctor",
        sideEffects: extractArray(text, "Side Effects:"),
        alternatives: extractArray(text, "Alternatives:"),
        contraindications: extractArray(text, "Contraindications:")
    };
    return prescription;
}

// Helper function to extract a single value from the text
function extractValue(text: string, key: string): string {
    const regex = new RegExp(`${key}\\s*(.+?)(?=\\n\\w+:|$)`, "s");
    const match = text.match(regex);
    return match ? match[1].trim() : "";
}

function extractArray(text: string, key: string): string[] {
    const value = extractValue(text, key);
    if (!value) return [];
    
    return value
        .split(/,|\n/)
        .map(item => item.trim())
        .filter(item => item.length > 0);
}