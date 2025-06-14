import { NextResponse } from "next/server";

const removeAsterisks = (text: string): string => {
  return text.replace(/\*/g, "").trim();
};

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: "Please provide a valid message." }, { status: 400 });
    }

    const prompt = `You are a healthcare AI chatbot. Answer the following query in a helpful and concise manner:
"${message}"
Provide medically relevant advice in a professional yet simple-to-understand tone.`;

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "llama3-8b-8192",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1024,
        top_p: 1,
        stream: false
      })
    });

    const data = await response.json();

    const responseText = data?.choices?.[0]?.message?.content ?? "";

    if (!responseText) {
      throw new Error("No response from Groq AI.");
    }

    const cleanedResponseText = removeAsterisks(responseText);

    return NextResponse.json({ response: cleanedResponseText });

  } catch (error) {
    console.error("Error in chatbot response:", error);
    return NextResponse.json({ error: "AI chatbot failed to generate a response." }, { status: 500 });
  }
}
