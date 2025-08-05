import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function POST(req: NextRequest) {
  const { message } = await req.json();

  const completion = await openai.chat.completions.create({
    model: 'gpt-4',
    messages: [
      { role: 'system', content: 'You are a friendly and accurate FHA mortgage assistant. Use Govies.com logic.' },
      { role: 'user', content: message }
    ],
  });

  return NextResponse.json({ reply: completion.choices[0].message.content });
}