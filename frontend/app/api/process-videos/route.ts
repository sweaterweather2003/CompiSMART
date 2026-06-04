import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { youtube_url, instagram_url } = await req.json();

    if (!youtube_url || !instagram_url) {
      return NextResponse.json({ error: "Both URLs are required" }, { status: 400 });
    }

    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://127.0.0.1:8001';

    const response = await fetch(`${BACKEND_URL}/api/process-videos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ youtube_url, instagram_url }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json({ error: data.detail || "Processing failed" }, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error: any) {
    console.error("Process videos error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
