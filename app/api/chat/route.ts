import { OpenAI } from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

// Initialize OpenAI with your API key
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

// API Route handler
export const POST = async (req: Request) => {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: 'gpt-4',
    stream: true,
    messages
  });

  const stream = OpenAIStream(response);
  return new StreamingTextResponse(stream);
};
