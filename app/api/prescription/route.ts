import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    let { diagnosis } = await req.json();

    if (!diagnosis) {
      return NextResponse.json({ error: "Diagnosis is required" }, { status: 400 });
    }

    // Convert string to array if needed
    if (typeof diagnosis === "string") {
      diagnosis = [diagnosis];
    }

    if (!Array.isArray(diagnosis) || diagnosis.length === 0) {
      return NextResponse.json({ error: "Diagnosis must be a non-empty array" }, { status: 400 });
    }

    const prompt = `You are a medical assistant. Given a diagnosis, suggest a safe and basic prescription.

Diagnosis: ${diagnosis.join(", ")}

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

    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    const data = await res.json();
    const outputText = data.choices?.[0]?.message?.content ?? "";

    if (!outputText) {
      return NextResponse.json({ error: "Empty response from Groq" }, { status: 500 });
    }

    const parsedData = parsePrescription(outputText);
    return NextResponse.json(parsedData);
  } catch (error) {
    console.error("Error in prescription API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

function parsePrescription(text: string) {
  return {
    name: extractValue(text, "Name:") || "Unknown medication",
    dosage: extractValue(text, "Dosage:") || "Consult with doctor",
    sideEffects: extractArray(text, "Side Effects:"),
    alternatives: extractArray(text, "Alternatives:"),
    contraindications: extractArray(text, "Contraindications:")
  };
}

function extractValue(text: string, key: string): string {
  const regex = new RegExp(`${key}\\s*(.+?)(?=\\n\\w+:|$)`, "s");
  const match = text.match(regex);
  return match ? match[1].trim() : "";
}

function extractArray(text: string, key: string): string[] {
  const value = extractValue(text, key);
  if (!value) return [];
  return value
    .split(/,|\n|-/)
    .map(item => item.trim())
    .filter(item => item.length > 0 && item.toLowerCase() !== key.toLowerCase().replace(":", ""));
}
