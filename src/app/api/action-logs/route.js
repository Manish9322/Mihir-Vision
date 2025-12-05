
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import ActionLog from '@/models/actionLog.model.js';

export async function GET() {
  try {
    await _db();
    const logs = await ActionLog.find().sort({ timestamp: -1 });
    return NextResponse.json(logs, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching action logs.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        const newLog = await ActionLog.create(body);
        return NextResponse.json(newLog, { status: 201 });
    } catch (error) {
        return NextResponse.json({ message: 'Error creating action log.', error: error.message }, { status: 500 });
    }
}
