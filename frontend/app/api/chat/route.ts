import { StreamingTextResponse } from 'ai';

export async function POST(req: Request) {
  const { messages } = await req.json();

  const latestMessage = messages[messages.length - 1].content;
  const chatHistory = messages.slice(0, -1).map((m: { role: string; content: string }) => ({
    role: m.role,
    content: m.content,
  }));

  // Fallback to localhost dynamically if the live environment variable isn't configured
  const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8001';

  const response = await fetch(`${BACKEND_URL}/api/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      question: latestMessage,
      chat_history: chatHistory,
    }),
  });

  if (!response.body) throw new Error("No response body");
  
  return new StreamingTextResponse(response.body);
}
