import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const apiKey = process.env.PERENUAL_API_KEY;

  if (!apiKey) {
    return NextResponse.json(
      { error: 'PERENUAL_API_KEY is not configured' },
      { status: 500 },
    );
  }

  const page = req.nextUrl.searchParams.get('page') ?? '1';

  const res = await fetch(
    `https://perenual.com/api/species-list?key=${apiKey}&page=${page}&indoor=1`,
  );

  if (!res.ok) {
    return NextResponse.json(
      { error: `Perenual API error: ${res.statusText}` },
      { status: res.status },
    );
  }

  const data = await res.json();
  return NextResponse.json(data);
}
