
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Settings from '@/models/settings.model.js';

const seedSettingsData = {
    siteName: 'Mihir Vision',
    siteTagline: 'Forging new paths to the peak of innovation.',
};

export async function GET() {
  try {
    await _db();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create(seedSettingsData);
    }
    return NextResponse.json(settings, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching settings.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        const updatedSettings = await Settings.findOneAndUpdate({}, body, {
            new: true,
            upsert: true, 
            runValidators: true,
        });
        return NextResponse.json(updatedSettings, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating settings.', error: error.message }, { status: 500 });
    }
}
