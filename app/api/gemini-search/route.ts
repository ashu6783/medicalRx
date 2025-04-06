// Not implemented yet it will be used to search for medicines using Gemini API (further features will be added later)
import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: Request) {
  const { query } = await req.json();

  const model = genAI.getGenerativeModel({ model: 'gemini-1.5-pro' });
  const prompt = `You are a medical assistant. Provide concise, patient-friendly information about the medicine "${query}" including its usage,dosage,five common side effects, and the top 5 precautions.`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    return NextResponse.json({ result: text });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch Gemini response' }, { status: 500 });
  }
}
