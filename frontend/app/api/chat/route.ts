import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { input, chat_history } = await req.json();

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8001';

    const response = await fetch(`${BACKEND_URL}/api/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 
        input, 
        chat_history: chat_history || [] 
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ 
        error: data.detail || "Chat processing failed" 
      }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Chat error:", error);
    return NextResponse.json({ 
      error: "Failed to connect to backend service" 
    }, { status: 500 });
  }
}
