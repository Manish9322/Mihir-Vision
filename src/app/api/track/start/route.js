
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Visit from '@/models/visit.model.js';
import { getVisitorId, parseUserAgent } from '@/lib/utils/tracking.js';

export async function POST(request) {
  try {
    await _db();
    const body = await request.json();
    const { page } = body;

    const visitorId = getVisitorId(request);
    const { os, browser, deviceType } = parseUserAgent(request);
    const ipAddress = request.headers.get('x-forwarded-for') || request.ip;

    const newVisit = new Visit({
      visitorId,
      page,
      ipAddress,
      os,
      browser,
      deviceType,
      entryTime: new Date(),
    });

    await newVisit.save();

    return NextResponse.json({ visitId: newVisit._id }, { status: 201 });
  } catch (error) {
    console.error('Error tracking start:', error);
    return NextResponse.json({ message: 'Error tracking start.', error: error.message }, { status: 500 });
  }
}
