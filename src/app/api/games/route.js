// This file is obsolete and will be removed. The new logic is in /api/matches.
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json([], { status: 200 });
}

export async function POST(request) {
  return NextResponse.json({ message: 'This endpoint is deprecated. Please use /api/matches.' }, { status: 410 });
}
