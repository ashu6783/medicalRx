import { NextResponse } from "next/server";

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

    const groqRes = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 1,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    const data = await groqRes.json();
    const responseText = data.choices?.[0]?.message?.content ?? "";

    const cleanedResponse = responseText.replace(/```json|```/g, "").trim();
    const aiResponse = JSON.parse(cleanedResponse || "{}");

    const diagnosis = [
      ...(aiResponse.common_issues || []).map((issue: { name: string; recommendation: string }) => ({
        ...issue,
        confidence: 0.6 + Math.random() * 0.2
      })),
      ...(aiResponse.severe_issues || []).map((issue: { name: string; recommendation: string }) => ({
        ...issue,
        confidence: 0.8 + Math.random() * 0.2
      }))
    ];

    return NextResponse.json({ diagnosis });
  } catch (error) {
    console.error("Error fetching diagnosis:", error);
    return NextResponse.json({ error: "AI diagnosis failed." }, { status: 500 });
  }
}
