
import { NextResponse } from 'next/server';
import _db from "@/lib/utils/db.js";
import State from '@/models/state.model.js';

const seedStates = [{ name: 'California', description: 'The Golden State', country: 'USA' }];

export async function GET() {
  try {
    await _db();
    let states = await State.find().sort({ name: 1 });
     if (!states || states.length === 0) {
        states = await State.insertMany(seedStates);
    }
    return NextResponse.json(states, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching states.', error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
    try {
        await _db();
        const body = await request.json();
        await State.deleteMany({});
        
        const statesToInsert = body.map(state => {
            if (state._id && String(state._id).startsWith('new_')) {
                delete state._id;
            }
            return state;
        });

        const newStates = await State.insertMany(statesToInsert);
        return NextResponse.json(newStates, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: 'Error updating states.', error: error.message }, { status: 500 });
    }
}
