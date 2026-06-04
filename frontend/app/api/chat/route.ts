import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { input, chat_history } = await req.json();

    const response = await fetch('http://127.0.0.1:8001/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input, chat_history: chat_history || [] }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || "Chat failed" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Backend connection failed" }, { status: 500 });
  }
}
