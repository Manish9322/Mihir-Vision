
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Match from '@/models/match.model.js';

export async function GET() {
  try {
    await _db();
    const matches = await Match.find().sort({ matchDate: -1 });
    return NextResponse.json(matches, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching matches.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        const newMatch = await Match.create(body);
        return NextResponse.json(newMatch, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating match.', error: error.message }, { status: 500 });
    }
}
