import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Redis } from "@upstash/redis";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL!,
  token: process.env.UPSTASH_REDIS_REST_TOKEN!,
});

const RATE_LIMIT = 5; 
const TIME_WINDOW_SEC = 60;

const removeAsterisks = (text: string): string => {
  return text.replace(/\*/g, '').trim();
};

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const redisKey = `rate-limit:${ip}`;

    const reqCount = await redis.incr(redisKey);
    if (reqCount === 1) {
      await redis.expire(redisKey, TIME_WINDOW_SEC);
    }

    if (reqCount > RATE_LIMIT) {
      return NextResponse.json({
        error: "Rate limit exceeded. Please wait a minute before trying again."
      }, { status: 429 });
    }

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

    //Sice the response contains asterisks, we need to remove them to get the final response.
    // This is a workaround to remove asterisks from the response text.

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
