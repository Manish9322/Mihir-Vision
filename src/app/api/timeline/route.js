
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Timeline from '@/models/timeline.model.js';

const seedTimelineEvents = [
    { year: '2018', title: 'The Spark', description: 'Pinnacle Pathways was founded by a small group of innovators with a shared vision for the future.', icon: 'Lightbulb', order: 0 },
    { year: '2020', title: 'First Breakthrough', description: 'Launched our first major project, revolutionizing data processing with a new proprietary algorithm.', icon: 'Target', order: 1 },
    { year: '2022', title: 'Global Expansion', description: 'Opened our first international office and began forming strategic partnerships across the globe.', icon: 'Users', order: 2 },
    { year: '2024', title: 'AI Integration', description: 'Successfully integrated our advanced AI platform across all core operations, boosting efficiency and innovation.', icon: 'Bot', order: 3 },
];

export async function GET() {
  try {
    await _db();
    let events = await Timeline.find().sort({ order: 1 });
    if (!events || events.length === 0) {
      await Timeline.deleteMany({});
      events = await Timeline.insertMany(seedTimelineEvents);
    }
    return NextResponse.json(events, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching timeline events.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of events.' }, { status: 400 });
        }

        await Timeline.deleteMany({});
        
        const eventsToInsert = body.map((event, index) => {
            const newEvent = { ...event, order: index };
            if (newEvent._id && typeof newEvent._id === 'string' && newEvent._id.startsWith('new_')) {
                delete newEvent._id;
            }
            return newEvent;
        });

        const newEvents = await Timeline.insertMany(eventsToInsert);

        return NextResponse.json(newEvents, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating timeline events.', error: error.message }, { status: 500 });
    }
}
