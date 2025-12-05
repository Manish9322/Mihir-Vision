
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import Sport from '@/models/sport.model.js';

const seedSports = [
    { name: 'Ice Hockey', description: 'A fast-paced winter sport.', eventTypes: ['Goal', 'Assist', 'Penalty', 'Faceoff Win', 'Shot on Goal', 'Hit', 'Blocked Shot'] },
    { name: 'Soccer', description: 'The world\'s most popular sport.', eventTypes: ['Goal', 'Assist', 'Yellow Card', 'Red Card', 'Foul', 'Corner Kick', 'Shot'] },
    { name: 'Basketball', description: 'A game of hoops.', eventTypes: ['Point', 'Assist', 'Rebound', 'Steal', 'Block', 'Foul'] },
];

export async function GET() {
  try {
    await _db();
    let sports = await Sport.find().sort({ name: 1 });
    if (!sports || sports.length === 0) {
      await Sport.deleteMany({});
      sports = await Sport.insertMany(seedSports);
    }
    return NextResponse.json(sports, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching sports.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        
        if (!Array.isArray(body)) {
            return NextResponse.json({ message: 'Request body must be an array of sports.' }, { status: 400 });
        }

        await Sport.deleteMany({});
        
        const sportsToInsert = body.map(sport => {
            if (sport._id && String(sport._id).startsWith('new_')) {
                delete sport._id;
            }
            return sport;
        });
        
        const newSports = await Sport.insertMany(sportsToInsert);
        return NextResponse.json(newSports, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating sports.', error: error.message }, { status: 500 });
    }
}
