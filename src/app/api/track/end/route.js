
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Visit from '@/models/visit.model.js';

export async function POST(request) {
  try {
    await _db();
    const body = await request.json();
    const { visitId } = body;

    if (!visitId) {
      return NextResponse.json({ message: 'visitId is required.' }, { status: 400 });
    }

    const visit = await Visit.findById(visitId);

    if (!visit) {
      return NextResponse.json({ message: 'Visit not found.' }, { status: 404 });
    }

    // Only update if exitTime is not already set
    if (!visit.exitTime) {
        visit.exitTime = new Date();
        visit.duration = (visit.exitTime.getTime() - visit.entryTime.getTime()) / 1000; // duration in seconds
        await visit.save();
    }

    return NextResponse.json({ message: 'Visit ended successfully.' }, { status: 200 });
  } catch (error) {
    console.error('Error tracking end:', error);
    return NextResponse.json({ message: 'Error tracking end.', error: error.message }, { status: 500 });
  }
}
