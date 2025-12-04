
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import ActionLog from '@/models/actionLog.model.js';

const seedLogs = [
  { user: 'Admin User', action: 'updated the About section', section: 'About', type: 'UPDATE', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000) },
  { user: 'Admin User', action: 'added a new project "Project Hydra"', section: 'Projects', type: 'CREATE', timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000) },
  { user: 'Admin User', action: 'deleted team member "John Smith"', section: 'Team', type: 'DELETE', timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) },
  { user: 'Admin User', action: 'updated general site settings', section: 'Settings', type: 'UPDATE', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) },
  { user: 'Admin User', action: 'added a new image to the Gallery', section: 'Gallery', type: 'CREATE', timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) },
];


export async function GET() {
  try {
    await _db();
    let logs = await ActionLog.find().sort({ timestamp: -1 });
    if (!logs || logs.length === 0) {
      await ActionLog.deleteMany({});
      logs = await ActionLog.insertMany(seedLogs);
    }
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
